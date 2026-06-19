import express from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userProfile.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getUserProfile);
router.get("/:userId", protect, getUserProfile);
router.put("/update", protect, updateUserProfile);

export default router;
