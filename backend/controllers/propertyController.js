import Property from "../models/Property.js";


// Create Property
export const createProperty = async (req, res) => {
  try {

    const propertyImages = (req.files || []).map((file) => `/uploads/${file.filename}`);

    const property = await Property.create({
      ...req.body,
      propertyImages,
    });

    return res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get All Properties
export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().select(
      "propertyId propertyName propertyType startingPrice location propertyImages reviewSummary verification"
    );

    return res.status(200).json({
      success: true,
      data: properties,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get Property Details
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findOne({
      propertyId: req.params.propertyId,
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Update Property
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findOneAndUpdate(
      { propertyId: req.params.propertyId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: property,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Delete Property
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({
      propertyId: req.params.propertyId,
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
