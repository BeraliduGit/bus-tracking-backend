import mongoose from "mongoose";
const connectToDatabase = async () => {
    try {
        connectToDatabase = await mongoose.connect(process.env.MONGODB_URI);
        console.log("\n Connected to MongoDB");
        console.log(`Connected to MongoDB at ${connectToDatabase.connection.host}`);

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with an error code

    }
}
export default connectToDatabase;