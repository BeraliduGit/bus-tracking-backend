// Application Constants - All should come from environment variables

module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // Database Configuration
  MONGODB_URI:
    process.env.DRIVER_MONGODB_URI ||
    process.env.MONGODB_URI ||
    "mongodb://localhost:27017/bus-tracking-driver",

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || "development_secret_key_do_not_use_in_production",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",

  // Geolocation Configuration
  DEFAULT_MAX_DISTANCE: parseInt(process.env.DEFAULT_MAX_DISTANCE) || 5000, // in meters
  ACTIVE_DRIVER_TIME_WINDOW: parseInt(process.env.ACTIVE_DRIVER_TIME_WINDOW) || 5 * 60 * 1000, // 5 minutes in milliseconds

  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",

  // Database TTL Configuration
  LOCATION_HISTORY_TTL: parseInt(process.env.LOCATION_HISTORY_TTL) || 2592000, // 30 days in seconds

  // Password Configuration
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 10,
};
