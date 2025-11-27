import express from "express";
import { protect } from "../middlewares/auth.js";

import {
  accessChat,
  createGroup,
  addMember,
  removeMember,
  renameGroup,
  getUserChats,
} from "../controllers/chatController.js";

const router = express.Router();

// 🔹 Access or create one-to-one chat
router.post("/access", protect, accessChat);

// 🔹 Create group chat
router.post("/group", protect, createGroup);

// 🔹 Add member to group
router.put("/group/add", protect, addMember);

// 🔹 Remove member from group
router.put("/group/remove", protect, removeMember);

// 🔹 Rename group
router.put("/group/rename", protect, renameGroup);

// 🔹 Fetch all chats of logged-in user
router.get("/my-chats", protect, getUserChats);

export default router;
