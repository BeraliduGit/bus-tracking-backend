const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const alertController = require("../controllers/alertController");

// Get all active alerts
router.get("/active", alertController.getActiveAlerts);

// Get alerts for a passenger
router.get("/passenger/:passengerId", alertController.getPassengerAlerts);

// Get alerts for a route
router.get("/route/:routeId", alertController.getRouteAlerts);

// Get alert by ID
router.get("/:id", alertController.getAlert);

// Create alert
router.post("/", authenticateToken, alertController.createAlert);

// Update alert
router.put("/:id", authenticateToken, alertController.updateAlert);

// Toggle alert active status
router.patch("/:id/toggle", authenticateToken, alertController.toggleAlert);

// Mark alert as triggered
router.patch("/:id/trigger", authenticateToken, alertController.triggerAlert);

// Bulk update route alerts
router.patch("/route/:routeId/bulk-update", authenticateToken, alertController.bulkUpdateRouteAlerts);

// Delete alert
router.delete("/:id", authenticateToken, alertController.deleteAlert);

module.exports = router;
