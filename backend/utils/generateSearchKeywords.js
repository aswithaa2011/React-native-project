/**
 * generateSearchKeywords.js
 *
 * Automatically generates search keywords from a property object.
 * Call this before any create or update operation — never expose it to the API consumer.
 *
 * @param {object} property  Plain object or Mongoose doc with property fields
 * @returns {string[]}       Deduplicated, lowercased, trimmed keyword array
 */

// ─── Stop Words ───────────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  "the", "is", "are", "a", "an", "of", "and", "or", "in", "on",
  "at", "to", "for", "with", "by", "from", "as", "it", "its",
  "that", "this", "was", "be", "been", "has", "have", "had",
  "but", "not", "no", "so", "if", "we", "our", "your", "my",
  "their", "they", "he", "she", "his", "her", "you", "i", "me",
  "us", "him", "who", "which", "what", "when", "where", "how",
  "all", "any", "each", "very", "just", "also", "then", "than",
  "there", "here", "do", "did", "does", "will", "would", "can",
  "could", "may", "might", "shall", "should", "must", "into",
  "up", "out", "about", "after", "before", "over", "under",
  "again", "more", "most", "other", "such", "only", "own", "same",
  "few", "both", "too", "very", "s", "t", "now",
]);

// ─── Type → Keyword Map ───────────────────────────────────────────────────────

const PROPERTY_TYPE_KEYWORDS = {
  Boys: [
    "boys", "boys hostel", "boys pg", "boys accommodation", "boys stay", "boys room",
    "male", "male hostel", "male pg",
    "gents", "gents hostel", "gents pg",
    "mens hostel", "mens pg",
    "student hostel", "college hostel",
    "working men's hostel", "working men pg",
    "hostel", "pg", "accommodation", "stay",
  ],
  Girls: [
    "girls", "girls hostel", "girls pg", "girls accommodation", "girls stay", "girls room",
    "female", "female hostel", "female pg",
    "ladies", "ladies hostel", "ladies pg",
    "women hostel", "women pg",
    "student hostel", "college hostel",
    "working women hostel", "working women pg",
    "hostel", "pg", "accommodation", "stay",
  ],
  "Co-Living": [
    "coliving", "co living", "co-living",
    "shared hostel", "shared pg", "shared accommodation", "shared room",
    "community living",
    "hostel", "pg", "stay", "accommodation",
  ],
};

// ─── Amenity → Keyword Map ────────────────────────────────────────────────────

const AMENITY_KEYWORDS = {
  WiFi: ["wifi", "internet", "free wifi", "high speed internet", "broadband"],
  Food: ["food", "meals", "mess", "breakfast", "lunch", "dinner", "veg food", "non veg"],
  Parking: ["parking", "bike parking", "car parking"],
  Laundry: ["laundry", "washing", "washing machine"],
  Security: ["security", "security guard", "cctv", "safe hostel", "24x7 security"],
  AC: ["ac", "air conditioner", "air conditioning"],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Normalize a string: lowercase + trim.
 * @param {string} str
 * @returns {string}
 */
const normalize = (str) => String(str).toLowerCase().trim();

/**
 * Tokenize a sentence into meaningful words (strips stop words & short tokens).
 * @param {string} text
 * @returns {string[]}
 */
const tokenize = (text) => {
  if (!text || typeof text !== "string") return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ") // keep only alphanumeric, spaces, hyphens
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
};

// ─── Keyword Generators ───────────────────────────────────────────────────────

/**
 * Keywords from the property name.
 * Generates individual tokens + the full normalized name.
 *
 * @param {string} propertyName
 * @returns {string[]}
 */
const fromPropertyName = (propertyName) => {
  if (!propertyName) return [];
  const normalized = normalize(propertyName);
  const tokens = tokenize(propertyName);
  const keywords = [...tokens];

  // Build progressive n-grams (e.g. "green stay", "green stay hostel")
  const words = normalized.split(/\s+/).filter(Boolean);
  for (let i = 2; i <= words.length; i++) {
    keywords.push(words.slice(0, i).join(" "));
  }

  return keywords;
};

/**
 * Keywords from property type enum.
 * @param {string} propertyType
 * @returns {string[]}
 */
const fromPropertyType = (propertyType) => {
  if (!propertyType) return [];
  return PROPERTY_TYPE_KEYWORDS[propertyType] ?? [];
};

/**
 * Keywords from city and area.
 * @param {{ city?: string, area?: string }} location
 * @returns {string[]}
 */
const fromLocation = (location = {}) => {
  const keywords = [];

  const addLocationKeywords = (place) => {
    if (!place || typeof place !== "string" || !place.trim()) return;
    const p = normalize(place);
    keywords.push(p, `${p} hostel`, `${p} pg`);
  };

  addLocationKeywords(location.city);
  addLocationKeywords(location.area);

  return keywords;
};

/**
 * Keywords from amenities array.
 * @param {string[]} amenities
 * @returns {string[]}
 */
const fromAmenities = (amenities = []) => {
  if (!Array.isArray(amenities)) return [];
  return amenities.flatMap((amenity) => AMENITY_KEYWORDS[amenity] ?? []);
};

/**
 * Keywords from the about / description field.
 * Extracts meaningful tokens after removing stop words.
 * @param {string} about
 * @returns {string[]}
 */
const fromAbout = (about) => tokenize(about);

/**
 * Keywords from address sub-fields (street, area cues).
 * @param {{ doorNo?: string, street?: string, pincode?: string }} address
 * @returns {string[]}
 */
const fromAddress = (address = {}) => {
  const keywords = [];
  if (address?.street) keywords.push(...tokenize(address.street));
  return keywords;
};

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * Generate the complete keyword array for a property.
 *
 * @param {object} property
 * @param {string}   property.propertyName
 * @param {string}   property.propertyType   — "Boys" | "Girls" | "Co-Living"
 * @param {object}   property.location       — { city, area, latitude, longitude }
 * @param {string[]} property.amenities
 * @param {string}   property.about
 * @param {object}   property.address        — { doorNo, street, pincode }
 * @returns {string[]}  Unique, lowercased, trimmed keywords
 */
const generateSearchKeywords = (property = {}) => {
  const raw = [
    ...fromPropertyName(property.propertyName),
    ...fromPropertyType(property.propertyType),
    ...fromLocation(property.location),
    ...fromAmenities(property.amenities),
    ...fromAbout(property.about),
    ...fromAddress(property.address),
  ];

  // Normalize, deduplicate, drop empties
  const seen = new Set();
  const unique = [];

  for (const kw of raw) {
    if (!kw || typeof kw !== "string") continue;
    const cleaned = normalize(kw);
    if (!cleaned || seen.has(cleaned)) continue;
    seen.add(cleaned);
    unique.push(cleaned);
  }

  return unique;
};

export default generateSearchKeywords;
