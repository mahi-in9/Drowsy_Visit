import Chat from "../models/chat.js";
import User from "../models/user.js";

export const accessChat = async (req, res) => {
  try {
    const { userId } = req.body; // the person you want to message

    if (!userId) {
      return res.status(400).json({ message: "UserId required" });
    }

    // Check if DM chat already exists
    let chat = await Chat.findOne({
      isGroup: false,
      members: { $all: [req.user._id, userId] },
    })
      .populate("members", "name email")
      .populate("lastMessage");

    if (chat) {
      return res.status(200).json({ success: true, chat });
    }

    // Create new DM chat
    const newChat = await Chat.create({
      isGroup: false,
      members: [req.user._id, userId],
    });

    const populatedChat = await Chat.findById(newChat._id).populate(
      "members",
      "name email"
    );

    return res.status(201).json({ success: true, chat: populatedChat });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;

    if (!name || !members || members.length < 2) {
      return res.status(400).json({
        message: "Group must have a name and at least 2 other members",
      });
    }

    const group = await Chat.create({
      name,
      isGroup: true,
      members: [...members, req.user._id],
      admins: [req.user._id],
    });

    const populatedGroup = await Chat.findById(group._id).populate(
      "members",
      "name email"
    );

    return res.status(201).json({ success: true, group: populatedGroup });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const addMember = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat.isGroup) {
      return res.status(400).json({ message: "Not a group chat" });
    }

    chat.members.push(userId);
    await chat.save();

    return res.status(200).json({ success: true, chat });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const chat = await Chat.findById(chatId);

    chat.members = chat.members.filter(
      (id) => id.toString() !== userId.toString()
    );

    await chat.save();
    return res.status(200).json({ success: true, chat });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const renameGroup = async (req, res) => {
  try {
    const { chatId, name } = req.body;

    const chat = await Chat.findByIdAndUpdate(chatId, { name }, { new: true });

    return res.status(200).json({ success: true, chat });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      members: req.user._id,
    })
      .populate("members", "name email")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    return res.status(200).json({ success: true, chats });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
