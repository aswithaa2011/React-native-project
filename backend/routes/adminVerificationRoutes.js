import express from "express";
import {
  getIdentityVerifications,
  getIdentityVerificationById,
  approveIdentityVerification,
  rejectIdentityVerification,
  getPropertyVerifications,
  getPropertyVerificationById,
  approvePropertyVerification,
  rejectPropertyVerification,
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

// Property Verification Admin Routes
router.route("/property")
  .get(getPropertyVerifications);

router.route("/property/:id")
  .get(getPropertyVerificationById);

router.route("/property/:id/approve")
  .patch(approvePropertyVerification);

router.route("/property/:id/reject")
  .patch(rejectPropertyVerification);

export default router;


// /api/admin/verify/identity
// /api/admin/verify/identity/:id
// /api/admin/verify/identity/:id/approve
// /api/admin/verify/identity/:id/reject

// /api/admin/verify/property
// /api/admin/verify/property/:id
// /api/admin/verify/property/:id/approve
// /api/admin/verify/property/:id/reject
