import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  myProfile,
  getAllUsers,
} from "../controllers/authController.js";

import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Auth
router.post("/register", register);
router.post("/login", login);

// Password Reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Profile (USER + ADMIN)
router.get("/my-profile", protect, authorize("user", "admin"), myProfile);
router.get("/all", protect, getAllUsers);

// ADMIN ONLY Example
router.get("/admin-only-data", protect, authorize("admin"), (req, res) => {
  res.json({ success: true, message: "Admin access granted" });
});

export default router;
