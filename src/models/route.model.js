import mongoose, { Schema } from "mongoose";

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

export default mongoose.model("Route", routeSchema);
