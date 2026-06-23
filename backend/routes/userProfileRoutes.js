import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  updateAccountType,
} from "../controllers/userProfile.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getUserProfile);
router.get("/:userId", protect, getUserProfile);
router.put("/update", protect, updateUserProfile);
router.patch("/account-type", protect, updateAccountType);

export default router;
