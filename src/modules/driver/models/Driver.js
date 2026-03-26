const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { BCRYPT_ROUNDS } = require("../config/constants");

const DriverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a driver name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number"],
      match: [/^[0-9]{10}$/, "Please provide a valid 10-digit phone number"],
    },
    nic: {
      type: String,
      required: [true, "Please provide a NIC"],
      unique: true,
    },
    drivingLicenseId: {
      type: String,
      required: [true, "Please provide a driving license ID"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
      select: false, // Don't return password by default
    },
    busNumber: {
      type: String,
      trim: true,
    },
    busRouteName: {
      type: String,
      trim: true,
    },
    busRouteNumber: {
      type: String,
      trim: true,
    },
    routeStartingLocation: {
      type: String,
      trim: true,
    },
    routeEndingLocation: {
      type: String,
      trim: true,
    },
    vehicleType: {
      type: String,
      enum: ["sedan", "suv", "bus", "van", "truck"],
      default: "bus",
    },
    vehicleRegistration: {
      type: String,
      unique: true,
      sparse: true,
    },
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["online", "offline", "on-duty", "off-duty"],
      default: "offline",
    },
  },
  {
    timestamps: true,
  }
);

// Geospatial index for location
DriverSchema.index({ currentLocation: "2dsphere" });

// Hash password before saving
DriverSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
DriverSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Driver", DriverSchema);
