import express from "express";
import {
  sendOtp,
  signup,
  login,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);

router.post("/signup", signup);

router.post("/login", login);

export default router;