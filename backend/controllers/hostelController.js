import Hostel from "../models/Hostel.js";


// Create Hostel
export const createHostel = async (req, res) => {
  try {

    const hostelImages = (req.files || []).map((file) => `/uploads/${file.filename}`);

    const hostel = await Hostel.create({
      ...req.body,
      hostelImages,
    });

    return res.status(201).json({
      success: true,
      message: "Hostel created successfully",
      data: hostel,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get All Hostels
export const getAllHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find().select(
      "hostelId propertyName hostelType startingPrice location hostelImages reviewSummary verification"
    );

    return res.status(200).json({
      success: true,
      data: hostels,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get Hostel Details
export const getHostelById = async (req, res) => {
  try {
    const hostel = await Hostel.findOne({
      hostelId: req.params.hostelId,
    });

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: hostel,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Update Hostel
export const updateHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findOneAndUpdate(
      { hostelId: req.params.hostelId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hostel updated successfully",
      data: hostel,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Delete Hostel
export const deleteHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findOneAndDelete({
      hostelId: req.params.hostelId,
    });

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hostel deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
