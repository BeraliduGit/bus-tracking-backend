const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema(
  {
    passengerId: {
      type: mongoose.Schema.ObjectId,
      ref: "Passenger",
      required: true,
    },
    routeId: {
      type: mongoose.Schema.ObjectId,
      ref: "Route",
      required: true,
    },
    scheduleId: {
      type: mongoose.Schema.ObjectId,
      ref: "Schedule",
    },
    alertType: {
      type: String,
      enum: ["arrival-time", "delay", "cancellation", "route-update", "custom"],
      required: true,
    },
    alertTime: {
      type: String, // HH:MM format - when to trigger the alert
      required: true,
    },
    triggerBefore: {
      type: Number, // minutes before departure/arrival
      default: 15,
    },
    notificationMethods: {
      type: [String],
      enum: ["email", "sms", "push", "in-app"],
      default: ["in-app"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    recurrence: {
      type: String,
      enum: ["once", "daily", "weekly", "monthly"],
      default: "once",
    },
    daysOfWeek: [String], // for weekly recurrence
    expiryDate: Date,
    lastTriggered: Date,
    nextTrigger: Date,
    description: String,
    isTriggered: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for finding alerts by passenger and route
AlertSchema.index({ passengerId: 1, isActive: 1 });
AlertSchema.index({ routeId: 1, isActive: 1 });
AlertSchema.index({ nextTrigger: 1 });

module.exports = mongoose.model("Alert", AlertSchema);
