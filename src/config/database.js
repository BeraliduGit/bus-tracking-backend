import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";

const connectToDatabase = async () => {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error("Missing MongoDB URI. Set MONGO_URI or MONGODB_URI in .env");
    }

    try {
        const connection = await mongoose.connect(mongoUri, { dbName: DB_NAME });
        console.log("\n Connected to MongoDB");
        console.log(`Connected database: ${connection.connection.name}`);
        console.log(`Connected to MongoDB at ${connection.connection.host}`);

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); 

    }
}
export default connectToDatabase;