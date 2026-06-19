import express from "express";
import { registerAdmin, loginAdmin } from "../controllers/adminAuthController.js";

const router = express.Router();

// POST /api/admin/auth/register
router.post("/register", registerAdmin);

// POST /api/admin/auth/login
router.post("/login", loginAdmin);

export default router;
