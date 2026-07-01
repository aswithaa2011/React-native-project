import express from "express"
import { adminProtect } from "../middlewares/adminMiddleware.js";
import { createAmenity, deleteAmenity, getAllAmenities, getAmenityById, updateAmenity } from "../controllers/amenditiesController.js";

const route = express.Router()


route.post("/create", adminProtect, createAmenity);
route.get("/get", getAllAmenities);
route.get("/id/:id", getAmenityById);
route.put("/update/:id", adminProtect, updateAmenity);
route.delete("/delete/:id", adminProtect, deleteAmenity);

export default route

// http://localhost:5000/api/amenities/create
// http://localhost:5000/api/amenities/get
// http://localhost:5000/api/amenities/id/:id
// http://localhost:5000/api/amenities/update/:id
// http://localhost:5000/api/amenities/delete/:id