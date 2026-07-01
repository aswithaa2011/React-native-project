/**
 * transportSeed.js
 *
 * Run with:  node seed/transportSeed.js
 *
 * Inserts Chennai Metro Stations, Local Train Stations, and Bus Stands.
 * Uses updateOne + upsert so it is safe to re-run — no duplicates created.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// Load .env from the backend root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

import TransportHub from "../models/TransportHub.js";

const hubs = [
  // ─── Metro Stations ──────────────────────────────────────────────────────
  {
    hubId: "M001",
    name: "Chennai Central Metro",
    type: "Metro",
    line: "Blue Line",
    address: "Park Town, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2762, 13.0827] },
  },
  {
    hubId: "M002",
    name: "Egmore Metro",
    type: "Metro",
    line: "Blue Line",
    address: "Egmore, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2617, 13.0732] },
  },
  {
    hubId: "M003",
    name: "Government Estate Metro",
    type: "Metro",
    line: "Blue Line",
    address: "Government Estate, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2755, 13.0699] },
  },
  {
    hubId: "M004",
    name: "High Court Metro",
    type: "Metro",
    line: "Blue Line",
    address: "High Court, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2847, 13.0738] },
  },
  {
    hubId: "M005",
    name: "Washermanpet Metro",
    type: "Metro",
    line: "Blue Line",
    address: "Washermanpet, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.292, 13.0923] },
  },
  {
    hubId: "M006",
    name: "Wimco Nagar Metro",
    type: "Metro",
    line: "Blue Line",
    address: "Wimco Nagar, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.3029, 13.1053] },
  },
  {
    hubId: "M007",
    name: "Alandur Metro",
    type: "Metro",
    line: "Green Line",
    address: "Alandur, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2091, 13.0026] },
  },
  {
    hubId: "M008",
    name: "Nanganallur Road Metro",
    type: "Metro",
    line: "Green Line",
    address: "Nanganallur, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.194, 12.9963] },
  },
  {
    hubId: "M009",
    name: "Meenambakkam Metro",
    type: "Metro",
    line: "Green Line",
    address: "Meenambakkam, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.1784, 12.9855] },
  },
  {
    hubId: "M010",
    name: "Chennai Airport Metro",
    type: "Metro",
    line: "Green Line",
    address: "Tirusulam, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.1642, 12.9877] },
  },
  {
    hubId: "M011",
    name: "Guindy Metro",
    type: "Metro",
    line: "Green Line",
    address: "Guindy, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2135, 13.0068] },
  },
  {
    hubId: "M012",
    name: "Little Mount Metro",
    type: "Metro",
    line: "Green Line",
    address: "Little Mount, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2208, 13.0149] },
  },
  {
    hubId: "M013",
    name: "Saidapet Metro",
    type: "Metro",
    line: "Green Line",
    address: "Saidapet, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2269, 13.021] },
  },
  {
    hubId: "M014",
    name: "Vadapalani Metro",
    type: "Metro",
    line: "Green Line",
    address: "Vadapalani, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2101, 13.0501] },
  },
  {
    hubId: "M015",
    name: "Ashok Nagar Metro",
    type: "Metro",
    line: "Green Line",
    address: "Ashok Nagar, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2185, 13.0425] },
  },
  {
    hubId: "M016",
    name: "Ekkattuthangal Metro",
    type: "Metro",
    line: "Green Line",
    address: "Ekkattuthangal, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2191, 13.0278] },
  },

  // ─── Local Train Stations ────────────────────────────────────────────────
  {
    hubId: "L001",
    name: "Chennai Central",
    type: "Local Train",
    line: null,
    address: "Park Town, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2762, 13.0827] },
  },
  {
    hubId: "L002",
    name: "Chennai Beach",
    type: "Local Train",
    line: null,
    address: "Broadway, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2884, 13.0925] },
  },
  {
    hubId: "L003",
    name: "Park Station",
    type: "Local Train",
    line: null,
    address: "Flower Bazaar, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2836, 13.0849] },
  },
  {
    hubId: "L004",
    name: "Egmore",
    type: "Local Train",
    line: null,
    address: "Egmore, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2617, 13.0773] },
  },
  {
    hubId: "L005",
    name: "Mambalam",
    type: "Local Train",
    line: null,
    address: "T. Nagar, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2258, 13.0365] },
  },
  {
    hubId: "L006",
    name: "Saidapet",
    type: "Local Train",
    line: null,
    address: "Saidapet, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2269, 13.021] },
  },
  {
    hubId: "L007",
    name: "Guindy",
    type: "Local Train",
    line: null,
    address: "Guindy, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2135, 13.0068] },
  },
  {
    hubId: "L008",
    name: "Tambaram",
    type: "Local Train",
    line: null,
    address: "Tambaram, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.1193, 12.9249] },
  },
  {
    hubId: "L009",
    name: "Chromepet",
    type: "Local Train",
    line: null,
    address: "Chromepet, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.1418, 12.9516] },
  },
  {
    hubId: "L010",
    name: "Pallavaram",
    type: "Local Train",
    line: null,
    address: "Pallavaram, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.1519, 12.9674] },
  },
  {
    hubId: "L011",
    name: "Nungambakkam",
    type: "Local Train",
    line: null,
    address: "Nungambakkam, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2413, 13.0591] },
  },
  {
    hubId: "L012",
    name: "Kodambakkam",
    type: "Local Train",
    line: null,
    address: "Kodambakkam, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2228, 13.0508] },
  },
  {
    hubId: "L013",
    name: "Thiruvanmiyur",
    type: "Local Train",
    line: null,
    address: "Thiruvanmiyur, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2583, 12.9843] },
  },
  {
    hubId: "L014",
    name: "Velachery",
    type: "Local Train",
    line: null,
    address: "Velachery, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2206, 12.9791] },
  },
  {
    hubId: "L015",
    name: "Perambur",
    type: "Local Train",
    line: null,
    address: "Perambur, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2532, 13.1118] },
  },

  // ─── Bus Stands ──────────────────────────────────────────────────────────
  {
    hubId: "B001",
    name: "CMBT (Koyambedu) Bus Terminus",
    type: "Bus Stand",
    line: null,
    address: "Koyambedu, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.1949, 13.0694] },
  },
  {
    hubId: "B002",
    name: "Broadway Bus Terminus",
    type: "Bus Stand",
    line: null,
    address: "Broadway, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2865, 13.089] },
  },
  {
    hubId: "B003",
    name: "Tambaram Bus Stand",
    type: "Bus Stand",
    line: null,
    address: "Tambaram, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.1196, 12.9249] },
  },
  {
    hubId: "B004",
    name: "T. Nagar Bus Terminus",
    type: "Bus Stand",
    line: null,
    address: "T. Nagar, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2337, 13.0389] },
  },
  {
    hubId: "B005",
    name: "Guindy Bus Stand",
    type: "Bus Stand",
    line: null,
    address: "Guindy, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2099, 13.0068] },
  },
  {
    hubId: "B006",
    name: "Madhavaram Bus Terminus",
    type: "Bus Stand",
    line: null,
    address: "Madhavaram, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2329, 13.1477] },
  },
  {
    hubId: "B007",
    name: "Thiruvanmiyur Bus Stand",
    type: "Bus Stand",
    line: null,
    address: "Thiruvanmiyur, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.259, 12.9835] },
  },
  {
    hubId: "B008",
    name: "Adyar Bus Depot",
    type: "Bus Stand",
    line: null,
    address: "Adyar, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2565, 13.0012] },
  },
  {
    hubId: "B009",
    name: "Poonamallee Bus Stand",
    type: "Bus Stand",
    line: null,
    address: "Poonamallee, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.1008, 13.047] },
  },
  {
    hubId: "B010",
    name: "Perambur Bus Depot",
    type: "Bus Stand",
    line: null,
    address: "Perambur, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: { type: "Point", coordinates: [80.2508, 13.1163] },
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ DB connected");

    let inserted = 0;
    let skipped = 0;

    for (const hub of hubs) {
      const result = await TransportHub.updateOne(
        { hubId: hub.hubId },
        { $setOnInsert: hub },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        inserted++;
        console.log(`  ➕ Inserted: ${hub.name}`);
      } else {
        skipped++;
        console.log(`  ⏭  Skipped (exists): ${hub.name}`);
      }
    }

    console.log(`\n✅ Seed complete — ${inserted} inserted, ${skipped} skipped.`);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 DB disconnected");
  }
};

seed();
