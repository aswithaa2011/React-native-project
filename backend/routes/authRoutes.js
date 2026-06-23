import express from "express";
import {
  sendOTP,
  verifyOTP,
  resendOTP,
} from "../controllers/otpController.js";



const router = express.Router();

router.post("/sendOtp", sendOTP);
router.post("/verifyOtp", verifyOTP);
router.post("/resendOtp", resendOTP);

export default router;

