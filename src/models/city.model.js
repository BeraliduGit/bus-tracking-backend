import mongoose, { Schema } from "mongoose";

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

export default mongoose.model("City", citySchema);
