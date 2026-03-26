import dotenv from "dotenv";
import { connectDatabases } from "./config/databases.js";
import app from "./app.js";

dotenv.config();

const startServer = async () => {
    try{
        await connectDatabases();

        app.on("error", (error) => {
            console.log("EROOR", error);
            throw error;
        });

        app.listen(process.env.PORT|| 4000, () => {
            console.log(`Server is running on port:
                 ${process.env.PORT }`);
            });
        
    } catch (error) {
        console.error("Error starting the server:", error);
    }
    }

    startServer();
    