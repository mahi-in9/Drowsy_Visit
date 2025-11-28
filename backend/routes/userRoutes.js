import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  getAllUsers,
  followUser,
  unfollowUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/all", protect, getAllUsers);
router.put("/follow/:id", protect, followUser);
router.put("/unfollow/:id", protect, unfollowUser);

export default router;
