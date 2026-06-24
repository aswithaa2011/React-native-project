import express from "express";
import upload from "../middlewares/upload.js";

import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController.js";

const propertyRouter = express.Router();

propertyRouter.post("/create", upload.array("propertyImages", 10), createProperty);

propertyRouter.get("/get", getAllProperties);

propertyRouter.get("/getbyid/:propertyId", getPropertyById);

propertyRouter.put("/update/:propertyId", updateProperty);

propertyRouter.delete("/delete/:propertyId", deleteProperty);

export default propertyRouter;

//http://localhost:5000/api/properties/create
//http://localhost:5000/api/properties/get
//http://localhost:5000/api/properties/getbyid/:propertyId
//http://localhost:5000/api/properties/update/:propertyId
//http://localhost:5000/api/properties/delete/:propertyId
