import express from "express";
import {
  submitIdentityVerification,
  getIdentityVerification,
  updateIdentityVerification,
  submitPropertyVerification,
  getPropertyVerifications,
  updatePropertyVerification,
} from "../controllers/verificationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes are protected
router.use(protect);

router.route("/identity")
  .post(submitIdentityVerification)
  .get(getIdentityVerification)
  .put(updateIdentityVerification);

router.route("/property")
  .post(submitPropertyVerification)
  .get(getPropertyVerifications)
  .put(updatePropertyVerification);

export default router;


// /api/verification/identity
// /api/verification/property
