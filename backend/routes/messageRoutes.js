import express from "express";
import { protect } from "../middlewares/auth.js";

import {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
  reactToMessage,
} from "../controllers/messageController.js";

const router = express.Router();

// 🔹 Send message
router.post("/send", protect, sendMessage);

// 🔹 Get messages of a chat
router.get("/:chatId", protect, getMessages);

// 🔹 Edit message
router.put("/edit", protect, editMessage);

// 🔹 Delete message (for me / for everyone)
router.put("/delete", protect, deleteMessage);

// 🔹 React to a message (emoji)
router.put("/react", protect, reactToMessage);

export default router;
