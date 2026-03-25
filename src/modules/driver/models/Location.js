const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.ObjectId,
      ref: "Driver",
      required: true,
    },
    bus: {
      type: mongoose.Schema.ObjectId,
      ref: "Bus",
      default: null,
    },
    route: {
      type: mongoose.Schema.ObjectId,
      ref: "Route",
      default: null,
    },
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
    speed: {
      type: Number,
      default: 0, // in km/h
    },
    heading: {
      type: Number,
      default: 0, // in degrees
    },
    altitude: {
      type: Number,
      default: 0, // in meters
    },
    accuracy: {
      type: Number,
      default: 0, // in meters
    },
    currentPassengers: {
      type: Number,
      default: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

// Geospatial index
LocationSchema.index({ location: "2dsphere" });
// TTL index to auto-delete records after 30 days
LocationSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model("Location", LocationSchema);
