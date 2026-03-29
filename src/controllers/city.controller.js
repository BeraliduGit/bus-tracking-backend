import {
  getPassengerCityModel,
  getPassengerRouteModel,
} from "../modules/passenger/models/index.js";

const defaultSriLankanCities = [
  { name: "Colombo", lat: 6.9271, lng: 79.8612 },
  { name: "Kandy", lat: 7.2906, lng: 80.6337 },
  { name: "Galle", lat: 6.0535, lng: 80.221 },
  { name: "Jaffna", lat: 9.6615, lng: 80.0255 },
  { name: "Negombo", lat: 7.2084, lng: 79.8358 },
  { name: "Anuradhapura", lat: 8.3114, lng: 80.4037 },
  { name: "Trincomalee", lat: 8.5874, lng: 81.2152 },
  { name: "Batticaloa", lat: 7.731, lng: 81.6747 },
  { name: "Matara", lat: 5.9549, lng: 80.555 },
  { name: "Kurunegala", lat: 7.4863, lng: 80.3623 },
  { name: "Ratnapura", lat: 6.6828, lng: 80.3992 },
  { name: "Badulla", lat: 6.9934, lng: 81.055 },
  { name: "Gampaha", lat: 7.0917, lng: 79.9999 },
  { name: "Kalutara", lat: 6.5854, lng: 79.9607 },
  { name: "Puttalam", lat: 8.0362, lng: 79.8283 },
  { name: "Ampara", lat: 7.2974, lng: 81.6728 },
  { name: "Chilaw", lat: 7.5759, lng: 79.7954 },
  { name: "Kegalle", lat: 7.2513, lng: 80.3464 },
  { name: "Hambantota", lat: 6.1429, lng: 81.1212 },
  { name: "Vavuniya", lat: 8.7542, lng: 80.4982 },
  { name: "Mannar", lat: 8.981, lng: 79.9044 },
  { name: "Nuwara Eliya", lat: 6.9497, lng: 80.7891 },
  { name: "Polonnaruwa", lat: 7.9403, lng: 81.0188 },
  { name: "Matale", lat: 7.4675, lng: 80.6234 },
  { name: "Monaragala", lat: 6.8728, lng: 81.3507 },
  { name: "Kilinochchi", lat: 9.3961, lng: 80.384 },
  { name: "Mullaitivu", lat: 9.2671, lng: 80.8142 },
];

const normalizeCities = (cities = []) =>
  cities
    .filter((city) => city && city.name)
    .map((city) => ({
      name: String(city.name).trim(),
      lat: Number(city.lat),
      lng: Number(city.lng),
    }))
    .filter(
      (city) =>
        city.name.length > 0 &&
        Number.isFinite(city.lat) &&
        Number.isFinite(city.lng)
    );

const upsertCities = async (cities) => {
  const City = getPassengerCityModel();
  const normalized = normalizeCities(cities);

  if (!normalized.length) {
    return { insertedOrUpdated: 0 };
  }

  const operations = normalized.map((city) => ({
    updateOne: {
      filter: { name: city.name },
      update: { $set: city },
      upsert: true,
    },
  }));

  const result = await City.bulkWrite(operations, { ordered: false });

  return {
    insertedOrUpdated:
      (result.upsertedCount || 0) + (result.modifiedCount || 0),
  };
};

const getCities = async (req, res) => {
  try {
    const City = getPassengerCityModel();
    const Route = getPassengerRouteModel();

    // 1. Fetch cities from the City collection
    const storedCities = await City.find({}, { _id: 0, name: 1, lat: 1, lng: 1 })
      .lean();

    // 2. Fetch unique city names from the Route collection (startCity and endCity)
    const [startCities, endCities] = await Promise.all([
      Route.distinct("startCity"),
      Route.distinct("endCity"),
    ]);

    // 3. Merge all city names and deduplicate
    const cityNamesMap = new Map();

    // Add stored cities first (preserving their lat/lng if available)
    storedCities.forEach((city) => {
      if (city.name) {
        cityNamesMap.set(city.name.trim(), {
          name: city.name.trim(),
          lat: city.lat,
          lng: city.lng,
        });
      }
    });

    // Add cities from routes if not already present
    [...startCities, ...endCities].forEach((name) => {
      if (name && typeof name === "string") {
        const trimmedName = name.trim();
        if (trimmedName && !cityNamesMap.has(trimmedName)) {
          cityNamesMap.set(trimmedName, {
            name: trimmedName,
            lat: null, // Locations from routes don't necessarily have lat/lng in the city model
            lng: null,
          });
        }
      }
    });

    // 4. Convert back to array, filter out empty names, and sort alphabetically
    const consolidatedCities = Array.from(cityNamesMap.values())
      .filter((city) => city.name.length > 0)
      .sort((a, b) => a.name.localeCompare(b.name));

    return res.status(200).json({
      success: true,
      message: "Cities fetched successfully",
      count: consolidatedCities.length,
      cities: consolidatedCities,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching cities",
      error: error.message,
    });
  }
};

const seedDefaultCities = async (req, res) => {
  try {
    const result = await upsertCities(defaultSriLankanCities);
    return res.status(200).json({
      message: "Default Sri Lankan cities seeded successfully",
      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error seeding default cities",
      error: error.message,
    });
  }
};

const bulkUpsertCities = async (req, res) => {
  try {
    const { cities } = req.body;

    if (!Array.isArray(cities)) {
      return res.status(400).json({
        message: "Request body must include a cities array",
      });
    }

    const result = await upsertCities(cities);

    if (!result.insertedOrUpdated) {
      return res.status(400).json({
        message: "No valid cities provided",
      });
    }

    return res.status(200).json({
      message: "Cities upserted successfully",
      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error upserting cities",
      error: error.message,
    });
  }
};

export { getCities, seedDefaultCities, bulkUpsertCities };
