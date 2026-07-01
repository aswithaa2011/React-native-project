import express from "express";
import {
  getDashboard,
  getAllHubs,
  getHubById,
  createHub,
  updateHub,
  softDeleteHub,
  changeStatus,
} from "../controllers/adminTransportController.js";
import { adminProtect } from "../middlewares/adminMiddleware.js";

const adminTransportRouter = express.Router();

// ── All routes require a valid Admin JWT ─────────────────────────────────────
adminTransportRouter.use(adminProtect);

// IMPORTANT: /dashboard must be declared BEFORE /:hubId
// to prevent Express from treating "dashboard" as a hubId param.

// GET  /api/admin/transport/dashboard         → summary stats
adminTransportRouter.get("/dashboard", getDashboard);

// GET  /api/admin/transport                   → paginated list (with filters)
// POST /api/admin/transport                   → create hub
adminTransportRouter.route("/").get(getAllHubs).post(createHub);

// GET    /api/admin/transport/:hubId          → get single hub
// PUT    /api/admin/transport/:hubId          → update hub
// DELETE /api/admin/transport/:hubId          → soft delete (isActive=false)
adminTransportRouter
  .route("/:hubId")
  .get(getHubById)
  .put(updateHub)
  .delete(softDeleteHub);

// PATCH  /api/admin/transport/:hubId/status   → toggle isActive
adminTransportRouter.patch("/:hubId/status", changeStatus);

export default adminTransportRouter;

// ─── Route Summary ────────────────────────────────────────────────────────────
// GET    /api/admin/transport/dashboard
// GET    /api/admin/transport?page=1&limit=10&search=metro&type=Metro&city=Chennai&isActive=true
// POST   /api/admin/transport
// GET    /api/admin/transport/:hubId
// PUT    /api/admin/transport/:hubId
// DELETE /api/admin/transport/:hubId
// PATCH  /api/admin/transport/:hubId/status
