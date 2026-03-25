import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { getPassengerConnection } from "../../../config/databases.js";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 50,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function onSave() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function isPasswordCorrect(password) {
  return bcrypt.compare(password, this.password);
};

const citySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const coordinateSchema = new Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false }
);

const routeSchema = new Schema(
  {
    routeNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    startCity: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    endCity: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    startLocation: {
      type: coordinateSchema,
      required: false,
    },
    endLocation: {
      type: coordinateSchema,
      required: false,
    },
    pathCoordinates: {
      type: [coordinateSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const busLocationSchema = new mongoose.Schema({
  busId: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  speed: {
    type: Number,
    default: 0,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const getModel = (name, schema) => {
  const connection = getPassengerConnection();
  return connection.models[name] || connection.model(name, schema);
};

export const getPassengerUserModel = () => getModel("User", userSchema);
export const getPassengerCityModel = () => getModel("City", citySchema);
export const getPassengerRouteModel = () => getModel("Route", routeSchema);
export const getPassengerBusLocationModel = () => getModel("BusLocation", busLocationSchema);
