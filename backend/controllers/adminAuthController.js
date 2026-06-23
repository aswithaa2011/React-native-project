import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import Admin from "../models/Admin.js";

// Generate JWT for admin
const generateAdminToken = (id) => {
  return jwt.sign(
    { id, role: "Admin" },
    process.env.JWT_SECRET || "fallback_secret",
    { expiresIn: "7d" }
  );
};

// @desc    Register a new admin
// @route   POST /api/admin/auth/register
// @access  Public (lock this down in production with a secret key)
export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    res.status(400);
    throw new Error("Name and password are required");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  // Prevent duplicate admin names
  const existing = await Admin.findOne({ name });
  if (existing) {
    res.status(409);
    throw new Error("Admin with this name already exists");
  }

  const admin = await Admin.create({ name, password });

  res.status(201).json({
    success: true,
    message: "Admin registered successfully",
    data: {
      _id: admin._id,
      name: admin.name,
      token: generateAdminToken(admin._id),
    },
  });
});

// @desc    Login as admin
// @route   POST /api/admin/auth/login
// @access  Public
export const loginAdmin = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    res.status(400);
    throw new Error("Name and password are required");
  }

  const admin = await Admin.findOne({ name });

  if (!admin || !(await admin.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid name or password");
  }

  res.status(200).json({
    success: true,
    message: "Admin logged in successfully",
    data: {
      _id: admin._id,
      name: admin.name,
      token: generateAdminToken(admin._id),
    },
  });
});
