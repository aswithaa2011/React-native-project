import Property from "../models/Property.js";
import generateSearchKeywords from "../utils/generateSearchKeywords.js";

// ─── Helper: normalise a string value for duplicate comparison ─────────────────
// Trims leading/trailing whitespace and converts to lowercase.
const normalise = (value) => (value ?? "").toString().trim().toLowerCase();

// ─── Helper: build a case-insensitive, trimmed regex for a field ───────────────
const ciRegex = (value) => new RegExp(`^${normalise(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");

// Create Property
export const createProperty = async (req, res) => {
  try {
    const propertyImages = (req.files || []).map((file) => `/uploads/${file.filename}`);

    // ── Step 1: Extract & normalise the six duplicate-key fields ─────────────
    const {
      propertyName,
      location = {},
      address  = {},
    } = req.body;

    const normName    = normalise(propertyName);
    const normCity    = normalise(location.city);
    const normArea    = normalise(location.area);
    const normDoorNo  = normalise(address.doorNo);
    const normStreet  = normalise(address.street);
    const normPincode = normalise(address.pincode);

    // ── Step 2: Check for an existing property matching all six fields ────────
    const duplicate = await Property.findOne({
      propertyName:    ciRegex(normName),
      "location.city": ciRegex(normCity),
      "location.area": ciRegex(normArea),
      "address.doorNo":   ciRegex(normDoorNo),
      "address.street":   ciRegex(normStreet),
      "address.pincode":  ciRegex(normPincode),
    }).select("_id").lean();

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "Property already exists.",
        propertyId: duplicate._id,
      });
    }

    // ── Step 3: Build document, generate keywords, and save ──────────────────
    const propertyData = {
      ...req.body,
      propertyImages,
    };

    // Auto-generate search keywords — consumer must never supply these manually
    propertyData.searchKeywords = generateSearchKeywords(propertyData);

    const property = await Property.create(propertyData);

    return res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property,
    });
  } catch (error) {
    // ── Graceful handler for MongoDB duplicate-key error (race-condition guard) ─
    if (error.code === 11000) {
      // Attempt to locate the conflicting document to return its ID
      const { propertyName, location = {}, address = {} } = req.body;

      const conflicting = await Property.findOne({
        propertyName:    ciRegex(propertyName),
        "location.city": ciRegex(location.city),
        "location.area": ciRegex(location.area),
        "address.doorNo":   ciRegex(address.doorNo),
        "address.street":   ciRegex(address.street),
        "address.pincode":  ciRegex(address.pincode),
      }).select("_id").lean();

      return res.status(409).json({
        success: false,
        message: "Property already exists.",
        propertyId: conflicting?._id ?? null,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Properties
export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .select({
        propertyName: 1,
        propertyType: 1,
        startingPrice: 1,
        "location.city": 1,
        "location.area": 1,
        propertyImages: { $slice: 1 },
        "reviewSummary.averageRating": 1,
        "reviewSummary.totalReviews": 1,
        "verification.isVerified": 1,
      })
      .lean();

    const formattedProperties = properties.map((prop) => ({
      _id: prop._id,
      propertyName: prop.propertyName,
      hostelType: prop.propertyType,
      startingPrice: prop.startingPrice,
      location: {
        city: prop.location?.city,
        area: prop.location?.area,
      },
      hostelImage: prop.propertyImages?.[0] || null,
      reviewSummary: {
        averageRating: prop.reviewSummary?.averageRating || 0,
        totalReviews: prop.reviewSummary?.totalReviews || 0,
      },
      verification: {
        isVerified: prop.verification?.isVerified || false,
      },
    }));

    return res.status(200).json({
      success: true,
      data: formattedProperties,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Property By Id
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

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
    // Fetch the current document so we can merge fields before keyword generation
    const existing = await Property.findById(req.params.id).lean();

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Merge existing data with incoming changes (incoming takes priority)
    const merged = {
      propertyName:  req.body.propertyName  ?? existing.propertyName,
      propertyType:  req.body.propertyType  ?? existing.propertyType,
      location:      req.body.location      ?? existing.location,
      amenities:     req.body.amenities     ?? existing.amenities,
      about:         req.body.about         ?? existing.about,
      address:       req.body.address       ?? existing.address,
    };

    // Re-generate keywords from the post-merge state
    const searchKeywords = generateSearchKeywords(merged);

    // Strip any consumer-supplied searchKeywords to prevent manual overrides
    const { searchKeywords: _ignored, ...safeBody } = req.body;

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { ...safeBody, searchKeywords },
      { new: true, runValidators: true }
    );

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
    const property = await Property.findByIdAndDelete(req.params.id);

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
