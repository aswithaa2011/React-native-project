import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    propertyId: {
      type: Object,
      default:{}
    },

    user: {
      userId: {
        type: Object,
      default:{}
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
      cleanliness: {
        type: Number,
        min: 1,
        max: 5,
      },

      food: {
        type: Number,
        min: 1,
        max: 5,
      },

      security: {
        type: Number,
        min: 1,
        max: 5,
      },

      wifi: {
        type: Number,
        min: 1,
        max: 5,
      },

      staff: {
        type: Number,
        min: 1,
        max: 5,
      },

      location: {
        type: Number,
        min: 1,
        max: 5,
      },

      waterFacility :{
        type: Number,
        min: 1,
        max: 5,
        
      },

      valueForMoney: {
        type: Number,
        min: 1,
        max: 5,
      },
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

const Review = mongoose.model("Review", reviewSchema);

export default Review;