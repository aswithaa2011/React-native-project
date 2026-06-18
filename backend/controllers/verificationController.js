import asyncHandler from "../utils/asyncHandler.js";
import IdentityVerification from "../models/IdentityVerification.js";
import HostelVerification from "../models/HostelVerification.js";
import Hostel from "../models/Hostel.js";

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

// @desc    Submit hostel verification
// @route   POST /api/verification/hostel
// @access  Private
export const submitHostelVerification = asyncHandler(async (req, res) => {
  const { hostelId, documentType, documentNumber, documentImage } = req.body;

  if (req.user.role !== "HostelOwner") {
    res.status(403);
    throw new Error("Only Hostel Owners can submit hostel verifications");
  }

  const hostel = await Hostel.findOne({ hostelId });

  if (!hostel) {
    res.status(404);
    throw new Error("Hostel not found");
  }

  if (hostel.createdBy !== req.user._id.toString()) {
    res.status(403);
    throw new Error("User must be the creator of the hostel");
  }

  const existingVerification = await HostelVerification.findOne({ hostelId });

  if (existingVerification) {
    if (existingVerification.status === "Pending" || existingVerification.status === "Approved") {
      res.status(400);
      throw new Error(`Verification for this hostel already exists with status: ${existingVerification.status}`);
    } else if (existingVerification.status === "Rejected") {
      res.status(400);
      throw new Error(`Verification for this hostel was rejected. Please use PUT to update it.`);
    }
  }

  const verification = await HostelVerification.create({
    userId: req.user._id,
    hostelId,
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

// @desc    Get logged-in user's hostel verification
// @route   GET /api/verification/hostel
// @access  Private
export const getHostelVerifications = asyncHandler(async (req, res) => {
  const verifications = await HostelVerification.find({ userId: req.user._id });

  res.status(200).json({
    success: true,
    data: verifications,
  });
});

// @desc    Update rejected hostel verification
// @route   PUT /api/verification/hostel
// @access  Private
export const updateHostelVerification = asyncHandler(async (req, res) => {
  const { hostelId, documentType, documentNumber, documentImage } = req.body;

  if (!hostelId) {
    res.status(400);
    throw new Error("Hostel ID is required");
  }

  const verification = await HostelVerification.findOne({ hostelId, userId: req.user._id });

  if (!verification) {
    res.status(404);
    throw new Error("Hostel verification not found for this hostel");
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
