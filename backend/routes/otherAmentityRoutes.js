import express from "express";


import { adminProtect } from "../middlewares/adminMiddleware.js";
import { createOtherAmenity, deleteOtherAmenity, getAllOtherAmenities, getOtherAmenityById, updateOtherAmenity } from "../controllers/otherAmenityController.js";

const router = express.Router();

// Owner creates a new other amenity
router.post("/create", createOtherAmenity);

// Admin views all requests
router.get("/", adminProtect, getAllOtherAmenities);

// Admin or Owner views one request
router.get("/:id", getOtherAmenityById);

// Admin updates status (Approve/Reject)
router.put("/:id", adminProtect, updateOtherAmenity);

// Admin deletes request
router.delete("/:id", adminProtect, deleteOtherAmenity);

export default router;