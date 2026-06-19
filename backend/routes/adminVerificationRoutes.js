import express from "express";
import {
  getIdentityVerifications,
  getIdentityVerificationById,
  approveIdentityVerification,
  rejectIdentityVerification,
  getHostelVerifications,
  getHostelVerificationById,
  approveHostelVerification,
  rejectHostelVerification,
} from "../controllers/adminVerificationController.js";
import { adminProtect } from "../middlewares/adminMiddleware.js";

const router = express.Router();

// All routes are protected — requires valid Admin JWT
router.use(adminProtect);

// Identity Verification Admin Routes
router.route("/identity")
  .get(getIdentityVerifications);

router.route("/identity/:id")
  .get(getIdentityVerificationById);

router.route("/identity/:id/approve")
  .patch(approveIdentityVerification);

router.route("/identity/:id/reject")
  .patch(rejectIdentityVerification);

// Hostel Verification Admin Routes
router.route("/hostel")
  .get(getHostelVerifications);

router.route("/hostel/:id")
  .get(getHostelVerificationById);

router.route("/hostel/:id/approve")
  .patch(approveHostelVerification);

router.route("/hostel/:id/reject")
  .patch(rejectHostelVerification);

export default router;
