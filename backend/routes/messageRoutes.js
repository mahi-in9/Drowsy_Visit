// routes/messageRoutes.js
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

// 🔹 Send a new message
router.post("/send", protect, sendMessage);

// 🔹 Fetch messages of a chat (supports pagination)
router.get("/:chatId", protect, getMessages);

// 🔹 Edit a message (sender only)
router.put("/edit", protect, editMessage);

// 🔹 Delete a message (for me / everyone)
router.put("/delete", protect, deleteMessage);

// 🔹 React to a message (emoji reactions)
router.put("/react", protect, reactToMessage);

export default router;
