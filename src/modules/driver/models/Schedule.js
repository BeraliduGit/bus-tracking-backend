const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema(
  {
    routeId: {
      type: mongoose.Schema.ObjectId,
      ref: "Route",
      required: true,
    },
    busId: {
      type: mongoose.Schema.ObjectId,
      ref: "Bus",
    },
    driverId: {
      type: mongoose.Schema.ObjectId,
      ref: "Driver",
    },
    date: {
      type: Date,
      required: true,
    },
    dayOfWeek: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      required: true,
    },
    departureTime: {
      type: String, // HH:MM format
      required: true,
    },
    arrivalTime: {
      type: String, // HH:MM format
      required: true,
    },
    estimatedDuration: {
      type: Number, // in minutes
    },
    stopTimings: [
      {
        stopName: String,
        stopOrder: Number,
        estimatedArrivalTime: String, // HH:MM
        estimatedWaitTime: Number, // in minutes
      },
    ],
    actualDepartureTime: String,
    actualArrivalTime: String,
    delayMinutes: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["scheduled", "in-progress", "completed", "cancelled", "delayed"],
      default: "scheduled",
    },
    isHoliday: {
      type: Boolean,
      default: false,
    },
    isWeekend: {
      type: Boolean,
      default: false,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Index for finding schedules by route and date
ScheduleSchema.index({ routeId: 1, date: 1 });
ScheduleSchema.index({ busId: 1, date: 1 });
ScheduleSchema.index({ dayOfWeek: 1, status: 1 });

module.exports = mongoose.model("Schedule", ScheduleSchema);
