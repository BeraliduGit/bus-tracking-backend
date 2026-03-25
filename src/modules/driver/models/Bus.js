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
      required: [true, "Please provide a registration number"],
      unique: true,
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
      required: [true, "Please provide bus capacity"],
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
    amenities: [String], // ["AC", "USB Charging", "WiFi", etc.]
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
