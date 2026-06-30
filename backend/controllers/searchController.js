import { getSuggestions, searchProperties } from "../services/searchService.js";

/**
 * @desc    Get live search suggestions (Debounce friendly)
 * @route   GET /api/property/search/suggestions?q=...
 * @access  Public
 */
export const getLiveSuggestions = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(200).json({
        success: true,
        query: q || "",
        suggestions: [],
      });
    }

    const suggestions = await getSuggestions(q);

    return res.status(200).json({
      success: true,
      query: q,
      suggestions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get full property search results based on query
 * @route   GET /api/property/search?q=...&page=1&limit=10
 * @access  Public
 */
export const getFullSearchResults = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    const { data, count } = await searchProperties(q, parseInt(page), parseInt(limit));

    return res.status(200).json({
      success: true,
      count,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
