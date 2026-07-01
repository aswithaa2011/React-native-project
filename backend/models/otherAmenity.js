import mongoose from "mongoose";

const otherAmenitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    createdBy: {
      type: String,
      trim: true,
    },

    updatedBy: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const OtherAmenity = mongoose.model(
  "OtherAmenity",
  otherAmenitySchema
);

export default OtherAmenity;