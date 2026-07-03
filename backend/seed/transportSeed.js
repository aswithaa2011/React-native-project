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
  { hubId: "L001", stationCode: "MSB", name: "Chennai Beach", type: "Local Train", line: ["South Line", "North Line", "West Line", "MRTS Line"], address: "Parrys Corner, George Town, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2905, 13.0947] } },
  { hubId: "L002", stationCode: "MSF", name: "Chennai Fort", type: "Local Train", line: ["South Line", "MRTS Line"], address: "Fort St. George, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2894, 13.0917] } },
  { hubId: "L003", stationCode: "MPK", name: "Chennai Park", type: "Local Train", line: ["South Line"], address: "Park Town, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2823, 13.0844] } },
  { hubId: "L004", stationCode: "MS", name: "Chennai Egmore", type: "Local Train", line: ["South Line"], address: "Egmore, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2609, 13.0732] } },
  { hubId: "L005", stationCode: "CTP", name: "Chetpet", type: "Local Train", line: ["South Line"], address: "Chetpet, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2437, 13.0699] } },
  { hubId: "L006", stationCode: "NGM", name: "Nungambakkam", type: "Local Train", line: ["South Line"], address: "Nungambakkam, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2412, 13.0603] } },
  { hubId: "L007", stationCode: "KKM", name: "Kodambakkam", type: "Local Train", line: ["South Line"], address: "Kodambakkam, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2288, 13.0503] } },
  { hubId: "L008", stationCode: "MBM", name: "Mambalam", type: "Local Train", line: ["South Line"], address: "West Mambalam, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2245, 13.0357] } },
  { hubId: "L009", stationCode: "SDM", name: "Saidapet", type: "Local Train", line: ["South Line"], address: "Saidapet, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2225, 13.0207] } },
  { hubId: "L010", stationCode: "GY", name: "Guindy", type: "Local Train", line: ["South Line"], address: "Guindy, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2148, 13.0107] } },
  { hubId: "L011", stationCode: "STM", name: "St. Thomas Mount", type: "Local Train", line: ["South Line", "MRTS Line"], address: "St. Thomas Mount, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.1963, 12.9996] } },
  { hubId: "L012", stationCode: "PAZ", name: "Pazhavanthangal", type: "Local Train", line: ["South Line"], address: "Pazhavanthangal, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.1917, 12.9917] } },
  { hubId: "L013", stationCode: "MPMM", name: "Meenambakkam", type: "Local Train", line: ["South Line"], address: "Meenambakkam, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.1699, 12.9827] } },
  { hubId: "L014", stationCode: "TSM", name: "Tirusulam", type: "Local Train", line: ["South Line"], address: "Tirusulam, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.1747, 12.9779] } },
  { hubId: "L015", stationCode: "PV", name: "Pallavaram", type: "Local Train", line: ["South Line"], address: "Pallavaram, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.1494, 12.9675] } },
  { hubId: "L016", stationCode: "PAC", name: "Chromepet", type: "Local Train", line: ["South Line"], address: "Chromepet, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.1414, 12.9516] } },
  { hubId: "L017", stationCode: "TBSM", name: "Tambaram Sanatorium", type: "Local Train", line: ["South Line"], address: "Sanatorium, Tambaram, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.1274, 12.9333] } },
  { hubId: "L018", stationCode: "TBM", name: "Tambaram", type: "Local Train", line: ["South Line"], address: "Tambaram, Chennai", city: "Tambaram", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.1270, 12.9249] } },
  { hubId: "L019", stationCode: "PGT", name: "Perungalathur", type: "Local Train", line: ["South Line"], address: "Perungalathur, Chennai", city: "Tambaram", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.0989, 12.8908] } },
  { hubId: "L020", stationCode: "VDLR", name: "Vandalur", type: "Local Train", line: ["South Line"], address: "Vandalur, Chennai", city: "Tambaram", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.0808, 12.8697] } },
  { hubId: "L021", stationCode: "UPM", name: "Urapakkam", type: "Local Train", line: ["South Line"], address: "Urapakkam, Chengalpattu district", city: "Chengalpattu", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.0621, 12.8449] } },
  { hubId: "L022", stationCode: "GNC", name: "Guduvancheri", type: "Local Train", line: ["South Line"], address: "Guduvancheri, Chengalpattu district", city: "Chengalpattu", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.0587, 12.8377] } },
  { hubId: "L023", stationCode: "POI", name: "Potheri", type: "Local Train", line: ["South Line"], address: "Potheri, Chengalpattu district", city: "Chengalpattu", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.0454, 12.8199] } },
  { hubId: "L024", stationCode: "KKLM", name: "Kattankulathur", type: "Local Train", line: ["South Line"], address: "Kattankulathur, Chengalpattu district", city: "Chengalpattu", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.0369, 12.7975] } },
  { hubId: "L025", stationCode: "MRMN", name: "Maraimalai Nagar", type: "Local Train", line: ["South Line"], address: "Maraimalai Nagar, Chengalpattu district", city: "Chengalpattu", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.0316, 12.7791] } },
  { hubId: "L026", stationCode: "SPRK", name: "Singaperumal Koil", type: "Local Train", line: ["South Line"], address: "Singaperumal Koil, Chengalpattu district", city: "Chengalpattu", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.0264, 12.7503] } },
  { hubId: "L027", stationCode: "PRNR", name: "Paranur", type: "Local Train", line: ["South Line"], address: "Paranur, Chengalpattu district", city: "Chengalpattu", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.0011, 12.7166] } },
  { hubId: "L028", stationCode: "CGL", name: "Chengalpattu Junction", type: "Local Train", line: ["South Line", "South West Line"], address: "Chengalpattu Town", city: "Chengalpattu", state: "Tamil Nadu", location: { type: "Point", coordinates: [79.9764, 12.6929] } },
  { hubId: "L029", stationCode: "MEPK", name: "Melpakkam", type: "Local Train", line: ["South West Line"], address: "Melpakkam, Kanchipuram district", city: "Chengalpattu", state: "Tamil Nadu", location: { type: "Point", coordinates: [79.9509, 12.7327] } },
  { hubId: "L030", stationCode: "WJD", name: "Walajabad", type: "Local Train", line: ["South West Line"], address: "Walajabad, Kanchipuram district", city: "Kanchipuram", state: "Tamil Nadu", location: { type: "Point", coordinates: [79.9146, 12.7889] } },
  { hubId: "L031", stationCode: "CJ", name: "Kanchipuram", type: "Local Train", line: ["South West Line"], address: "Kanchipuram Town", city: "Kanchipuram", state: "Tamil Nadu", location: { type: "Point", coordinates: [79.7036, 12.8342] } },
  { hubId: "L032", stationCode: "KPKM", name: "Kaveripakkam", type: "Local Train", line: ["South West Line"], address: "Kaveripakkam, Vellore district", city: "Kaveripakkam", state: "Tamil Nadu", location: { type: "Point", coordinates: [79.5838, 12.9995] } },
  { hubId: "L033", stationCode: "NLI", name: "Nemili", type: "Local Train", line: ["South West Line"], address: "Nemili, Vellore district", city: "Nemili", state: "Tamil Nadu", location: { type: "Point", coordinates: [79.5216, 13.0654] } },
  { hubId: "L034", stationCode: "AJJ", name: "Arakkonam Junction", type: "Local Train", line: ["West Line", "South West Line"], address: "Arakkonam Town", city: "Arakkonam", state: "Tamil Nadu", location: { type: "Point", coordinates: [79.6700, 13.0850] } },
  { hubId: "L035", stationCode: "MAS", name: "Puratchi Thalaivar Dr. M.G.R. Chennai Central", type: "Local Train", line: ["West Line", "North Line"], address: "Park Town, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2762, 13.0827] } },
  { hubId: "L036", stationCode: "MASS", name: "Moore Market Complex (Chennai Central Suburban)", type: "Local Train", line: ["West Line", "North Line"], address: "Park Town, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2776, 13.0836] } },
  { hubId: "L037", stationCode: "BBQ", name: "Basin Bridge Junction", type: "Local Train", line: ["West Line", "North Line"], address: "Basin Bridge, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2622, 13.0917] } },
  { hubId: "L038", stationCode: "VJM", name: "Vyasarpadi Jeeva", type: "Local Train", line: ["West Line", "North Line"], address: "Vyasarpadi, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2536, 13.1064] } },
  { hubId: "L039", stationCode: "PER", name: "Perambur", type: "Local Train", line: ["West Line", "North Line"], address: "Perambur, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2381, 13.1146] } },
  { hubId: "L040", stationCode: "PMBC", name: "Perambur Carriage Works", type: "Local Train", line: ["West Line"], address: "Perambur, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2333, 13.1214] } },
  { hubId: "L041", stationCode: "PMBL", name: "Perambur Loco Works", type: "Local Train", line: ["West Line"], address: "Perambur, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2265, 13.1264] } },
  { hubId: "L042", stationCode: "VLK", name: "Villivakkam", type: "Local Train", line: ["West Line"], address: "Villivakkam, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2075, 13.1153] } },
  { hubId: "L043", stationCode: "KRR", name: "Korattur", type: "Local Train", line: ["West Line"], address: "Korattur, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.1892, 13.1174] } },
  { hubId: "L044", stationCode: "PTVK", name: "Pattaravakkam", type: "Local Train", line: ["West Line"], address: "Pattaravakkam, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.1811, 13.1224] } },
  { hubId: "L045", stationCode: "AB", name: "Ambattur", type: "Local Train", line: ["West Line"], address: "Ambattur, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.1548, 13.1143] } },
  { hubId: "L046", stationCode: "TLY", name: "Thirumullaivoyal", type: "Local Train", line: ["West Line"], address: "Thirumullaivoyal, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.1276, 13.1226] } },
  { hubId: "L047", stationCode: "ANU", name: "Annanur", type: "Local Train", line: ["West Line"], address: "Annanur, Tiruvallur district", city: "Avadi", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.1052, 13.1160] } },
  { hubId: "L048", stationCode: "AVD", name: "Avadi", type: "Local Train", line: ["West Line"], address: "Avadi, Tiruvallur district", city: "Avadi", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.1012, 13.1147] } },
  { hubId: "L049", stationCode: "HDC", name: "Hindu College", type: "Local Train", line: ["West Line"], address: "Pattabiram, Avadi", city: "Avadi", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.0839, 13.1264] } },
  { hubId: "L050", stationCode: "PBM", name: "Pattabiram", type: "Local Train", line: ["West Line"], address: "Pattabiram, Avadi", city: "Avadi", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.0629, 13.1256] } },
  { hubId: "L051", stationCode: "NMLR", name: "Nemilichery", type: "Local Train", line: ["West Line"], address: "Nemilichery, Tiruvallur district", city: "Tiruvallur", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.0479, 13.1329] } },
  { hubId: "L052", stationCode: "TNV", name: "Thiruninravur", type: "Local Train", line: ["West Line"], address: "Thiruninravur, Tiruvallur district", city: "Tiruvallur", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.0189, 13.1443] } },
  { hubId: "L053", stationCode: "VPM", name: "Veppampattu", type: "Local Train", line: ["West Line"], address: "Veppampattu, Tiruvallur district", city: "Tiruvallur", state: "Tamil Nadu", location: { type: "Point", coordinates: [79.9938, 13.1585] } },
  { hubId: "L054", stationCode: "PUZ", name: "Putlur", type: "Local Train", line: ["West Line"], address: "Putlur, Tiruvallur district", city: "Tiruvallur", state: "Tamil Nadu", location: { type: "Point", coordinates: [79.9689, 13.1487] } },
  { hubId: "L055", stationCode: "TRL", name: "Tiruvallur", type: "Local Train", line: ["West Line"], address: "Tiruvallur Town", city: "Tiruvallur", state: "Tamil Nadu", location: { type: "Point", coordinates: [79.9088, 13.1439] } },
  { hubId: "L056", stationCode: "EGT", name: "Egattur", type: "Local Train", line: ["West Line"], address: "Egattur, Tiruvallur district", city: "Tiruvallur", state: "Tamil Nadu", location: { type: "Point", coordinates: [79.8734, 13.1466] } },
  { hubId: "L057", stationCode: "KBM", name: "Kadambattur", type: "Local Train", line: ["West Line"], address: "Kadambattur, Tiruvallur district", city: "Tiruvallur", state: "Tamil Nadu", location: { type: "Point", coordinates: [79.8383, 13.1289] } },
  { hubId: "L058", stationCode: "SNMK", name: "Senjipanambakkam", type: "Local Train", line: ["West Line"], address: "Senjipanambakkam, Tiruvallur district", city: "Tiruvallur", state: "Tamil Nadu", location: { type: "Point", coordinates: [79.8000, 13.1200] } },
  { hubId: "L059", stationCode: "MNVR", name: "Manavur", type: "Local Train", line: ["West Line"], address: "Manavur, Tiruvallur district", city: "Tiruvallur", state: "Tamil Nadu", location: { type: "Point", coordinates: [79.7700, 13.1100] } },
  { hubId: "L060", stationCode: "TVLG", name: "Thiruvalangadu", type: "Local Train", line: ["West Line"], address: "Thiruvalangadu, Tiruvallur district", city: "Arakkonam", state: "Tamil Nadu", location: { type: "Point", coordinates: [79.7400, 13.1000] } },
  { hubId: "L061", stationCode: "MOS", name: "Mosur", type: "Local Train", line: ["West Line"], address: "Mosur, Arakkonam", city: "Arakkonam", state: "Tamil Nadu", location: { type: "Point", coordinates: [79.7100, 13.0900] } },
  { hubId: "L062", stationCode: "PLYM", name: "Puliyamangalam", type: "Local Train", line: ["West Line"], address: "Puliyamangalam, Arakkonam", city: "Arakkonam", state: "Tamil Nadu", location: { type: "Point", coordinates: [79.6900, 13.0800] } },
  { hubId: "L063", stationCode: "RPM", name: "Royapuram", type: "Local Train", line: ["North Line", "West Line"], address: "Royapuram, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2914, 13.1109] } },
  { hubId: "L064", stationCode: "WST", name: "Washermanpet", type: "Local Train", line: ["North Line", "West Line"], address: "Washermanpet, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2837, 13.1174] } },
  { hubId: "L065", stationCode: "TDPT", name: "Tondiarpet", type: "Local Train", line: ["North Line"], address: "Tondiarpet, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2896, 13.1289] } },
  { hubId: "L066", stationCode: "KKPT", name: "Korukkupet", type: "Local Train", line: ["North Line"], address: "Korukkupet, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2789, 13.1206] } },
  { hubId: "L067", stationCode: "SM", name: "Sembiam", type: "Local Train", line: ["North Line"], address: "Sembiam, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2456, 13.1214] } },
  { hubId: "L068", stationCode: "VYS", name: "Vyasarpadi", type: "Local Train", line: ["North Line"], address: "Vyasarpadi, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2597, 13.1108] } },
  { hubId: "L069", stationCode: "TVT", name: "Tiruvottiyur", type: "Local Train", line: ["North Line"], address: "Tiruvottiyur, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.3021, 13.1583] } },
  { hubId: "L070", stationCode: "TVTT", name: "Tiruvottiyur Theradi", type: "Local Train", line: ["North Line"], address: "Tiruvottiyur, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.3089, 13.1697] } },
  { hubId: "L071", stationCode: "ENR", name: "Ennore", type: "Local Train", line: ["North Line"], address: "Ennore, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.3221, 13.2144] } },
  { hubId: "L072", stationCode: "ATP", name: "Athipattu", type: "Local Train", line: ["North Line"], address: "Athipattu, Tiruvallur district", city: "Ponneri", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2989, 13.2417] } },
  { hubId: "L073", stationCode: "KVT", name: "Kaduvetti", type: "Local Train", line: ["North Line"], address: "Kaduvetti, Tiruvallur district", city: "Ponneri", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2762, 13.2669] } },
  { hubId: "L074", stationCode: "MJU", name: "Minjur", type: "Local Train", line: ["North Line"], address: "Minjur, Tiruvallur district", city: "Ponneri", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2431, 13.2725] } },
  { hubId: "L075", stationCode: "PON", name: "Ponneri", type: "Local Train", line: ["North Line"], address: "Ponneri Town", city: "Ponneri", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2005, 13.3319] } },
  { hubId: "L076", stationCode: "GPD", name: "Gummidipoondi", type: "Local Train", line: ["North Line"], address: "Gummidipoondi Town", city: "Gummidipoondi", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.1042, 13.4064] } },
  { hubId: "L077", stationCode: "ELU", name: "Elavur", type: "Local Train", line: ["North Line"], address: "Elavur, Gummidipoondi taluk", city: "Gummidipoondi", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.0764, 13.4467] } },
  { hubId: "L078", stationCode: "TDA", name: "Tada", type: "Local Train", line: ["North Line"], address: "Tada, SPSR Nellore district", city: "Tada", state: "Andhra Pradesh", location: { type: "Point", coordinates: [80.0975, 13.5900] } },
  { hubId: "L079", stationCode: "SPE", name: "Sullurpeta", type: "Local Train", line: ["North Line"], address: "Sullurpeta Town, SPSR Nellore district", city: "Sullurpeta", state: "Andhra Pradesh", location: { type: "Point", coordinates: [80.0033, 13.7000] } },
  { hubId: "L080", stationCode: "MPT", name: "Chennai Park Town", type: "Local Train", line: ["MRTS Line"], address: "Park Town, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2839, 13.0866] } },
  { hubId: "L081", stationCode: "CPK", name: "Chepauk", type: "Local Train", line: ["MRTS Line"], address: "Chepauk, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2811, 13.0605] } },
  { hubId: "L082", stationCode: "TPY", name: "Tiruvallikeni", type: "Local Train", line: ["MRTS Line"], address: "Triplicane, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2789, 13.0525] } },
  { hubId: "L083", stationCode: "LH", name: "Light House", type: "Local Train", line: ["MRTS Line"], address: "Marina Beach, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2789, 13.0442] } },
  { hubId: "L084", stationCode: "TML", name: "Thirumayilai", type: "Local Train", line: ["MRTS Line"], address: "Mylapore, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2694, 13.0339] } },
  { hubId: "L085", stationCode: "MDVI", name: "Mandaveli", type: "Local Train", line: ["MRTS Line"], address: "Mandaveli, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2669, 13.0294] } },
  { hubId: "L086", stationCode: "GNR", name: "Greenways Road", type: "Local Train", line: ["MRTS Line"], address: "Raja Annamalaipuram, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2611, 13.0175] } },
  { hubId: "L087", stationCode: "KTPM", name: "Kotturpuram", type: "Local Train", line: ["MRTS Line"], address: "Kotturpuram, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2472, 13.0161] } },
  { hubId: "L088", stationCode: "KBGR", name: "Kasturba Nagar", type: "Local Train", line: ["MRTS Line"], address: "Adyar, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2536, 13.0083] } },
  { hubId: "L089", stationCode: "IDGR", name: "Indira Nagar", type: "Local Train", line: ["MRTS Line"], address: "Adyar, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2494, 13.0025] } },
  { hubId: "L090", stationCode: "TVMY", name: "Thiruvanmiyur", type: "Local Train", line: ["MRTS Line"], address: "Thiruvanmiyur, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2597, 12.9831] } },
  { hubId: "L091", stationCode: "TRMN", name: "Taramani", type: "Local Train", line: ["MRTS Line"], address: "Taramani, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2419, 12.9866] } },
  { hubId: "L092", stationCode: "VLCY", name: "Velachery", type: "Local Train", line: ["MRTS Line"], address: "Velachery, Chennai", city: "Chennai", state: "Tamil Nadu", location: { type: "Point", coordinates: [80.2206, 12.9789] } },

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

const normalizeName = (name) => {
  if (!name) return "";
  let n = name.toLowerCase();

  // Remove punctuation first to make prefix matching more robust
  n = n.replace(/[^\w\s]/gi, "");

  // Prefixes WITHOUT punctuation
  const prefixes = [
    "puratchi thalaivar dr mgr",
    "puratchi thalaivi dr",
    "mg ramachandran",
    "j jayalalithaa",
    "chennai",
    "dr",
    "mgr",
  ];

  for (const prefix of prefixes) {
    // Use word boundaries so we don't accidentally replace parts of valid words
    n = n.replace(new RegExp(`\\b${prefix}\\b`, 'gi'), "");
  }

  n = n.replace(/\s+/g, " ").trim();

  return n;
};

const normalizeAddress = (address) => {
  if (!address) return "";
  let a = address.toLowerCase();
  // Ignore punctuation
  a = a.replace(/[^\w\s]/gi, "");
  // Ignore extra spaces
  return a.replace(/\s+/g, " ").trim();
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ DB connected");

    let inserted = 0;
    let skipped = 0;

    const existingHubs = await TransportHub.find({});

    for (const hub of hubs) {
      const isDuplicate = existingHubs.some((existing) => {
        const sameType = existing.type === hub.type;
        const sameAddress = normalizeAddress(existing.address) === normalizeAddress(hub.address);
        const sameName = normalizeName(existing.name) === normalizeName(hub.name);
        return sameType && sameAddress && sameName;
      });

      if (isDuplicate) {
        skipped++;
        console.log(`  ⏭  Skipped (duplicate): ${hub.name} (${hub.type})`);
        continue;
      }

      const result = await TransportHub.updateOne(
        { hubId: hub.hubId },
        { $set: hub },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        inserted++;
        console.log(`  ➕ Inserted: ${hub.name} (${hub.type})`);
        existingHubs.push(hub);
      } else {
        inserted++;
        console.log(`  🔄 Updated: ${hub.name} (${hub.type})`);
        const index = existingHubs.findIndex(e => e.hubId === hub.hubId);
        if (index !== -1) {
          existingHubs[index] = hub;
        } else {
          existingHubs.push(hub);
        }
      }
    }

    console.log(`\n✅ Seed complete — ${inserted} processed, ${skipped} skipped.`);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 DB disconnected");
  }
};

seed();
