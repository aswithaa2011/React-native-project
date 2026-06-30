import express from "express";
import { getLiveSuggestions, getFullSearchResults } from "../controllers/searchController.js";

const searchRoutes = express.Router();

// GET /api/property/search/suggestions?q=
searchRoutes.get("/suggestions", getLiveSuggestions);

// GET /api/property/search?q=
searchRoutes.get("/", getFullSearchResults);

export default searchRoutes;
