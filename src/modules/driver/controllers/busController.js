const Bus = require("../models/Bus");

// @desc    Register a new bus
// @route   POST /api/driver/buses
exports.registerBus = async (req, res) => {
  try {
    const {
      busNumber,
      busRouteNumber,
      routeStartingLocation,
      routeEndingLocation,
    } = req.body;

    // Validation
    if (!busNumber || !busRouteNumber) {
      return res.status(400).json({
        success: false,
        message: "Please provide bus number and route number",
      });
    }

    if (!routeStartingLocation || !routeEndingLocation) {
      return res.status(400).json({
        success: false,
        message: "Please select starting and ending locations",
      });
    }

    // Check if bus already exists with same bus number
    const existingBus = await Bus.findOne({ busNumber });
    if (existingBus) {
      return res.status(400).json({
        success: false,
        message: "A bus with this bus number already exists",
      });
    }

    // Create bus and assign to the authenticated driver
    const bus = await Bus.create({
      busNumber,
      registrationNumber: busNumber, // use busNumber as registration if not provided separately
      busRouteNumber,
      routeStartingLocation,
      routeEndingLocation,
      capacity: 50, // default capacity
      assignedDriver: req.user.id,
      status: "active",
    });

    // If requested, set this new bus as the driver's active bus immediately
    if (req.body.setAsActive) {
      const Driver = require("../models/Driver");
      await Driver.findByIdAndUpdate(req.user.id, { activeBus: bus._id });
    }

    res.status(201).json({
      success: true,
      message: "Bus registered successfully",
      bus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all buses for the authenticated driver
// @route   GET /api/driver/buses/my-buses
exports.getMyBuses = async (req, res) => {
  try {
    const buses = await Bus.find({ assignedDriver: req.user.id });

    res.status(200).json({
      success: true,
      count: buses.length,
      buses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get a single bus by ID
// @route   GET /api/driver/buses/:id
exports.getBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    res.status(200).json({
      success: true,
      bus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const Driver = require("../models/Driver");

// @desc    Set active bus for driver
// @route   PUT /api/driver/buses/:id/select
exports.selectActiveBus = async (req, res) => {
  try {
    const busId = req.params.id;
    const driverId = req.user.id;

    // Verify bus exists and belongs to the driver
    const bus = await Bus.findOne({ _id: busId, assignedDriver: driverId });
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found or you don't have permission to select it",
      });
    }

    // Update driver's activeBus
    const driver = await Driver.findByIdAndUpdate(
      driverId,
      { activeBus: busId },
      { new: true }
    ).populate('activeBus');

    res.status(200).json({
      success: true,
      message: "Active bus selected successfully",
      driver,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Clear active bus (reverts to original signup bus)
// @route   PUT /api/driver/buses/reset-active
exports.resetActiveBus = async (req, res) => {
  try {
    const driverId = req.user.id;

    // Clear driver's activeBus
    const driver = await Driver.findByIdAndUpdate(
      driverId,
      { activeBus: null },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Reverted to original signup bus successfully",
      driver,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
