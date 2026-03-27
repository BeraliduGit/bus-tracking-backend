const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const busController = require("../controllers/busController");

// All bus routes require authentication
router.post("/", authenticateToken, busController.registerBus);
router.get("/my-buses", authenticateToken, busController.getMyBuses);
router.get("/:id", authenticateToken, busController.getBus);
router.put("/reset-active", authenticateToken, busController.resetActiveBus);
router.put("/:id/select", authenticateToken, busController.selectActiveBus);

module.exports = router;
