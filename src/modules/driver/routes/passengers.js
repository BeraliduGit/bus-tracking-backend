const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const passengerController = require("../controllers/passengerController");

// Auth routes
router.post("/signup", passengerController.signUp);
router.post("/login", passengerController.login);

// Passenger routes
router.get("/:id", authenticateToken, passengerController.getDetails);
router.put("/:id", authenticateToken, passengerController.updateDetails);
router.get("/:id/profile", authenticateToken, passengerController.getProfile);

module.exports = router;
