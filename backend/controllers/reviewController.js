import mongoose from "mongoose";
import Review from "../models/rating.js";
import { updatePropertyReview } from "../utils/updatePropertyReview.js";

// Create Review
export const createReview = async (req,res) => {
  try {
    const reviewImages = req.files
      ? req.files.map((file) => file.path)
      : [];

    const review = await Review.create({
      ...req.body,
      reviewImages,
    });

    await updatePropertyReview(review.propertyId);

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("user.userId", "name profileImage accountType");

    const formattedReviews = reviews.map((review) => {
      const reviewObj = review.toObject();
      if (reviewObj.user && reviewObj.user.userId) {
        if (reviewObj.user.userId.accountType === "private") {
          reviewObj.user.userId.name = "Unknown User";
          reviewObj.user.userId.profileImage = null;
        }
        delete reviewObj.user.userId.accountType;
      }
      return reviewObj;
    });

    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      count: formattedReviews.length,
      data: formattedReviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Review By Id
export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate("user.userId", "name profileImage accountType");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const reviewObj = review.toObject();
    if (reviewObj.user && reviewObj.user.userId) {
      if (reviewObj.user.userId.accountType === "private") {
        reviewObj.user.userId.name = "Unknown User";
        reviewObj.user.userId.profileImage = null;
      }
      delete reviewObj.user.userId.accountType;
    }

    res.status(200).json({
      success: true,
      message: "Review fetched successfully",
      data: reviewObj,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Reviews By Property ID
export const getReviewsByPropertyId = async (req, res) => {
  try {
    const { propertyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID format",
      });
    }

    const reviews = await Review.find({ propertyId })
      .sort({ createdAt: -1 })
      .populate("user.userId", "name profileImage accountType");

    if (!reviews || reviews.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No reviews found",
        totalReviews: 0,
        data: [],
      });
    }

    const formattedReviews = reviews.map((review) => {
      const reviewObj = review.toObject();
      if (reviewObj.user && reviewObj.user.userId) {
        if (reviewObj.user.userId.accountType === "private") {
          reviewObj.user.userId.name = "Unknown User";
          reviewObj.user.userId.profileImage = null;
        }
        delete reviewObj.user.userId.accountType;
      }
      return reviewObj;
    });

    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      totalReviews: formattedReviews.length,
      data: formattedReviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Review
export const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    let updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      updateData.reviewImages = req.files.map((file) => file.path);
    }

    const review = await Review.findByIdAndUpdate(reviewId, updateData, { new: true });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    await updatePropertyReview(review.propertyId);

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Review
export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    await updatePropertyReview(review.propertyId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
