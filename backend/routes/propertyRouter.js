import express from "express";
import upload from "../middlewares/upload.js";

import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController.js";
import { getPropertyWithTransport } from "../controllers/transportController.js";

const propertyRouter = express.Router();

propertyRouter.post("/create", upload.array("propertyImages", 5), createProperty);

propertyRouter.get("/get", getAllProperties);

// Full property details with nearby transport hubs
propertyRouter.get("/details/:propertyId", getPropertyWithTransport);

propertyRouter.get("/getbyid/:id", getPropertyById);

propertyRouter.put("/update/:id", updateProperty);

propertyRouter.delete("/delete/:id", deleteProperty);

export default propertyRouter;

//http://localhost:5000/api/properties/create
//http://localhost:5000/api/properties/get
//http://localhost:5000/api/properties/details/:propertyId  ← property + nearby transport
//http://localhost:5000/api/properties/getbyid/:id
//http://localhost:5000/api/properties/update/:id
//http://localhost:5000/api/properties/delete/:id

