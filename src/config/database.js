import mongoose from "mongoose";
const connectToDatabase = async () => {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    try {
        const connection = await mongoose.connect(mongoUri);
        console.log("\n Connected to MongoDB");
        console.log(`Connected to MongoDB at ${connection.connection.host}`);

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); 

    }
}
export default connectToDatabase;