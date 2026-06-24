import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    propertyId: {
      type: String,
      required: true,
      unique: true,
    },

    propertyName: {
      type: String,
      required: true,
      trim: true,
    },

    propertyType: {
      type: String,
      enum: ["Boys", "Girls", "Co-Living"],
      required: true,
    },

    startingPrice: {
      type: Number,
      required: true,
    },

    address: {
      doorNo: String,
      street: String,
      pincode: String,

    },

    location: {
      city: {
        type: String,
        required: true,
      },

      area: {
        type: String,
        required: true,
      },

      latitude: Number,
      longitude: Number,
    },

    propertyImages: [String],

    about: {
      type: String,
      default: "",
    },

    amenities: [String],

    reviewSummary: {
      averageRating: {
        type: Number,
        default: 0,
      },

      totalReviews: {
        type: Number,
        default: 0,
      },

      recommendCount: {
        type: Number,
        default: 0,
      },

      notRecommendCount: {
        type: Number,
        default: 0,
      },

      categoryRatings: {
        cleanliness: {
          type: Number,
          default: 0,
        },

        food: {
          type: Number,
          default: 0,
        },

        security: {
          type: Number,
          default: 0,
        },

        wifi: {
          type: Number,
          default: 0,
        },

        staff: {
          type: Number,
          default: 0,
        },

        location: {
          type: Number,
          default: 0,
        },

        valueForMoney: {
          type: Number,
          default: 0,
        },
      },
    },

    verification: {
      isVerified: {
        type: Boolean,
        default: false,
      },

      status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
      },
    },

    createdBy: {
      type: String,
      required: true,
    },

    updatedBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model("Property", propertySchema);

export default Property;
