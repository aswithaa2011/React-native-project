import express from "express";
import {
  submitIdentityVerification,
  getIdentityVerification,
  updateIdentityVerification,
  submitHostelVerification,
  getHostelVerifications,
  updateHostelVerification,
} from "../controllers/verificationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes are protected
router.use(protect);

router.route("/identity")
  .post(submitIdentityVerification)
  .get(getIdentityVerification)
  .put(updateIdentityVerification);

router.route("/hostel")
  .post(submitHostelVerification)
  .get(getHostelVerifications)
  .put(updateHostelVerification);

export default router;
