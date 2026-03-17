import express from "express";
import {
  updateBusLocation,
  getBusLocation
} from "../controllers/bus.controller.js";

const router = express.Router();

router.post("/update-location", updateBusLocation);
router.get("/locations", getBusLocation);

export default router;