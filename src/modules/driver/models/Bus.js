const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema(
  {
    busNumber: {
      type: String,
      required: [true, "Please provide a bus number"],
      unique: true,
      trim: true,
    },
    registrationNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    busRouteNumber: {
      type: String,
      trim: true,
    },
    routeStartingLocation: {
      type: String,
      trim: true,
    },
    routeEndingLocation: {
      type: String,
      trim: true,
    },
    manufacturer: {
      type: String,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
    year: Number,
    capacity: {
      type: Number,
      default: 50,
    },
    currentPassengers: {
      type: Number,
      default: 0,
    },
    assignedRoute: {
      type: mongoose.Schema.ObjectId,
      ref: "Route",
      default: null,
    },
    assignedDriver: {
      type: mongoose.Schema.ObjectId,
      ref: "Driver",
      default: null,
    },
    amenities: [String],
    lastMaintenanceDate: Date,
    nextMaintenanceDate: Date,
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance", "retired"],
      default: "active",
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

module.exports = mongoose.model("Bus", BusSchema);
