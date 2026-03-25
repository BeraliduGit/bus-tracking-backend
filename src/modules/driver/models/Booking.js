const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    passenger: {
      type: mongoose.Schema.ObjectId,
      ref: "Passenger",
      required: true,
    },
    route: {
      type: mongoose.Schema.ObjectId,
      ref: "Route",
      required: true,
    },
    bus: {
      type: mongoose.Schema.ObjectId,
      ref: "Bus",
      default: null,
    },
    driver: {
      type: mongoose.Schema.ObjectId,
      ref: "Driver",
      default: null,
    },
    boardingStop: String,
    alightingStop: String,
    bookingDate: Date,
    boardingTime: Date,
    alightingTime: Date,
    status: {
      type: String,
      enum: ["pending", "confirmed", "boarded", "completed", "cancelled"],
      default: "pending",
    },
    seatNumber: String,
    fare: Number,
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", BookingSchema);
