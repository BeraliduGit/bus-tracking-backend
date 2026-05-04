const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const scheduleController = require("../controllers/scheduleController");

// Get all schedules
router.get("/", scheduleController.getAllSchedules);

// Get schedule by ID
router.get("/:id", scheduleController.getSchedule);

// Get delayed buses
router.get("/list/delayed", scheduleController.getDelayedBuses);

// Get schedules for a route
router.get("/route/:routeId", scheduleController.getSchedulesByRoute);

// Get daily schedule for a route
router.get("/route/:routeId/daily", scheduleController.getDailySchedule);

// Get first and last bus of the day
router.get("/route/:routeId/first-last", scheduleController.getFirstLastBus);

// Get schedules by bus
router.get("/bus/:busId", scheduleController.getSchedulesByBus);

// Create schedule
router.post("/", authenticateToken, scheduleController.createSchedule);

// Update schedule
router.put("/:id", authenticateToken, scheduleController.updateSchedule);

// Update schedule status
router.patch("/:id/status", authenticateToken, scheduleController.updateScheduleStatus);

// Delete schedule
router.delete("/:id", authenticateToken, scheduleController.deleteSchedule);

module.exports = router;
