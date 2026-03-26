import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { connectDatabases } from "./config/databases.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

const startServer = async () => {
    try {
        await connectDatabases();

        const server = http.createServer(app);
        const io = new Server(server, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"],
            },
        });

        app.set("io", io);

        io.on("connection", (socket) => {
            console.log("User connected", socket.id);

            socket.on("join:route", (routeId) => {
                if (!routeId) return;
                socket.join('route:${routeId}');
                console.log('socket ${socket.id}joined route ${routeId}');
            });

            socket.on("leave:route", ({ routeId }) => {
                if (!routeId) return;
                socket.leave('route:${routeId}');
                console.log('socket ${socket.id} left route ${routeId}');
            });

            socket.on("driver:location:update", (data) => {
                const { driverId, routeId, lat, lng, speed, heading, timestamp } = data;


                if (!driverId || !routeId || lat == null || lng == null) {
                    return;
                }

                const locationData = {
                    driverId,
                    routeId,
                    location: {
                        lat,
                        lng,
                    },
                    speed: speed ?? null,
                    heading: heading ?? null,
                    timestamp: timestamp ?? new Date().toISOString(),
                };

                io.to(`route:${routeId}`).emit("driver:location:update", locationData);

                console.log("Live location sent:", locationData);
            });

            socket.on("disconnect", () => {
                console.log("User disconnected", socket.id);
            });

            socket.on("disconnect", () => {
                console.log("Socket disconnected", socket.id);
            });
        });

        server.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });

        server.on("error", (error) => {
            console.log("Server error", error);
            throw error;
        });
    } catch (error) {
        console.error("Error starting the server:", error);
    }
};

startServer();