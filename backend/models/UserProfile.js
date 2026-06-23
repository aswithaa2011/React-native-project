import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    role: {
      type: String,
      default: "User",
    },
    verification: {
      identity: {
        verificationId: { type: String },
        isVerified: { type: Boolean, default: false },
      },
      propertyOwner: {
        verificationId: { type: String },
        isVerified: { type: Boolean, default: false },
      },
    },
    currentStay: {
      propertyId: { type: String },
      joinedDate: { type: Date },
      isCurrentlyStaying: { type: Boolean, default: false },
    },
    stayHistory: {
      type: Array,
      default: [],
    },
    accountType: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserProfile", userProfileSchema);
