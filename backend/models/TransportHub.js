import mongoose from "mongoose";

const transportHubSchema = new mongoose.Schema(
  {
    hubId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    /**
     * Open-ended string — scalable by design.
     * Add new types (Airport, Ferry Terminal, Taxi Stand, EV Charging, etc.)
     * by simply inserting new seed documents. No schema or API changes needed.
     * Admin-facing validation enforces: Metro | Local Train | Bus Stand
     */
    type: {
      type: String,
      required: true,
      trim: true,
    },

    line: {
      type: String,
      trim: true,
      default: null,
    },

    address: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    // GeoJSON Point — MongoDB requires [longitude, latitude] order
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    // Soft-delete flag — inactive hubs are hidden from public APIs
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

// Primary geospatial index — enables $near, $geoWithin, $geoNear
transportHubSchema.index({ location: "2dsphere" });

// Compound index for type-filtered geospatial queries
transportHubSchema.index({ type: 1, location: "2dsphere" });

// Compound index for active + geospatial queries (property details page)
transportHubSchema.index({ isActive: 1, location: "2dsphere" });

// Compound index for type + active geospatial queries
transportHubSchema.index({ type: 1, isActive: 1, location: "2dsphere" });

// Index for admin list queries (city, type, isActive filters + sort)
transportHubSchema.index({ city: 1, type: 1, isActive: 1 });

// Index for text-search on name (admin search bar)
transportHubSchema.index({ name: "text", address: "text", city: "text" });

export default mongoose.model("TransportHub", transportHubSchema);
