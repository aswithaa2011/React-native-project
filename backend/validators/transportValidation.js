/**
 * transportValidation.js
 *
 * Pure validation helpers for transport hub data.
 * No Express dependency — importable from any layer.
 */

// ─── Constants ────────────────────────────────────────────────────────────────

export const VALID_TRANSPORT_TYPES = ["Metro", "Local Train", "Bus Stand"];

// ─── Field Validators ─────────────────────────────────────────────────────────

/**
 * Validate hubId — must be a non-empty string.
 * @param {*} hubId
 * @returns {{ valid: boolean, message?: string }}
 */
export const validateHubId = (hubId) => {
  if (!hubId || typeof hubId !== "string" || hubId.trim() === "") {
    return { valid: false, message: "hubId is required and must be a non-empty string." };
  }
  return { valid: true };
};

/**
 * Validate name — must be a non-empty string.
 * @param {*} name
 * @returns {{ valid: boolean, message?: string }}
 */
export const validateName = (name) => {
  if (!name || typeof name !== "string" || name.trim() === "") {
    return { valid: false, message: "name is required and must be a non-empty string." };
  }
  return { valid: true };
};

/**
 * Validate transport type — must be one of the allowed enum values.
 * @param {*} type
 * @returns {{ valid: boolean, message?: string }}
 */
export const validateTransportType = (type) => {
  if (!type || !VALID_TRANSPORT_TYPES.includes(type)) {
    return {
      valid: false,
      message: `type must be one of: ${VALID_TRANSPORT_TYPES.join(", ")}.`,
    };
  }
  return { valid: true };
};

/**
 * Validate latitude — must be a number in range [-90, 90].
 * @param {*} latitude
 * @returns {{ valid: boolean, message?: string }}
 */
export const validateLatitude = (latitude) => {
  const lat = parseFloat(latitude);
  if (latitude == null || latitude === "" || isNaN(lat)) {
    return { valid: false, message: "latitude is required and must be a number." };
  }
  if (lat < -90 || lat > 90) {
    return { valid: false, message: "latitude must be between -90 and 90." };
  }
  return { valid: true, value: lat };
};

/**
 * Validate longitude — must be a number in range [-180, 180].
 * @param {*} longitude
 * @returns {{ valid: boolean, message?: string }}
 */
export const validateLongitude = (longitude) => {
  const lon = parseFloat(longitude);
  if (longitude == null || longitude === "" || isNaN(lon)) {
    return { valid: false, message: "longitude is required and must be a number." };
  }
  if (lon < -180 || lon > 180) {
    return { valid: false, message: "longitude must be between -180 and 180." };
  }
  return { valid: true, value: lon };
};

// ─── Composite Validators ─────────────────────────────────────────────────────

/**
 * Validate all required fields for creating a transport hub.
 * Returns the first validation error found, or null if all pass.
 *
 * @param {object} body
 * @returns {{ message: string } | null}
 */
export const validateCreateBody = (body) => {
  const { hubId, name, type, latitude, longitude } = body;

  const checks = [
    validateHubId(hubId),
    validateName(name),
    validateTransportType(type),
    validateLatitude(latitude),
    validateLongitude(longitude),
  ];

  for (const result of checks) {
    if (!result.valid) return { message: result.message };
  }

  return null; // all valid
};

/**
 * Validate coordinate fields when present during an update.
 * Returns the first validation error found, or null if all pass.
 *
 * @param {object} body  — partial update body
 * @returns {{ message: string } | null}
 */
export const validateUpdateCoordinates = (body) => {
  const { latitude, longitude } = body;

  const hasLat = latitude != null && latitude !== "";
  const hasLon = longitude != null && longitude !== "";

  if (hasLat || hasLon) {
    // Both must be present together
    if (!hasLat) return { message: "latitude is required when longitude is provided." };
    if (!hasLon) return { message: "longitude is required when latitude is provided." };

    const latResult = validateLatitude(latitude);
    if (!latResult.valid) return { message: latResult.message };

    const lonResult = validateLongitude(longitude);
    if (!lonResult.valid) return { message: lonResult.message };
  }

  if (body.type !== undefined) {
    const typeResult = validateTransportType(body.type);
    if (!typeResult.valid) return { message: typeResult.message };
  }

  return null; // all valid
};
