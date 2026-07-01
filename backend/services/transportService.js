/**
 * transportService.js
 *
 * Business logic for transport hub operations.
 * Controllers stay thin — all DB-level decisions live here.
 */

import TransportHub from "../models/TransportHub.js";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_NEARBY_RADIUS_M = 5000; // 5 km
const DEFAULT_NEARBY_LIMIT = 10;      // max hubs per type

// ─── Duplicate Checks ─────────────────────────────────────────────────────────

/**
 * Check if a hubId already exists.
 * Pass excludeId to skip the current document during updates.
 *
 * @param {string} hubId
 * @param {string|null} excludeHubId  — hubId of the doc being updated
 * @returns {Promise<boolean>}
 */
export const isDuplicateHubId = async (hubId, excludeHubId = null) => {
  const filter = { hubId };
  if (excludeHubId) filter.hubId = { $eq: hubId, $ne: excludeHubId }; // same hubId, different doc
  // Simpler: just find and compare
  const existing = await TransportHub.findOne({ hubId }).lean();
  if (!existing) return false;
  if (excludeHubId && existing.hubId === excludeHubId) return false;
  return true;
};

/**
 * Check if a name already exists (case-insensitive).
 * Pass excludeHubId to skip the current document during updates.
 *
 * @param {string} name
 * @param {string|null} excludeHubId  — hubId of the doc being updated
 * @returns {Promise<boolean>}
 */
export const isDuplicateName = async (name, excludeHubId = null) => {
  const filter = { name: { $regex: `^${name.trim()}$`, $options: "i" } };
  if (excludeHubId) filter.hubId = { $ne: excludeHubId };
  const existing = await TransportHub.findOne(filter).lean();
  return !!existing;
};

// ─── GeoJSON Helpers ──────────────────────────────────────────────────────────

/**
 * Build a MongoDB $near geo filter.
 *
 * @param {number} lat  
 * @param {number} lon
 * @param {number} [maxDistanceM=5000]
 * @returns {object}  MongoDB location filter
 */
export const buildGeoFilter = (lat, lon, maxDistanceM = DEFAULT_NEARBY_RADIUS_M) => ({
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [lon, lat] },
      $maxDistance: maxDistanceM,
    },
  },
});

// ─── Dashboard Aggregation ────────────────────────────────────────────────────

/**
 * Return summary statistics for the admin dashboard.
 *
 * @returns {Promise<{
 *   totalTransport: number,
 *   totalMetro: number,
 *   totalTrainStations: number,
 *   totalBusStands: number,
 *   active: number,
 *   inactive: number
 * }>}
 */
export const getTransportDashboardStats = async () => {
  const [result] = await TransportHub.aggregate([
    {
      $group: {
        _id: null,
        totalTransport: { $sum: 1 },
        totalMetro: {
          $sum: { $cond: [{ $eq: ["$type", "Metro"] }, 1, 0] },
        },
        totalTrainStations: {
          $sum: { $cond: [{ $eq: ["$type", "Local Train"] }, 1, 0] },
        },
        totalBusStands: {
          $sum: { $cond: [{ $eq: ["$type", "Bus Stand"] }, 1, 0] },
        },
        active: {
          $sum: { $cond: ["$isActive", 1, 0] },
        },
        inactive: {
          $sum: { $cond: ["$isActive", 0, 1] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalTransport: 1,
        totalMetro: 1,
        totalTrainStations: 1,
        totalBusStands: 1,
        active: 1,
        inactive: 1,
      },
    },
  ]);

  // Return zeroed stats if collection is empty
  return (
    result ?? {
      totalTransport: 0,
      totalMetro: 0,
      totalTrainStations: 0,
      totalBusStands: 0,
      active: 0,
      inactive: 0,
    }
  );
};

// ─── Nearby Transport (Property Details) ──────────────────────────────────────

/**
 * Fetch nearby active transport hubs grouped by type.
 * Uses $near (sorted nearest-first automatically).
 *
 * @param {number} lat
 * @param {number} lon
 * @param {number} [maxDistanceM=5000]
 * @param {number} [limitPerType=10]
 * @returns {Promise<{ Metro: object[], "Local Train": object[], "Bus Stand": object[] }>}
 */
export const getNearbyTransportGrouped = async (
  lat,
  lon,
  maxDistanceM = DEFAULT_NEARBY_RADIUS_M,
  limitPerType = DEFAULT_NEARBY_LIMIT
) => {
  const hubs = await TransportHub.find({
    isActive: true,
    ...buildGeoFilter(lat, lon, maxDistanceM),
  })
    .select("hubId name type line address city state location")
    .limit(limitPerType * 3) // fetch extra across all types, then group
    .lean();

  const grouped = { Metro: [], "Local Train": [], "Bus Stand": [] };

  for (const hub of hubs) {
    const key = hub.type;
    if (grouped[key] !== undefined && grouped[key].length < limitPerType) {
      grouped[key].push(hub);
    }
  }

  return grouped;
};

// ─── Admin List Query ─────────────────────────────────────────────────────────

/**
 * Build the MongoDB filter object for the admin hub list.
 *
 * @param {{ search?, type?, city?, isActive? }} queryParams
 * @returns {object}
 */
export const buildAdminListFilter = ({ search, type, city, isActive }) => {
  const filter = {};

  if (search && search.trim()) {
    filter.$or = [
      { name: { $regex: search.trim(), $options: "i" } },
      { address: { $regex: search.trim(), $options: "i" } },
      { city: { $regex: search.trim(), $options: "i" } },
      { hubId: { $regex: search.trim(), $options: "i" } },
    ];
  }

  if (type) filter.type = type;
  if (city) filter.city = { $regex: city.trim(), $options: "i" };

  if (isActive !== undefined && isActive !== "") {
    filter.isActive = isActive === "true" || isActive === true;
  }

  return filter;
};
