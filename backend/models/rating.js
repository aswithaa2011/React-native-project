import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,

    },

    user: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserProfile",
        required: true,
      },
    },

    stayDetails: {
      type: Object,
      default: {},
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    review: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    categoryRatings: {
      cleanliness: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      security: { type: Number, default: 0 },
      wifi: { type: Number, default: 0 },
      staff: { type: Number, default: 0 },
      location: { type: Number, default: 0 },
      waterFacility: { type: Number, default: 0 },
      valueForMoney: { type: Number, default: 0 },
    },

    pros: [
      {
        type: String,
        trim: true,
      },
    ],

    cons: [
      {
        type: String,
        trim: true,
      },
    ],

    reviewImages: {
      type: [String],
      default: [],
    },

    recommend: {
      type: Boolean,
      default: false,
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

// Optimize query for fetching reviews by property sorted by newest first
reviewSchema.index({ propertyId: 1, createdAt: -1 });

const Review = mongoose.model("Review", reviewSchema);

export default Review;