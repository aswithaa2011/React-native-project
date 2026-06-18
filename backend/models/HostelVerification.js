import mongoose from "mongoose";

const hostelVerificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
      required: true,
    },
    hostelId: {
      type: String,
      ref: "Hostel",
      required: true,
    },
    verificationType: {
      type: String,
      default: "Owner",
    },
    documentType: {
      type: String,
      required: true,
    },
    documentNumber: {
      type: String,
      required: true,
    },
    documentImage: {
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

// Only one verification per hostel
hostelVerificationSchema.index({ hostelId: 1 }, { unique: true });

export default mongoose.model("HostelVerification", hostelVerificationSchema);
