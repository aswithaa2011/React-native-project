import Property from "../models/Property.js";

/**
 * Escapes special regex characters in a string.
 * @param {string} text
 * @returns {string}
 */
const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

/**
 * Returns a MongoDB Aggregation Pipeline to generate live search suggestions.
 * Suggestions are pulled from propertyName, searchKeywords, amenities, city, and area.
 * @param {string} query The user's partial search query.
 * @returns {Array} MongoDB Aggregation Pipeline
 */
export const getSuggestions = async (query) => {
  const cleanQuery = escapeRegex(query.trim());
  const matchRegex = new RegExp(cleanQuery, "i");
  const startsWithRegex = new RegExp(`^${cleanQuery}`, "i");

  const pipeline = [
    {
      // 1. Initial filter to drastically reduce the number of documents processed.
      $match: {
        $or: [
          { propertyName: matchRegex },
          { searchKeywords: matchRegex },
          { amenities: matchRegex },
          { "location.city": matchRegex },
          { "location.area": matchRegex },
        ],
      },
    },
    {
      // 2. Pool all relevant string fields/arrays into a single array.
      $project: {
        suggestionsPool: {
          $concatArrays: [
            { $ifNull: ["$searchKeywords", []] },
            { $ifNull: ["$amenities", []] },
            [{ $ifNull: ["$propertyName", ""] }],
            [{ $ifNull: ["$location.city", ""] }],
            [{ $ifNull: ["$location.area", ""] }],
          ],
        },
      },
    },
    {
      // 3. Unwind the pool into individual strings.
      $unwind: "$suggestionsPool",
    },
    {
      // 4. Ensure it's a string, trim spaces, and lowercase it for deduplication.
      $project: {
        suggestion: { $trim: { input: { $toLower: { $toString: "$suggestionsPool" } } } },
      },
    },
    {
      // 5. Match only the individual strings that contain the query.
      $match: {
        suggestion: matchRegex,
      },
    },
    {
      // 6. Group by the suggestion string to remove duplicates.
      $group: {
        _id: "$suggestion",
      },
    },
    {
      // 7. Assign a relevance score. "Starts with" gets priority (lower number).
      $addFields: {
        score: {
          $cond: {
            if: { $regexMatch: { input: "$_id", regex: startsWithRegex } },
            then: 1,
            else: 2,
          },
        },
      },
    },
    {
      // 8. Sort by score (priority) then alphabetically.
      $sort: { score: 1, _id: 1 },
    },
    {
      // 9. Limit to top 10 suggestions.
      $limit: 10,
    },
    {
      // 10. Output just the array of strings.
      $group: {
        _id: null,
        suggestions: { $push: "$_id" },
      },
    },
  ];

  const result = await Property.aggregate(pipeline).allowDiskUse(true);
  return result.length > 0 ? result[0].suggestions : [];
};

/**
 * Returns paginated full search results based on ranking priorities.
 * @param {string} query The search string.
 * @param {number} page Current page number.
 * @param {number} limit Number of results per page.
 * @returns {Object} { data, count }
 */
export const searchProperties = async (query, page = 1, limit = 10) => {
  const cleanQuery = escapeRegex(query.trim());
  const containsRegex = new RegExp(cleanQuery, "i");
  const startsWithRegex = new RegExp(`^${cleanQuery}`, "i");
  const exactRegex = new RegExp(`^${cleanQuery}$`, "i");

  const skip = (page - 1) * limit;

  // Define the match condition used for both counting and finding documents.
  const matchCondition = {
    $or: [
      { propertyName: containsRegex },
      { searchKeywords: containsRegex },
      { amenities: containsRegex },
      { about: containsRegex },
      { "location.area": containsRegex },
      { "location.city": containsRegex },
      { propertyType: containsRegex },
    ],
  };

  const pipeline = [
    { $match: matchCondition },
    {
      // Calculate relevance matchScore based on the requested priorities.
      $addFields: {
        matchScore: {
          $switch: {
            branches: [
              {
                // Priority 1: Exact Property Name
                case: { $regexMatch: { input: { $ifNull: ["$propertyName", ""] }, regex: exactRegex } },
                then: 100,
              },
              {
                // Priority 2: Property Name Starts With
                case: { $regexMatch: { input: { $ifNull: ["$propertyName", ""] }, regex: startsWithRegex } },
                then: 80,
              },
              {
                // Priority 3: searchKeywords Starts With
                case: {
                  $gt: [
                    {
                      $size: {
                        $filter: {
                          input: { $ifNull: ["$searchKeywords", []] },
                          as: "kw",
                          cond: { $regexMatch: { input: "$$kw", regex: startsWithRegex } },
                        },
                      },
                    },
                    0,
                  ],
                },
                then: 60,
              },
              {
                // Priority 4: searchKeywords Contains
                case: {
                  $gt: [
                    {
                      $size: {
                        $filter: {
                          input: { $ifNull: ["$searchKeywords", []] },
                          as: "kw",
                          cond: { $regexMatch: { input: "$$kw", regex: containsRegex } },
                        },
                      },
                    },
                    0,
                  ],
                },
                then: 40,
              },
              {
                // Priority 5: Amenities Contains
                case: {
                  $gt: [
                    {
                      $size: {
                        $filter: {
                          input: { $ifNull: ["$amenities", []] },
                          as: "am",
                          cond: { $regexMatch: { input: "$$am", regex: containsRegex } },
                        },
                      },
                    },
                    0,
                  ],
                },
                then: 30,
              },
              {
                // Priority 6: Area matches
                case: { $regexMatch: { input: { $ifNull: ["$location.area", ""] }, regex: containsRegex } },
                then: 20,
              },
              {
                // Priority 7: City matches
                case: { $regexMatch: { input: { $ifNull: ["$location.city", ""] }, regex: containsRegex } },
                then: 10,
              },
              {
                // Priority 8: About matches (or Property Type)
                case: { $regexMatch: { input: { $ifNull: ["$about", ""] }, regex: containsRegex } },
                then: 5,
              },
            ],
            default: 1, // Fallback score
          },
        },
      },
    },
    {
      // Sort by relevance, then rating, then most reviews, then lowest price.
      $sort: {
        matchScore: -1,
        "reviewSummary.averageRating": -1,
        "reviewSummary.totalReviews": -1,
        startingPrice: 1,
      },
    },
    { $skip: skip },
    { $limit: parseInt(limit) },
    {
      // Return ONLY required fields to optimize payload size.
      $project: {
        _id: 1,
        propertyId: 1,
        propertyName: 1,
        propertyType: 1,
        startingPrice: 1,
        location: 1,
        propertyImages: 1,
        "reviewSummary.averageRating": 1,
        "reviewSummary.totalReviews": 1,
        "verification.isVerified": 1,
        matchScore: 1, // Useful for debugging/frontend ordering
      },
    },
  ];

  const [data, totalCount] = await Promise.all([
    Property.aggregate(pipeline).allowDiskUse(true),
    Property.countDocuments(matchCondition),
  ]);

  return { data, count: totalCount };
};
