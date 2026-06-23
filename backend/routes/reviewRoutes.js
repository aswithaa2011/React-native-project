import express from "express";
import {
createReview,
getAllReviews,
getReviewById,



} from "../controllers/reviewController.js";

import uploadReviewImages from "../middleware/reviewImage.js"

const router = express.Router();

router.post("/create",uploadReviewImages.array("reviewImages", 5), createReview);

router.get("/getall", getAllReviews);

router.get("/getone/:id", getReviewById);







export default router;

// http://localhost:5000/api/review/create
// http://localhost:5000/api/review/getall
// http://localhost:5000/api/review/getone/:id



