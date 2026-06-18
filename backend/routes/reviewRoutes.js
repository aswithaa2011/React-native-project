import express from "express";
import {
createReview,
getAllReviews,
getReviewById,
updateReview,
deleteReview,

} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/create", createReview);

router.get("/getall", getAllReviews);

router.get("/getone/:id", getReviewById);

router.put("/update/:id", updateReview);

router.delete("/delete/:id", deleteReview);



export default router;

// http://localhost:5000/api/review/create
// http://localhost:5000/api/review/getall
// http://localhost:5000/api/review/getone/:id
// http://localhost:5000/api/review/update/:id
// http://localhost:5000/api/review/delete/:id


