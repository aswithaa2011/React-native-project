import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

// Protect routes — verify admin JWT and attach admin to req.admin
export const adminProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback_secret"
      );

      // Confirm the token belongs to an admin
      if (decoded.role !== "Admin") {
        return res.status(403).json({
          success: false,
          message: "Not authorized as an admin",
        });
      }

      req.admin = await Admin.findById(decoded.id).select("-password");

      if (!req.admin) {
        return res.status(401).json({
          success: false,
          message: "Not authorized, admin not found",
        });
      }

      // Also expose req.user so existing adminVerificationController works
      req.user = { _id: req.admin._id, role: "Admin" };

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    });
  }
};

// Legacy role-check middleware (kept for backward compatibility)
export const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }
};

