import asyncHandler from "../utils/asyncHandler.js";
import IdentityVerification from "../models/IdentityVerification.js";
import PropertyVerification from "../models/PropertyVerification.js";
import Property from "../models/Hostel.js";

// @desc    Submit identity verification
// @route   POST /api/verification/identity
// @access  Private
export const submitIdentityVerification = asyncHandler(async (req, res) => {
  const {
    governmentIdType,
    governmentIdNumber,
    governmentIdFrontImage,
    governmentIdBackImage,
    selfieImage
  } = req.body;

  let existingVerification = await IdentityVerification.findOne({ userId: req.user._id });

  if (existingVerification) {
    if (existingVerification.status === "Pending" || existingVerification.status === "Approved") {
      res.status(400);
      throw new Error(`Verification already exists with status: ${existingVerification.status}`);
    }
  }

  // If rejected, create a new one or should it be updated via PUT? 
  // User prompt: "Only one verification document per user. If verification already exists with Pending or Approved, return an error."
  // And "PUT /api/verification/identity Allow update only when status === Rejected. After update: Replace old documents...".
  // This means POST should probably also fail if there's a Rejected one, urging the user to use PUT. Let's enforce that.
  if (existingVerification && existingVerification.status === "Rejected") {
    res.status(400);
    throw new Error(`Verification was rejected. Please use PUT to update your existing request.`);
  }

  const verification = await IdentityVerification.create({
    userId: req.user._id,
    governmentIdType,
    governmentIdNumber,
    governmentIdFrontImage,
    governmentIdBackImage,
    selfieImage,
    status: "Pending",
    verifiedBy: null,
    verifiedAt: null,
    rejectionReason: null,
  });

  res.status(201).json({
    success: true,
    data: verification,
  });
});

// @desc    Get logged-in user's identity verification
// @route   GET /api/verification/identity
// @access  Private
export const getIdentityVerification = asyncHandler(async (req, res) => {
  const verification = await IdentityVerification.findOne({ userId: req.user._id });

  if (!verification) {
    res.status(404);
    throw new Error("Identity verification not found");
  }

  res.status(200).json({
    success: true,
    data: verification,
  });
});

// @desc    Update rejected identity verification
// @route   PUT /api/verification/identity
// @access  Private
export const updateIdentityVerification = asyncHandler(async (req, res) => {
  const { governmentIdType, governmentIdNumber, governmentIdFrontImage, governmentIdBackImage, selfieImage } = req.body;

  const verification = await IdentityVerification.findOne({ userId: req.user._id });

  if (!verification) {
    res.status(404);
    throw new Error("Identity verification not found");
  }

  if (verification.status !== "Rejected") {
    res.status(400);
    throw new Error("Can only update verification if status is Rejected");
  }

  verification.governmentIdType = governmentIdType || verification.governmentIdType;
  verification.governmentIdNumber = governmentIdNumber || verification.governmentIdNumber;
  verification.governmentIdFrontImage = governmentIdFrontImage || verification.governmentIdFrontImage;
  verification.governmentIdBackImage = governmentIdBackImage || verification.governmentIdBackImage;
  verification.selfieImage = selfieImage || verification.selfieImage;

  verification.status = "Pending";
  verification.rejectionReason = null;
  verification.verifiedBy = null;
  verification.verifiedAt = null;

  const updatedVerification = await verification.save();

  res.status(200).json({
    success: true,
    data: updatedVerification,
  });
});

// @desc    Submit property verification
// @route   POST /api/verification/property
// @access  Private
export const submitPropertyVerification = asyncHandler(async (req, res) => {
  const { propertyId, documentType, documentNumber, documentImage } = req.body;

  if (req.user.role !== "PropertyOwner") {
    res.status(403);
    throw new Error("Only Property Owners can submit property verifications");
  }

  const property = await Property.findOne({ propertyId });

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  if (property.createdBy !== req.user._id.toString()) {
    res.status(403);
    throw new Error("User must be the creator of the property");
  }

  const existingVerification = await PropertyVerification.findOne({ propertyId });

  if (existingVerification) {
    if (existingVerification.status === "Pending" || existingVerification.status === "Approved") {
      res.status(400);
      throw new Error(`Verification for this property already exists with status: ${existingVerification.status}`);
    } else if (existingVerification.status === "Rejected") {
      res.status(400);
      throw new Error(`Verification for this property was rejected. Please use PUT to update it.`);
    }
  }

  const verification = await PropertyVerification.create({
    userId: req.user._id,
    propertyId,
    documentType,
    documentNumber,
    documentImage,
    status: "Pending",
    verifiedBy: null,
    verifiedAt: null,
    rejectionReason: null,
  });

  res.status(201).json({
    success: true,
    data: verification,
  });
});

// @desc    Get logged-in user's property verifications
// @route   GET /api/verification/property
// @access  Private
export const getPropertyVerifications = asyncHandler(async (req, res) => {
  const verifications = await PropertyVerification.find({ userId: req.user._id });

  res.status(200).json({
    success: true,
    data: verifications,
  });
});

// @desc    Update rejected property verification
// @route   PUT /api/verification/property
// @access  Private
export const updatePropertyVerification = asyncHandler(async (req, res) => {
  const { propertyId, documentType, documentNumber, documentImage } = req.body;

  if (!propertyId) {
    res.status(400);
    throw new Error("Property ID is required");
  }

  const verification = await PropertyVerification.findOne({ propertyId, userId: req.user._id });

  if (!verification) {
    res.status(404);
    throw new Error("Property verification not found for this property");
  }

  if (verification.status !== "Rejected") {
    res.status(400);
    throw new Error("Can only update verification if status is Rejected");
  }

  verification.documentType = documentType || verification.documentType;
  verification.documentNumber = documentNumber || verification.documentNumber;
  verification.documentImage = documentImage || verification.documentImage;

  verification.status = "Pending";
  verification.rejectionReason = null;
  verification.verifiedBy = null;
  verification.verifiedAt = null;

  const updatedVerification = await verification.save();

  res.status(200).json({
    success: true,
    data: updatedVerification,
  });
});
