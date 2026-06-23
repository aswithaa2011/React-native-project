import mongoose from "mongoose";

const identityVerificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
      required: true,
      unique: true, // Only one verification document per user
    },
    verificationType: {
      type: String,
      default: "Identity",
    },
    governmentIdType: {
      type: String,
      required: true,
    },
    governmentIdNumber: {
      type: String,
      required: true,
    },
    governmentIdFrontImage: {
      type: String,
      required: true,
    },
    governmentIdBackImage: {
      type: String,
      required: true,
    },
    selfieImage: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("IdentityVerification", identityVerificationSchema);
