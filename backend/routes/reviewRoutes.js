import express from "express";
import {
createReview,
getAllReviews,
getReviewById,
getReviewsByPropertyId,
updateReview,
deleteReview
} from "../controllers/reviewController.js";

import uploadReviewImages from "../middlewares/reviewImage.js"

const router = express.Router();

router.post("/create",uploadReviewImages.array("reviewImages", 5), createReview);
router.get("/property/:propertyId", getReviewsByPropertyId);
router.get("/getall", getAllReviews);
router.get("/getone/:id", getReviewById);
router.put("/update/:id", uploadReviewImages.array("reviewImages", 5), updateReview);
router.delete("/delete/:id", deleteReview);


export default router;

// http://localhost:5000/api/review/create
// http://localhost:5000/api/review/getall
// http://localhost:5000/api/review/getone/:id



