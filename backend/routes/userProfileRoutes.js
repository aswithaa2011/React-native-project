import express from "express";
import {
  getMyProfile,
  getUserProfile,
  updateUserProfile,
  updateAccountType,
} from "../controllers/userProfile.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyProfile);
router.get("/:userId", getUserProfile);
router.put("/update", protect, updateUserProfile);
router.patch("/account-type", protect, updateAccountType);

export default router;


// /api/profile
// /api/profile/update
// /api/profile/:userId
// /api/profile/account-type
