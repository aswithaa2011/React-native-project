import Amenity from "../models/amendities.js";

// Create Amenity
export const createAmenity = async (req, res) => {
  try {
    const amenity = await Amenity.create({
      ...req.body,
      createdBy: req.admin?._id,
    });

    res.status(201).json({
      success: true,
      message: "Amenity created successfully",
      data: amenity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Amenities
export const getAllAmenities = async (req, res) => {
  try {
    const amenities = await Amenity.find({
      isActive: true,
    });

    res.status(200).json({
      success: true,
      count: amenities.length,
      data: amenities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Amenity By Id
export const getAmenityById = async (req, res) => {
  try {
    const amenity = await Amenity.findById(req.params.id);

    if (!amenity) {
      return res.status(404).json({
        success: false,
        message: "Amenity not found",
      });
    }

    res.status(200).json({
      success: true,
      data: amenity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Amenity
export const updateAmenity = async (req, res) => {
  try {
    const amenity = await Amenity.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.admin?._id,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!amenity) {
      return res.status(404).json({
        success: false,
        message: "Amenity not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Amenity updated successfully",
      data: amenity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Amenity
export const deleteAmenity = async (req, res) => {
  try {
    const amenity = await Amenity.findByIdAndDelete(
      req.params.id
    );

    if (!amenity) {
      return res.status(404).json({
        success: false,
        message: "Amenity not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Amenity deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};