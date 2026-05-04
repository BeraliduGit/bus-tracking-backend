import express from "express";
import cors from "cors";
import busRoutes from "./routes/bus.routes.js";
import { createRequire } from "module";

const app = express(); //create an express application
const require = createRequire(import.meta.url);

const driverRoutes = {
  drivers: require("./modules/driver/routes/drivers"),
  passengers: require("./modules/driver/routes/passengers"),
  routes: require("./modules/driver/routes/routes"),
  locations: require("./modules/driver/routes/locations"),
  buses: require("./modules/driver/routes/buses"),
  schedules: require("./modules/driver/routes/schedules"),
  alerts: require("./modules/driver/routes/alerts"),
};

const driverErrorHandler = require("./modules/driver/middleware/errorHandler");

app.use(cors({
	origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map((item) => item.trim()) : ["http://localhost:3000"],
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	credentials: true,
}));
app.use(express.json()); //middleware to parse JSON request bodies

// logger for debug
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.originalUrl}`);
  next();
});

// routes import
import userRoutes from "./routes/user.route.js";
import cityRoutes from "./routes/city.route.js";
import routeRoutes from "./routes/route.route.js";

// routes declaration
app.use("/api/passenger/v1/users", userRoutes);
app.use("/api/passenger/v1/cities", cityRoutes);
app.use("/api/passenger/v1/routes", routeRoutes);
app.use("/api/passenger/bus", busRoutes);

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/cities", cityRoutes);
app.use("/api/v1/routes", routeRoutes);
app.use("/api/bus", busRoutes);

app.use("/api/driver/drivers", driverRoutes.drivers);
app.use("/api/driver/passengers", driverRoutes.passengers);
app.use("/api/driver/routes", driverRoutes.routes);
app.use("/api/driver/locations", driverRoutes.locations);
app.use("/api/driver/buses", driverRoutes.buses);
app.use("/api/driver/schedules", driverRoutes.schedules);
app.use("/api/driver/alerts", driverRoutes.alerts);

app.use("/api/drivers", driverRoutes.drivers);
app.use("/api/passengers", driverRoutes.passengers);
app.use("/api/routes", driverRoutes.routes);
app.use("/api/locations", driverRoutes.locations);
app.use("/api/schedules", driverRoutes.schedules);
app.use("/api/alerts", driverRoutes.alerts);

app.get("/api/health", (req, res) => {
	res.status(200).json({
		success: true,
		message: "Server is running",
		timestamp: new Date(),
	});
});

app.use((req, res) => {
	res.status(404).json({
		success: false,
		message: "Route not found",
	});
});

app.use(driverErrorHandler);

// example route: http://localhost:4000/api/v1/users/register
export default app;