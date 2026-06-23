import express from "express";
import upload from "../middleware/upload.js";



import {
  createHostel,
  getAllHostels,
  getHostelById,
  updateHostel,
  deleteHostel,
} from "../controllers/hostelController.js";

const hostelRouter = express.Router();

hostelRouter.post("/create", upload.array("hostelImages", 10), createHostel);

hostelRouter.get("/get", getAllHostels);

hostelRouter.get("/getbyid/:hostelId", getHostelById);

hostelRouter.put("/update/:hostelId", updateHostel);

hostelRouter.delete("/delete/:hostelId", deleteHostel);


export default hostelRouter


//http://localhost:5000/api/hostels/create
//http://localhost:5000/api/hostels/get
//http://localhost:5000/api/hostels/getbyid/:hostelId
// http://localhost:5000/api/hostels/update/:hostelId
// http://localhost:5000/api/hostels/delete/:hostelId
