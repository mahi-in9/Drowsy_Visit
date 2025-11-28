// controllers/messageController.js
import Message from "../models/message.js";
import Chat from "../models/chat.js";

/* ============================================================
   Helper: populate message fully (sender, chat, reactions)
============================================================ */
const populateMessage = async (id) => {
  return Message.findById(id)
    .populate("sender", "name email username profilePic")
    .populate("chat", "isGroup members")
    .populate("reactions.user", "name username profilePic email");
};

/* ============================================================
   SEND MESSAGE
============================================================ */
export const sendMessage = async (req, res) => {
  try {
    const { chatId, content, type = "text" } = req.body;

    if (!chatId || !content) {
      return res
        .status(400)
        .json({ success: false, message: "chatId & content are required" });
    }

    // Create message
    const message = await Message.create({
      sender: req.user._id,
      chat: chatId,
      content,
      type,
      status: [
        {
          user: req.user._id,
          status: "sent",
          updatedAt: new Date(),
        },
      ],
    });

    // Update chat last message
    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

    const populated = await populateMessage(message._id);

    // inside sendMessage controller AFTER `const populated = await populateMessage(...);`
    try {
      const io = req.app.get("io"); // set io in server bootstrap: app.set("io", io)
      if (io) {
        const chat = populated.chat;
        if (chat && Array.isArray(chat.members)) {
          // emit to each member's personal room except sender
          chat.members.forEach((m) => {
            const userId = String(m._id ?? m);
            if (userId === String(req.user._id)) return;
            io.to(userId).emit("message_received", populated);
          });
        }
        // also emit into chat room for clients listening by chatId (if used)
        io.to(String(chat._id)).emit("message_created", populated);
      }
    } catch (e) {
      console.error("sendMessage socket emit error:", e);
    }

    return res.status(201).json({
      success: true,
      message: populated,
    });
  } catch (error) {
    console.error("Send Message Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ============================================================
   GET MESSAGES (with pagination)
   /api/message/:chatId?page=1&limit=30
============================================================ */
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 40;

    const skip = (page - 1) * limit;

    const messages = await Message.find({ chat: chatId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .populate("sender", "name username profilePic email")
      .populate("reactions.user", "name username profilePic email");

    const total = await Message.countDocuments({ chat: chatId });

    return res.status(200).json({
      success: true,
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get Messages Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ============================================================
   EDIT MESSAGE
============================================================ */
export const editMessage = async (req, res) => {
  try {
    const { messageId, newContent } = req.body;

    if (!messageId || !newContent)
      return res
        .status(400)
        .json({ success: false, message: "messageId & newContent required" });

    const message = await Message.findById(messageId);

    if (!message)
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });

    if (message.sender.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "You can edit only your messages" });
    }

    message.content = newContent;
    message.isEdited = true;

    await message.save();

    const populated = await populateMessage(message._id);

    return res.status(200).json({
      success: true,
      message: populated,
    });
  } catch (error) {
    console.error("Edit Message Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ============================================================
   DELETE MESSAGE (for me / for everyone)
============================================================ */
export const deleteMessage = async (req, res) => {
  try {
    const { messageId, forEveryone = false } = req.body;

    const message = await Message.findById(messageId);

    if (!message)
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });

    // Delete for everyone — only sender allowed
    if (forEveryone) {
      if (message.sender.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ success: false, message: "Not allowed to delete" });
      }

      message.isDeletedForEveryone = true;
      message.content = "";
      await message.save();
      return res.status(200).json({ success: true });
    }

    // Delete for me (safe, no duplicates)
    if (!message.deletedFor.includes(req.user._id)) {
      message.deletedFor.push(req.user._id);
      await message.save();
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete Message Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ============================================================
   MESSAGE REACTIONS (emoji)
============================================================ */
export const reactToMessage = async (req, res) => {
  try {
    const { messageId, emoji } = req.body;

    if (!messageId || !emoji)
      return res
        .status(400)
        .json({ success: false, message: "messageId & emoji required" });

    const message = await Message.findById(messageId);

    if (!message)
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });

    const existing = message.reactions.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (existing) {
      existing.emoji = emoji; // update
    } else {
      message.reactions.push({ user: req.user._id, emoji });
    }

    await message.save();

    const populated = await populateMessage(message._id);

    return res.status(200).json({
      success: true,
      message: populated,
    });
  } catch (error) {
    console.error("React Message Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
