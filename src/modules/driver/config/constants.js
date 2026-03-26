// Application Constants - All should come from environment variables
// Uses getters so process.env is read lazily (after dotenv has loaded)

module.exports = {
  // Server Configuration
  get PORT() { return process.env.PORT || 4000; },
  get NODE_ENV() { return process.env.NODE_ENV || "development"; },

  // Database Configuration
  get MONGODB_URI() {
    return (
      process.env.DRIVER_MONGODB_URI ||
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/bus-tracking-driver"
    );
  },

  // JWT Configuration
  get JWT_SECRET() { return process.env.JWT_SECRET || "development_secret_key_do_not_use_in_production"; },
  get JWT_EXPIRE() { return process.env.JWT_EXPIRE || "7d"; },

  // Geolocation Configuration
  get DEFAULT_MAX_DISTANCE() { return parseInt(process.env.DEFAULT_MAX_DISTANCE) || 5000; },
  get ACTIVE_DRIVER_TIME_WINDOW() { return parseInt(process.env.ACTIVE_DRIVER_TIME_WINDOW) || 5 * 60 * 1000; },

  // CORS Configuration
  get CORS_ORIGIN() { return process.env.CORS_ORIGIN || "*"; },

  // Database TTL Configuration
  get LOCATION_HISTORY_TTL() { return parseInt(process.env.LOCATION_HISTORY_TTL) || 2592000; },

  // Password Configuration
  get BCRYPT_ROUNDS() { return parseInt(process.env.BCRYPT_ROUNDS) || 10; },
};
