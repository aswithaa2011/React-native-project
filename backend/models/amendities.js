import mongoose from "mongoose";

const amenitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique:true,
    },

    isActive: {
      type: Boolean,
      default: true,
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

const Amenity = mongoose.model("Amenity", amenitySchema);

export default Amenity;