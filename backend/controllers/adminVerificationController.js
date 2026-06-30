import asyncHandler from "../utils/asyncHandler.js";
import IdentityVerification from "../models/IdentityVerification.js";
import PropertyVerification from "../models/PropertyVerification.js";
import UserProfile from "../models/UserProfile.js";
// @desc    Get all identity verification requests
// @route   GET /api/admin/verification/identity
// @access  Private/Admin
export const getIdentityVerifications = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) {
    filter.status = status;
  }

  const verifications = await IdentityVerification.find(filter).populate("userId", "fullName email");

  res.status(200).json({
    success: true,
    count: verifications.length,
    data: verifications,
  });
});

// @desc    Get single identity verification detail
// @route   GET /api/admin/verification/identity/:id
// @access  Private/Admin
export const getIdentityVerificationById = asyncHandler(async (req, res) => {
  const verification = await IdentityVerification.findById(req.params.id).populate("userId", "fullName email");

  if (!verification) {
    res.status(404);
    throw new Error("Identity verification not found");
  }

  res.status(200).json({
    success: true,
    data: verification,
  });
});

// @desc    Approve identity verification
// @route   PATCH /api/admin/verification/identity/:id/approve
// @access  Private/Admin
export const approveIdentityVerification = asyncHandler(async (req, res) => {
  const verification = await IdentityVerification.findById(req.params.id);

  if (!verification) {
    res.status(404);
    throw new Error("Identity verification not found");
  }

  if (verification.status === "Approved") {
    res.status(400);
    throw new Error("Verification is already approved");
  }

  verification.status = "Approved";
  verification.verifiedBy = req.user._id;
  verification.verifiedAt = Date.now();
  
  await verification.save();

  // Update User Profile
  const user = await UserProfile.findById(verification.userId);
  if (user) {
    user.verification.identity.isVerified = true;
    user.verification.identity.verificationId = verification._id;
    await user.save();
  }

  res.status(200).json({
    success: true,
    message: "Identity verification approved successfully",
    data: verification,
  });
});

// @desc    Reject identity verification
// @route   PATCH /api/admin/verification/identity/:id/reject
// @access  Private/Admin
export const rejectIdentityVerification = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  if (!reason) {
    res.status(400);
    throw new Error("Rejection reason is required");
  }

  const verification = await IdentityVerification.findById(req.params.id);

  if (!verification) {
    res.status(404);
    throw new Error("Identity verification not found");
  }

  verification.status = "Rejected";
  verification.rejectionReason = reason;
  verification.verifiedBy = req.user._id;
  verification.verifiedAt = Date.now();

  await verification.save();

  res.status(200).json({
    success: true,
    message: "Identity verification rejected successfully",
    data: verification,
  });
});

// @desc    Get all property verification requests
// @route   GET /api/admin/verification/property
// @access  Private/Admin
export const getPropertyVerifications = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) {
    filter.status = status;
  }

  const verifications = await PropertyVerification.find(filter)
    .populate("userId", "name email")
    .populate("propertyId", "propertyName");

  res.status(200).json({
    success: true,
    count: verifications.length,
    data: verifications,
  });
});

// @desc    Get single property verification detail
// @route   GET /api/admin/verification/property/:id
// @access  Private/Admin
export const getPropertyVerificationById = asyncHandler(async (req, res) => {
  const verification = await PropertyVerification.findById(req.params.id)
    .populate("userId", "name email")
    .populate("propertyId", "propertyName");

  if (!verification) {
    res.status(404);
    throw new Error("Property verification not found");
  }

  res.status(200).json({
    success: true,
    data: verification,
  });
});

// @desc    Approve property verification
// @route   PATCH /api/admin/verification/property/:id/approve
// @access  Private/Admin
export const approvePropertyVerification = asyncHandler(async (req, res) => {
  const verification = await PropertyVerification.findById(req.params.id);

  if (!verification) {
    res.status(404);
    throw new Error("Property verification not found");
  }

  if (verification.status === "Approved") {
    res.status(400);
    throw new Error("Verification is already approved");
  }

  verification.status = "Approved";
  verification.verifiedBy = req.user._id;
  verification.verifiedAt = Date.now();

  await verification.save();

  // Promote the user's role to PropertyOwner and mark verification as verified
  const user = await UserProfile.findById(verification.userId);
  if (user) {
    user.role = "PropertyOwner";
    user.verification.propertyOwner.isVerified = true;
    user.verification.propertyOwner.verificationId = verification._id;
    await user.save();
  }

  res.status(200).json({
    success: true,
    message: "Property verification approved. User has been promoted to PropertyOwner.",
    data: verification,
  });
});

// @desc    Reject property verification
// @route   PATCH /api/admin/verification/property/:id/reject
// @access  Private/Admin
export const rejectPropertyVerification = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  if (!reason) {
    res.status(400);
    throw new Error("Rejection reason is required");
  }

  const verification = await PropertyVerification.findById(req.params.id);

  if (!verification) {
    res.status(404);
    throw new Error("Property verification not found");
  }

  verification.status = "Rejected";
  verification.rejectionReason = reason;
  verification.verifiedBy = req.user._id;
  verification.verifiedAt = Date.now();

  await verification.save();

  res.status(200).json({
    success: true,
    message: "Property verification rejected successfully",
    data: verification,
  });
});
