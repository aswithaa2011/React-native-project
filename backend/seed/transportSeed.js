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
    name: "AG - DMS",
    type: "Metro",
    line: "Blue Line",
    address: "Anna Salai, Teynampet, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2528, 13.0447],
    },
  },
  {
    hubId: "M002",
    name: "Anna Nagar East",
    type: "Metro",
    line: "Green Line",
    address: "Anna Nagar East, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2183, 13.0852],
    },
  },
  {
    hubId: "M003",
    name: "Anna Nagar Tower",
    type: "Metro",
    line: "Green Line",
    address: "Anna Nagar, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2180, 13.0848],
    },
  },
  {
    hubId: "M004",
    name: "Arignar Anna Alandur",
    type: "Metro",
    line: "Blue Line, Green Line",
    address: "Alandur, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2016, 13.0047],
    },
  },
  {
    hubId: "M005",
    name: "Arumbakkam",
    type: "Metro",
    line: "Green Line",
    address: "Arumbakkam, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2105, 13.0621],
    },
  },
  {
    hubId: "M006",
    name: "Ashok Nagar",
    type: "Metro",
    line: "Green Line",
    address: "Ashok Nagar, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2124, 13.0353],
    },
  },
  {
    hubId: "M007",
    name: "Chennai International Airport",
    type: "Metro",
    line: "Blue Line",
    address: "Chennai International Airport, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.1692, 12.9816],
    },
  },
  {
    hubId: "M008",
    name: "Egmore",
    type: "Metro",
    line: "Green Line",
    address: "Egmore, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2609, 13.0786],
    },
  },
  {
    hubId: "M009",
    name: "Ekkattuthangal",
    type: "Metro",
    line: "Green Line",
    address: "Ekkattuthangal, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2053, 13.0170],
    },
  },
  {
    hubId: "M010",
    name: "Government Estate",
    type: "Metro",
    line: "Blue Line",
    address: "Government Estate, Anna Salai, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2727, 13.0696],
    },
  },
  {
    hubId: "M011",
    name: "Guindy",
    type: "Metro",
    line: "Blue Line",
    address: "Guindy, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2011, 13.0095],
    },
  },
  {
    hubId: "M012",
    name: "High Court",
    type: "Metro",
    line: "Blue Line",
    address: "Parry's Corner, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2870, 13.0873],
    },
  },
  {
    hubId: "M013",
    name: "Kaladipet",
    type: "Metro",
    line: "Blue Line",
    address: "Kaladipet, Tiruvottiyur, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2835, 13.1373],
    },
  },
  {
    hubId: "M014",
    name: "Kilpauk",
    type: "Metro",
    line: "Green Line",
    address: "Kilpauk, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2429, 13.0775],
    },
  },
  {
    hubId: "M015",
    name: "Koyambedu",
    type: "Metro",
    line: "Green Line",
    address: "Koyambedu, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.1948, 13.0696],
    },
  },
  {
    hubId: "M016",
    name: "LIC",
    type: "Metro",
    line: "Blue Line",
    address: "Anna Salai, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2648, 13.0647],
    },
  },
  {
    hubId: "M017",
    name: "Little Mount",
    type: "Metro",
    line: "Blue Line",
    address: "West Saidapet, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2123, 13.0256],
    },
  },
  {
    hubId: "M018",
    name: "Mannadi",
    type: "Metro",
    line: "Blue Line",
    address: "Mannadi, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2879, 13.0931],
    },
  },
  {
    hubId: "M019",
    name: "Meenambakkam",
    type: "Metro",
    line: "Blue Line",
    address: "Meenambakkam, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.1815, 12.9878],
    },
  },
  {
    hubId: "M020",
    name: "Nandanam",
    type: "Metro",
    line: "Blue Line",
    address: "Nandanam, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2448, 13.0324],
    },
  },
  {
    hubId: "M021",
    name: "Nanganallur Road",
    type: "Metro",
    line: "Blue Line",
    address: "Nanganallur, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.1939, 12.9997],
    },
  },
  {
    hubId: "M022",
    name: "Nehru Park",
    type: "Metro",
    line: "Green Line",
    address: "Chetpet, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2522, 13.0789],
    },
  },
  {
    hubId: "M023",
    name: "New Washermanpet",
    type: "Metro",
    line: "Blue Line",
    address: "Press Colony, Tondiarpet, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2916, 13.1248],
    },
  },
  {
    hubId: "M024",
    name: "Pachaiyappa's College",
    type: "Metro",
    line: "Green Line",
    address: "Chetpet, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2425, 13.0756],
    },
  },
  {
    hubId: "M025",
    name: "Puratchi Thalaivar Dr. M.G. Ramachandran Central",
    type: "Metro",
    line: "Blue Line, Green Line",
    address: "Chennai Central, Park Town, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2729, 13.0816],
    },
  },
  {
    hubId: "M026",
    name: "Puratchi Thalaivi Dr. J. Jayalalithaa CMBT",
    type: "Metro",
    line: "Green Line",
    address: "Koyambedu, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.1943, 13.0686],
    },
  },
  {
    hubId: "M027",
    name: "Saidapet",
    type: "Metro",
    line: "Blue Line",
    address: "Saidapet, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2238, 13.0237],
    },
  },
  {
    hubId: "M028",
    name: "Shenoy Nagar",
    type: "Metro",
    line: "Green Line",
    address: "Shenoy Nagar, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2254, 13.0782],
    },
  },
  {
    hubId: "M029",
    name: "Sir Theagaraya College",
    type: "Metro",
    line: "Blue Line",
    address: "Old Washermanpet, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2938, 13.1118],
    },
  },
  {
    hubId: "M030",
    name: "St. Thomas Mount",
    type: "Metro",
    line: "Green Line",
    address: "St. Thomas Mount, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2037, 12.9951],
    },
  }, {
    hubId: "M031",
    name: "Teynampet",
    type: "Metro",
    line: "Blue Line",
    address: "Teynampet, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2474, 13.0379],
    },
  },
  {
    hubId: "M032",
    name: "Thirumangalam",
    type: "Metro",
    line: "Green Line",
    address: "Thirumangalam, Anna Nagar, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2016, 13.0850],
    },
  },
  {
    hubId: "M033",
    name: "Tiruvottriyur",
    type: "Metro",
    line: "Blue Line",
    address: "Tiruvottiyur, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.3023, 13.1508],
    },
  },
  {
    hubId: "M034",
    name: "Tiruvottriyur Theradi",
    type: "Metro",
    line: "Blue Line",
    address: "Theradi, Tiruvottiyur, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.3052, 13.1584],
    },
  },
  {
    hubId: "M035",
    name: "Thousand Lights",
    type: "Metro",
    line: "Blue Line",
    address: "Thousand Lights, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2586, 13.0584],
    },
  },
  {
    hubId: "M036",
    name: "Tollgate",
    type: "Metro",
    line: "Blue Line",
    address: "Tollgate, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2950, 13.1410],
    },
  },
  {
    hubId: "M037",
    name: "Tondiarpet",
    type: "Metro",
    line: "Blue Line",
    address: "Tondiarpet, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2898, 13.1204],
    },
  },
  {
    hubId: "M038",
    name: "Vadapalani",
    type: "Metro",
    line: "Green Line",
    address: "Vadapalani, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2122, 13.0508],
    },
  },
  {
    hubId: "M039",
    name: "Washermanpet",
    type: "Metro",
    line: "Blue Line",
    address: "Washermanpet, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.2808, 13.1071],
    },
  },
  {
    hubId: "M040",
    name: "Wimco Nagar",
    type: "Metro",
    line: "Blue Line",
    address: "Wimco Nagar, Tiruvottiyur, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: {
      type: "Point",
      coordinates: [80.3118, 13.1668],
    },
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
