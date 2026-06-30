import mongoose from "mongoose";
import Review from "../models/rating.js";
import Property from "../models/Property.js";

/**
 * Aggregates all reviews for a given property and updates the Property document's review summary.
 * 
 * Aggregation Pipeline Breakdown:
 * 1. $match: Filters reviews in the Review collection that match the provided propertyId.
 * 2. $group: Groups the matched reviews by propertyId.
 *    - Calculates the average rating and category ratings using $avg.
 *    - Counts total reviews using $sum: 1.
 *    - Uses $cond inside $sum to calculate recommendCount (true) and notRecommendCount (false).
 * 3. Formats to 1 decimal point before saving.
 * 4. Resets to 0 if no reviews are found.
 */
export const updatePropertyReview = async (propertyId) => {
  try {
    const stats = await Review.aggregate([
      {
        $match: { propertyId: new mongoose.Types.ObjectId(propertyId) },
      },
      {
        $group: {
          _id: "$propertyId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          recommendCount: {
            $sum: { $cond: [{ $eq: ["$recommend", true] }, 1, 0] },
          },
          notRecommendCount: {
            $sum: { $cond: [{ $eq: ["$recommend", false] }, 1, 0] },
          },
          cleanliness: { $avg: "$categoryRatings.cleanliness" },
          food: { $avg: "$categoryRatings.food" },
          security: { $avg: "$categoryRatings.security" },
          wifi: { $avg: "$categoryRatings.wifi" },
          staff: { $avg: "$categoryRatings.staff" },
          location: { $avg: "$categoryRatings.location" },
          waterFacility: { $avg: "$categoryRatings.waterFacility" },
          valueForMoney: { $avg: "$categoryRatings.valueForMoney" },
        },
      },
    ]);

    if (stats.length > 0) {
      // Ensure averages are rounded to one decimal place
      const formatToFixed = (value) => Number((value || 0).toFixed(1));

      const reviewSummary = {
        averageRating: formatToFixed(stats[0].averageRating),
        totalReviews: stats[0].totalReviews,
        recommendCount: stats[0].recommendCount,
        notRecommendCount: stats[0].notRecommendCount,
        categoryRatings: {
          cleanliness: formatToFixed(stats[0].cleanliness),
          food: formatToFixed(stats[0].food),
          security: formatToFixed(stats[0].security),
          wifi: formatToFixed(stats[0].wifi),
          staff: formatToFixed(stats[0].staff),
          location: formatToFixed(stats[0].location),
          waterFacility: formatToFixed(stats[0].waterFacility),
          valueForMoney: formatToFixed(stats[0].valueForMoney),
        },
      };

      await Property.findByIdAndUpdate(propertyId, { reviewSummary });
    } else {
      // Reset all values to 0 if no reviews exist for the property
      const resetSummary = {
        averageRating: 0,
        totalReviews: 0,
        recommendCount: 0,
        notRecommendCount: 0,
        categoryRatings: {
          cleanliness: 0,
          food: 0,
          security: 0,
          wifi: 0,
          staff: 0,
          location: 0,
          waterFacility: 0,
          valueForMoney: 0,
        },
      };

      await Property.findByIdAndUpdate(propertyId, { reviewSummary: resetSummary });
    }
  } catch (error) {
    console.error("Error updating property review summary:", error);
  }
};
