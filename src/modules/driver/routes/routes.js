const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const routeController = require("../controllers/routeController");

// Routes
router.get("/", routeController.getAllRoutes);
router.get("/:id", routeController.getRoute);
router.post("/", authenticateToken, routeController.createRoute);
router.put("/:id", authenticateToken, routeController.updateRoute);
router.get("/driver/:driverId", routeController.getRoutesByDriver);
router.get("/:id/schedule", routeController.getRouteSchedule);
router.get("/:id/stops", routeController.getRouteStops);

module.exports = router;
