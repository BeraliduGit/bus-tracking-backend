import { Router } from "express";
import { listRouteFilters, listRoutes } from "../controllers/route.controller.js";

const router = Router();

router.get("/filters", listRouteFilters);
router.get("/", listRoutes);

export default router;
