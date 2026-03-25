const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const driverController = require("../controllers/driverController");

// Auth routes
router.post("/signup", driverController.signUp);
router.post("/login", driverController.login);

// Driver routes
router.get("/:id", authenticateToken, driverController.getDetails);
router.put("/:id", authenticateToken, driverController.updateDetails);
router.put("/:id/location", authenticateToken, driverController.updateLocation);
router.get("/:id/profile", authenticateToken, driverController.getProfile);

module.exports = router;
