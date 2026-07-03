import express from "express";
import {
  getMyProfile,
  getUserProfile,
  updateUserProfile,
  updateAccountType,
} from "../controllers/userProfile.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
//user access the datas
router.get("/", protect, getMyProfile); 
router.put("/update", protect, updateUserProfile);
router.patch("/account-type", protect, updateAccountType);

//another user get your profile view api
router.get("/:userId", getUserProfile);

export default router;


// /api/profile
// /api/profile/update
// /api/profile/:userId
// /api/profile/account-type
