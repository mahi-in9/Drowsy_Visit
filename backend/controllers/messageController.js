import Message from "../models/message.js";
import Chat from "../models/chat.js";

export const sendMessage = async (req, res) => {
  try {
    const { chatId, content, type } = req.body;

    if (!chatId || !content) {
      return res.status(400).json({ message: "chatId & content required" });
    }

    const message = await Message.create({
      sender: req.user._id,
      chat: chatId,
      content,
      type: type || "text",
      status: [], // will fill via socket events
    });

    // Update last message in chat
    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email")
      .populate("chat");

    return res.status(201).json({ success: true, message: populatedMessage });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name email")
      .populate("reactions.user", "name email")
      .sort({ createdAt: 1 });

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const editMessage = async (req, res) => {
  try {
    const { messageId, newContent } = req.body;

    const message = await Message.findById(messageId);

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your message" });
    }

    message.content = newContent;
    message.isEdited = true;
    await message.save();

    return res.status(200).json({ success: true, message });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId, forEveryone } = req.body;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (forEveryone) {
      // Only sender can delete for everyone
      if (message.sender.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not allowed" });
      }

      message.isDeletedForEveryone = true;
      message.content = "";
    } else {
      // Delete only for me
      message.deletedFor.push(req.user._id);
    }

    await message.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const reactToMessage = async (req, res) => {
  try {
    const { messageId, emoji } = req.body;

    const message = await Message.findById(messageId);

    const existingReaction = message.reactions.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (existingReaction) {
      existingReaction.emoji = emoji; // update reaction
    } else {
      message.reactions.push({
        user: req.user._id,
        emoji,
      });
    }

    await message.save();

    return res.status(200).json({ success: true, message });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

