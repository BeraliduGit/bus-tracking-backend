import express from "express";
import cors from "cors";
import busRoutes from "./routes/bus.routes.js";

const app = express(); //create an express application
app.use(cors({
	origin: ["http://localhost:3000"],
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	credentials: true,
}));
app.use(express.json()); //middleware to parse JSON request bodies

// routes import
import userRoutes from "./routes/user.route.js";

// routes declaration
app.use("/api/v1/users", userRoutes);

// example route: http://localhost:4000/api/v1/users/register
export default app;

//Connect Routes to App
app.use("/api/bus", busRoutes);