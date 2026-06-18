import asyncHandler from "../utils/asyncHandler.js";
import IdentityVerification from "../models/IdentityVerification.js";
import HostelVerification from "../models/HostelVerification.js";
import UserProfile from "../models/UserProfile.js";
import Hostel from "../models/Hostel.js";
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

// @desc    Get all hostel verification requests
// @route   GET /api/admin/verification/hostel
// @access  Private/Admin
export const getHostelVerifications = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) {
    filter.status = status;
  }

  const verifications = await HostelVerification.find(filter)
    .populate("userId", "fullName email")
    .populate("hostelId", "propertyName");

  res.status(200).json({
    success: true,
    count: verifications.length,
    data: verifications,
  });
});

// @desc    Get single hostel verification detail
// @route   GET /api/admin/verification/hostel/:id
// @access  Private/Admin
export const getHostelVerificationById = asyncHandler(async (req, res) => {
  const verification = await HostelVerification.findById(req.params.id)
    .populate("userId", "fullName email")
    .populate("hostelId", "propertyName");

  if (!verification) {
    res.status(404);
    throw new Error("Hostel verification not found");
  }

  res.status(200).json({
    success: true,
    data: verification,
  });
});

// @desc    Approve hostel verification
// @route   PATCH /api/admin/verification/hostel/:id/approve
// @access  Private/Admin
export const approveHostelVerification = asyncHandler(async (req, res) => {
  const verification = await HostelVerification.findById(req.params.id);

  if (!verification) {
    res.status(404);
    throw new Error("Hostel verification not found");
  }

  if (verification.status === "Approved") {
    res.status(400);
    throw new Error("Verification is already approved");
  }

  verification.status = "Approved";
  verification.verifiedBy = req.user._id;
  verification.verifiedAt = Date.now();
  
  await verification.save();

  // Update user profile for hostel verification
  const user = await UserProfile.findById(verification.userId);
  if (user) {
    user.verification.hostelOwner.isVerified = true;
    user.verification.hostelOwner.verificationId = verification._id;
    await user.save();
  }

  res.status(200).json({
    success: true,
    message: "Hostel verification approved successfully",
    data: verification,
  });
});

// @desc    Reject hostel verification
// @route   PATCH /api/admin/verification/hostel/:id/reject
// @access  Private/Admin
export const rejectHostelVerification = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  if (!reason) {
    res.status(400);
    throw new Error("Rejection reason is required");
  }

  const verification = await HostelVerification.findById(req.params.id);

  if (!verification) {
    res.status(404);
    throw new Error("Hostel verification not found");
  }

  verification.status = "Rejected";
  verification.rejectionReason = reason;
  verification.verifiedBy = req.user._id;
  verification.verifiedAt = Date.now();

  await verification.save();

  res.status(200).json({
    success: true,
    message: "Hostel verification rejected successfully",
    data: verification,
  });
});
