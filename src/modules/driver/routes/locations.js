const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const locationController = require("../controllers/locationController");

// Location tracking routes
router.post("/", authenticateToken, locationController.recordLocation);
router.get("/driver/:driverId", locationController.getDriverLocation);
router.get(
  "/driver/:driverId/history",
  locationController.getDriverLocationHistory
);
router.get("/active/all", locationController.getActiveDriverLocations);
router.get("/nearby/search", locationController.findNearbyDrivers);

module.exports = router;
