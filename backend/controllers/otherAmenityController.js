import OtherAmenity from "../models/otherAmenity.js";

// Create Other Amenity
export const createOtherAmenity = async (req, res) => {
  try {
    const otherAmenity = await OtherAmenity.create(req.body);

    res.status(201).json({
      success: true,
      message: "Other amenity created successfully",
      data: otherAmenity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Other Amenities
export const getAllOtherAmenities = async (req, res) => {
  try {
    const otherAmenities = await OtherAmenity.find();

    res.status(200).json({
      success: true,
      count: otherAmenities.length,
      data: otherAmenities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Other Amenity By Id
export const getOtherAmenityById = async (req, res) => {
  try {
    const otherAmenity = await OtherAmenity.findById(req.params.id);

    if (!otherAmenity) {
      return res.status(404).json({
        success: false,
        message: "Other amenity not found",
      });
    }

    res.status(200).json({
      success: true,
      data: otherAmenity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Other Amenity
export const updateOtherAmenity = async (req, res) => {
  try {
    const otherAmenity = await OtherAmenity.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!otherAmenity) {
      return res.status(404).json({
        success: false,
        message: "Other amenity not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Other amenity updated successfully",
      data: otherAmenity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Other Amenity
export const deleteOtherAmenity = async (req, res) => {
  try {
    const otherAmenity = await OtherAmenity.findByIdAndDelete(
      req.params.id
    );

    if (!otherAmenity) {
      return res.status(404).json({
        success: false,
        message: "Other amenity not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Other amenity deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};