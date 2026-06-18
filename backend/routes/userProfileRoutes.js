import express from "express";
import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userProfile.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createUserProfile);
router.get("/", protect, getUserProfile);
router.get("/:userId", protect, getUserProfile);
router.put("/update", protect, updateUserProfile);

export default router;
