import express from "express";
import {
  getAllTransport,
  getNearbyTransport,
  createTransportHub,
  updateTransportHub,
  deleteTransportHub,
  getTransportById,
} from "../controllers/transportController.js";

const transportRouter = express.Router();

// GET  /api/transport          — all hubs (?type=Metro)
transportRouter.get("/", getAllTransport);

// GET  /api/transport/nearby   — hubs within radius (?latitude=&longitude=&radius=)
// NOTE: /nearby must be declared BEFORE /:hubId to avoid Express matching "nearby" as a param
transportRouter.get("/nearby", getNearbyTransport);

// GET  /api/transport/:hubId   — single hub
transportRouter.get("/:hubId", getTransportById);

// POST /api/transport          — create
transportRouter.post("/", createTransportHub);

// PUT  /api/transport/:hubId   — update
transportRouter.put("/:hubId", updateTransportHub);

// DELETE /api/transport/:hubId — delete
transportRouter.delete("/:hubId", deleteTransportHub);

export default transportRouter;

// /api/transport
// /api/transport/nearby?latitude=&longitude=&radius=
// /api/transport/:hubId
