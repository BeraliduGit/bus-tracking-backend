import { Router } from "express";
import {
  getCities,
  seedDefaultCities,
  bulkUpsertCities,
} from "../controllers/city.controller.js";

const router = Router();

router.get("/", getCities);
router.post("/seed", seedDefaultCities);
router.post("/bulk-upsert", bulkUpsertCities);

export default router;
