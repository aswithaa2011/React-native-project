/**
 * adminTransportController.js
 *
 * Admin-only CRUD + management for TransportHub.
 * All routes protected by adminProtect middleware (applied at router level).
 */

import TransportHub from "../models/TransportHub.js";
import {
  validateCreateBody,
  validateUpdateCoordinates,
} from "../validators/transportValidation.js";
import {
  isDuplicateHubId,
  isDuplicateName,
  getTransportDashboardStats,
  buildAdminListFilter,
} from "../services/transportService.js";

// ─── 1. Dashboard Summary ──────────────────────────────────────────────────────

/**
 * @desc  Return aggregated transport hub statistics
 * @route GET /api/admin/transport/dashboard
 * @access Admin
 */
export const getDashboard = async (req, res) => {
  try {
    const stats = await getTransportDashboardStats();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── 2. Get All Transport Hubs (paginated + filters) ──────────────────────────

/**
 * @desc  Paginated list of all transport hubs with optional filters
 * @route GET /api/admin/transport
 * @query ?page=1&limit=10&search=metro&type=Metro&city=Chennai&isActive=true
 * @access Admin
 */
export const getAllHubs = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const filter = buildAdminListFilter(req.query);

    const [hubs, total] = await Promise.all([
      TransportHub.find(filter)
        .select("-__v")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      TransportHub.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      data: hubs,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords: total,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── 3. Get Single Transport Hub ───────────────────────────────────────────────

/**
 * @desc  Return complete information for a single transport hub
 * @route GET /api/admin/transport/:hubId
 * @access Admin
 */
export const getHubById = async (req, res) => {
  try {
    const hub = await TransportHub.findOne({ hubId: req.params.hubId })
      .select("-__v")
      .lean();

    if (!hub) {
      return res.status(404).json({
        success: false,
        message: `Transport hub with hubId "${req.params.hubId}" not found.`,
      });
    }

    return res.status(200).json({ success: true, data: hub });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── 4. Create Transport Hub ───────────────────────────────────────────────────

/**
 * @desc  Add a new transport hub
 * @route POST /api/admin/transport
 * @access Admin
 * @body  { hubId, name, type, line?, address?, city?, state?, latitude, longitude }
 */
export const createHub = async (req, res) => {
  try {
    const validationError = validateCreateBody(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError.message });
    }

    const { hubId, name, type, line, address, city, state, latitude, longitude } =
      req.body;

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    // ── Duplicate checks ──────────────────────────────────────────────────────
    const [dupId, dupName] = await Promise.all([
      isDuplicateHubId(hubId.trim()),
      isDuplicateName(name.trim()),
    ]);

    if (dupId) {
      return res.status(409).json({
        success: false,
        message: `A transport hub with hubId "${hubId}" already exists.`,
      });
    }

    if (dupName) {
      return res.status(409).json({
        success: false,
        message: `A transport hub named "${name}" already exists.`,
      });
    }

    // ── Create ────────────────────────────────────────────────────────────────
    const hub = await TransportHub.create({
      hubId: hubId.trim(),
      name: name.trim(),
      type,
      line: line?.trim() || null,
      address: address?.trim() || "",
      city: city?.trim() || "",
      state: state?.trim() || "",
      location: { type: "Point", coordinates: [lon, lat] },
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Transport hub created successfully.",
      data: {
        hubId: hub.hubId,
        name: hub.name,
        type: hub.type,
        isActive: hub.isActive,
      },
    });
  } catch (error) {
    // Handle Mongoose unique constraint violation
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      return res.status(409).json({
        success: false,
        message: `Duplicate value for ${field}.`,
      });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── 5. Update Transport Hub ───────────────────────────────────────────────────

/**
 * @desc  Update an existing transport hub
 * @route PUT /api/admin/transport/:hubId
 * @access Admin
 * @body  Partial: { name?, type?, line?, address?, city?, state?, latitude?, longitude?, isActive? }
 */
export const updateHub = async (req, res) => {
  try {
    const { hubId } = req.params;

    // Validate coordinates / type if present in body
    const validationError = validateUpdateCoordinates(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError.message });
    }

    const { latitude, longitude, name, ...rest } = req.body;
    const updates = {};

    // Only include explicitly provided string fields
    const allowedFields = ["type", "line", "address", "city", "state", "isActive"];
    for (const field of allowedFields) {
      if (rest[field] !== undefined) updates[field] = rest[field];
    }

    // Name update — check uniqueness
    if (name !== undefined) {
      if (!name || name.trim() === "") {
        return res
          .status(400)
          .json({ success: false, message: "name cannot be empty." });
      }
      const dupName = await isDuplicateName(name.trim(), hubId);
      if (dupName) {
        return res.status(409).json({
          success: false,
          message: `A transport hub named "${name}" already exists.`,
        });
      }
      updates.name = name.trim();
    }

    // Coordinate update — rebuild GeoJSON
    const hasLat = latitude != null && latitude !== "";
    const hasLon = longitude != null && longitude !== "";
    if (hasLat && hasLon) {
      updates.location = {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      };
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update.",
      });
    }

    const hub = await TransportHub.findOneAndUpdate(
      { hubId },
      { $set: updates },
      { new: true, runValidators: true }
    )
      .select("-__v")
      .lean();

    if (!hub) {
      return res.status(404).json({
        success: false,
        message: `Transport hub with hubId "${hubId}" not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transport hub updated successfully.",
      data: hub,
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      return res.status(409).json({
        success: false,
        message: `Duplicate value for ${field}.`,
      });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── 6. Soft Delete Transport Hub ─────────────────────────────────────────────

/**
 * @desc  Soft-delete a transport hub (sets isActive = false)
 * @route DELETE /api/admin/transport/:hubId
 * @access Admin
 */
export const softDeleteHub = async (req, res) => {
  try {
    const hub = await TransportHub.findOneAndUpdate(
      { hubId: req.params.hubId },
      { $set: { isActive: false } },
      { new: true }
    )
      .select("hubId name isActive")
      .lean();

    if (!hub) {
      return res.status(404).json({
        success: false,
        message: `Transport hub with hubId "${req.params.hubId}" not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transport hub has been deactivated (soft deleted).",
      data: hub,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── 7. Change Status ─────────────────────────────────────────────────────────

/**
 * @desc  Toggle the isActive status of a transport hub
 * @route PATCH /api/admin/transport/:hubId/status
 * @access Admin
 * @body  { isActive: boolean }
 */
export const changeStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean value (true or false).",
      });
    }

    const hub = await TransportHub.findOneAndUpdate(
      { hubId: req.params.hubId },
      { $set: { isActive } },
      { new: true }
    )
      .select("hubId name isActive")
      .lean();

    if (!hub) {
      return res.status(404).json({
        success: false,
        message: `Transport hub with hubId "${req.params.hubId}" not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Transport hub has been ${isActive ? "activated" : "deactivated"}.`,
      data: hub,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
