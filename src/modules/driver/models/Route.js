const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema(
  {
    routeName: {
      type: String,
      required: [true, "Please provide a route name"],
      unique: true,
      trim: true,
    },
    routeNumber: {
      type: String,
      required: [true, "Please provide a route number"],
      unique: true,
      trim: true,
    },
    startPoint: {
      name: String,
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: [Number], // [longitude, latitude]
      },
    },
    endPoint: {
      name: String,
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: [Number],
      },
    },
    stops: [
      {
        stopName: String,
        stopOrder: Number,
        location: {
          type: {
            type: String,
            enum: ["Point"],
            default: "Point",
          },
          coordinates: [Number],
        },
        estimatedWaitTime: Number, // in minutes
      },
    ],
    totalDistance: Number, // in km
    estimatedDuration: Number, // in minutes
    schedule: [
      {
        departureTime: String, // HH:MM format
        arrivalTime: String,
        dayOfWeek: String,
      },
    ],
    assignedDriver: {
      type: mongoose.Schema.ObjectId,
      ref: "Driver",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Geospatial index for locations
RouteSchema.index({ "startPoint.location": "2dsphere" });
RouteSchema.index({ "endPoint.location": "2dsphere" });
RouteSchema.index({ "stops.location": "2dsphere" });

module.exports = mongoose.model("Route", RouteSchema);
