const Location = require("../models/Location");
const Driver = require("../models/Driver");
const { DEFAULT_MAX_DISTANCE, ACTIVE_DRIVER_TIME_WINDOW } = require("../config/constants");

// @desc    Record driver location
// @route   POST /api/locations
exports.recordLocation = async (req, res) => {
  try {
    const { driverId, busId, routeId, longitude, latitude, speed, heading } =
      req.body;

    if (!driverId || longitude === undefined || latitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Driver ID, latitude, and longitude are required",
      });
    }

    // Verify driver exists
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    // Create location record
    const location = await Location.create({
      driver: driverId,
      bus: busId || null,
      route: routeId || null,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      speed: speed || 0,
      heading: heading || 0,
    });

    // Also update driver's current location
    driver.currentLocation = {
      type: "Point",
      coordinates: [longitude, latitude],
    };
    await driver.save();

    res.status(201).json({
      success: true,
      message: "Location recorded successfully",
      location,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get driver's current location
// @route   GET /api/locations/driver/:driverId
exports.getDriverLocation = async (req, res) => {
  try {
    const location = await Location.findOne({
      driver: req.params.driverId,
    })
      .sort({ timestamp: -1 })
      .limit(1);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "No location found for this driver",
      });
    }

    res.status(200).json({
      success: true,
      location,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get driver's location history
// @route   GET /api/locations/driver/:driverId/history
exports.getDriverLocationHistory = async (req, res) => {
  try {
    const { limit = 100, skip = 0 } = req.query;

    const locations = await Location.find({ driver: req.params.driverId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Location.countDocuments({
      driver: req.params.driverId,
    });

    res.status(200).json({
      success: true,
      total,
      count: locations.length,
      locations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all active drivers' locations
// @route   GET /api/locations/active
exports.getActiveDriverLocations = async (req, res) => {
  try {
    // Get latest location for each active driver
    const locations = await Location.aggregate([
      {
        $match: {
          timestamp: {
            $gte: new Date(Date.now() - ACTIVE_DRIVER_TIME_WINDOW),
          },
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: "$driver",
          location: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$location" },
      },
      {
        $lookup: {
          from: "drivers",
          localField: "driver",
          foreignField: "_id",
          as: "driverDetails",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: locations.length,
      locations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Find nearby drivers
// @route   GET /api/locations/nearby
exports.findNearbyDrivers = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance } = req.query;
    const searchRadius = maxDistance ? parseInt(maxDistance) : DEFAULT_MAX_DISTANCE;

    if (longitude === undefined || latitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const drivers = await Location.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: searchRadius,
        },
      },
    })
      .sort({ timestamp: -1 })
      .populate("driver", "name email phone status busNumber");

    res.status(200).json({
      success: true,
      count: drivers.length,
      drivers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
