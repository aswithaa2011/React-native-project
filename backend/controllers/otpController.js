import User from "../models/User.js";
import Otp from "../models/Otp.js";
import otpGenerator from "otp-generator";
import sendEmail from "../utils/sendEmail.js";

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    await Otp.findOneAndDelete({ email });

    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error in sendOTP:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (otpRecord.otp !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isVerified = true;
    await user.save();

    await Otp.deleteOne({ email });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Error in verifyOTP:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const otpRecord = await Otp.findOne({ email });

    if (otpRecord) {
      const timeDiff = (new Date() - otpRecord.createdAt) / 1000;
      if (timeDiff < 60) {
        return res.status(400).json({
          success: false,
          message: `Please wait ${Math.ceil(60 - timeDiff)} seconds before resending OTP`,
        });
      }
      
      // Remove the old OTP
      await Otp.deleteOne({ email });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Add the new OTP in the database
    await Otp.create({
      email,
      otp,
      expiresAt,
    });

    await sendEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error in resendOTP:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
