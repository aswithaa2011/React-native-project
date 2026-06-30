import TransportHub from "../models/TransportHub.js";
import Property from "../models/Property.js";
import { haversineDistance, formatDistance } from "../utils/distance.js";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_NEARBY_RADIUS_M = 5000;   // 5 km in metres (for property details)
const NEARBY_LIMIT = 10;               // max hubs per type

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Attach computed distance to each hub document and format it.
 */
const attachDistance = (hubs, propLat, propLon) =>
  hubs.map((hub) => {
    const [lon, lat] = hub.location.coordinates;
    const distKm = haversineDistance(propLat, propLon, lat, lon);
    return {
      hubId: hub.hubId,
      name: hub.name,
      type: hub.type,
      line: hub.line || null,
      address: hub.address,
      city: hub.city,
      state: hub.state,
      distance: formatDistance(distKm),
    };
  });

// ─── 1. Get Property Details + Nearby Transport ───────────────────────────────

/**
 * @desc  Get property by MongoDB _id with nearby transport hubs grouped by type
 * @route GET /api/property/:propertyId
 */
export const getPropertyWithTransport = async (req, res) => {
  try {
    const property = await Property.findById(req.params.propertyId).lean();

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    const { latitude, longitude } = property.location || {};

    // Property must have coordinates to run geospatial query
    if (latitude == null || longitude == null) {
      return res.status(200).json({
        success: true,
        message: "Property details fetched successfully.",
        data: { property, nearbyTransport: null },
      });
    }

    // $near returns results sorted nearest-first automatically
    // Only include active hubs — inactive ones are hidden from public view
    const nearbyHubs = await TransportHub.find({
      isActive: true,
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: DEFAULT_NEARBY_RADIUS_M,
        },
      },
    })
      .select("hubId name type line address city state location")
      .limit(NEARBY_LIMIT * 3) // fetch extra, then group
      .lean();

    // Group by type and attach Haversine distance
    const grouped = { Metro: [], "Local Train": [], "Bus Stand": [] };

    for (const hub of nearbyHubs) {
      const [lon, lat] = hub.location.coordinates;
      const distKm = haversineDistance(latitude, longitude, lat, lon);
      const formatted = {
        hubId: hub.hubId,
        name: hub.name,
        distance: formatDistance(distKm),
      };

      if (grouped[hub.type] !== undefined) {
        if (grouped[hub.type].length < NEARBY_LIMIT) {
          grouped[hub.type].push(formatted);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Property details fetched successfully.",
      data: {
        property: {
          _id: property._id,
          propertyName: property.propertyName,
          propertyType: property.propertyType,
          address: property.address,
          location: {
            city: property.location.city,
            area: property.location.area,
            latitude: property.location.latitude,
            longitude: property.location.longitude,
          },
          startingPrice: property.startingPrice,
          propertyImages: property.propertyImages,
          about: property.about,
          amenities: property.amenities,
          reviewSummary: property.reviewSummary,
          verification: property.verification,
        },
        nearbyTransport: {
          metroStations: grouped["Metro"],
          localTrainStations: grouped["Local Train"],
          busStops: grouped["Bus Stand"],
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── 2. Get All Transport Hubs ────────────────────────────────────────────────

/**
 * @desc  List all transport hubs, optionally filtered by type
 * @route GET /api/transport
 * @query ?type=Metro | ?type=Local Train | ?type=Bus Stand
 */
export const getAllTransport = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.type) filter.type = req.query.type;

    const hubs = await TransportHub.find(filter)
      .select("-__v -createdAt -updatedAt -isActive")
      .sort({ name: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: hubs.length,
      data: hubs,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── 3. Get Nearby Transport ──────────────────────────────────────────────────

/**
 * @desc  Return transport hubs within a radius sorted nearest-first
 * @route GET /api/transport/nearby?latitude=&longitude=&radius=
 * @query latitude (required), longitude (required), radius in metres (default 5000)
 */
export const getNearbyTransport = async (req, res) => {
  try {
    const { latitude, longitude, radius, type } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "latitude and longitude are required.",
      });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const maxDistance = parseInt(radius) || DEFAULT_NEARBY_RADIUS_M;

    if (isNaN(lat) || lat < -90 || lat > 90) {
      return res.status(400).json({ success: false, message: "Invalid latitude." });
    }
    if (isNaN(lon) || lon < -180 || lon > 180) {
      return res.status(400).json({ success: false, message: "Invalid longitude." });
    }

    const geoFilter = {
      isActive: true,
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lon, lat] },
          $maxDistance: maxDistance,
        },
      },
    };

    if (type) geoFilter.type = type;

    const hubs = await TransportHub.find(geoFilter)
      .select("hubId name type line address city state location")
      .lean();

    const data = attachDistance(hubs, lat, lon);

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── 4. Create Transport Hub ──────────────────────────────────────────────────

/**
 * @desc  Add a new transport hub
 * @route POST /api/transport
 */
export const createTransportHub = async (req, res) => {
  try {
    const { hubId, name, type, line, address, city, state, latitude, longitude } = req.body;

    if (!hubId || !name || !type || latitude == null || longitude == null) {
      return res.status(400).json({
        success: false,
        message: "hubId, name, type, latitude, and longitude are required.",
      });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      return res.status(400).json({ success: false, message: "Invalid latitude." });
    }
    if (isNaN(lon) || lon < -180 || lon > 180) {
      return res.status(400).json({ success: false, message: "Invalid longitude." });
    }

    const existing = await TransportHub.findOne({ hubId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `A transport hub with hubId "${hubId}" already exists.`,
      });
    }

    const hub = await TransportHub.create({
      hubId,
      name,
      type,
      line: line || null,
      address,
      city,
      state,
      location: { type: "Point", coordinates: [lon, lat] },
    });

    return res.status(201).json({
      success: true,
      message: "Transport hub created successfully.",
      data: hub,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── 5. Update Transport Hub ──────────────────────────────────────────────────

/**
 * @desc  Update an existing transport hub by hubId
 * @route PUT /api/transport/:hubId
 */
export const updateTransportHub = async (req, res) => {
  try {
    const { latitude, longitude, ...rest } = req.body;
    const updates = { ...rest };

    if (latitude != null && longitude != null) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);

      if (isNaN(lat) || lat < -90 || lat > 90) {
        return res.status(400).json({ success: false, message: "Invalid latitude." });
      }
      if (isNaN(lon) || lon < -180 || lon > 180) {
        return res.status(400).json({ success: false, message: "Invalid longitude." });
      }

      updates.location = { type: "Point", coordinates: [lon, lat] };
    }

    const hub = await TransportHub.findOneAndUpdate(
      { hubId: req.params.hubId },
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    if (!hub) {
      return res.status(404).json({ success: false, message: "Transport hub not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Transport hub updated successfully.",
      data: hub,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── 6. Delete Transport Hub ──────────────────────────────────────────────────

/**
 * @desc  Delete a transport hub by hubId
 * @route DELETE /api/transport/:hubId
 */
export const deleteTransportHub = async (req, res) => {
  try {
    const hub = await TransportHub.findOneAndDelete({ hubId: req.params.hubId });

    if (!hub) {
      return res.status(404).json({ success: false, message: "Transport hub not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Transport hub deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── 7. Get Single Transport Hub ──────────────────────────────────────────────

/**
 * @desc  Get a single transport hub by hubId
 * @route GET /api/transport/:hubId
 */
export const getTransportById = async (req, res) => {
  try {
    const hub = await TransportHub.findOne({ hubId: req.params.hubId })
      .select("-__v")
      .lean();

    if (!hub) {
      return res.status(404).json({ success: false, message: "Transport hub not found." });
    }

    return res.status(200).json({ success: true, data: hub });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
