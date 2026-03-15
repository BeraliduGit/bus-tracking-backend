import dotenv from "dotenv";
import connectToDatabase from "./config/database.js";
import app from "./app.js";

dotenv.config({
  path: './.env'
});

const startServer = async () => {
    try{
        await connectToDatabase();

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
    