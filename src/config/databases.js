import mongoose from "mongoose";
import { createRequire } from "module";
import { DB_NAME } from "./constants.js";

const require = createRequire(import.meta.url);
const driverMongoose = require("mongoose");

let passengerConnection;

export const connectDatabases = async () => {
  const passengerUri = process.env.PASSENGER_MONGODB_URI || process.env.MONGO_URI || process.env.MONGODB_URI;
  const driverUri = process.env.DRIVER_MONGODB_URI || process.env.MONGODB_URI;

  if (!passengerUri) {
    throw new Error("Missing passenger DB URI. Set PASSENGER_MONGODB_URI (or MONGO_URI/MONGODB_URI).");
  }

  if (!driverUri) {
    throw new Error("Missing driver DB URI. Set DRIVER_MONGODB_URI (or MONGODB_URI).");
  }

  const passengerConn = mongoose.createConnection(passengerUri, {
    dbName: process.env.PASSENGER_DB_NAME || DB_NAME,
  });
  await passengerConn.asPromise();
  passengerConnection = passengerConn;

  await driverMongoose.connect(driverUri, {
    dbName: process.env.DRIVER_DB_NAME,
  });

  console.log("Connected passenger database:", passengerConnection.name);
  console.log("Connected driver database:", driverMongoose.connection.name);
};

export const getPassengerConnection = () => {
  if (!passengerConnection) {
    throw new Error("Passenger DB connection is not initialized.");
  }

  return passengerConnection;
};
