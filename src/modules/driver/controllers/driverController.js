const Driver = require("../models/Driver");
const { generateToken } = require("../middleware/auth");

// @desc    Driver Sign Up
// @route   POST /api/drivers/signup
exports.signUp = async (req, res) => {
  try {
    const { name, email, phone, nic, drivingLicenseId, password } = req.body;

    // Validation
    if (!name || !email || !phone || !nic || !drivingLicenseId || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if driver already exists
    let driver = await Driver.findOne({ email });
    if (driver) {
      return res.status(400).json({
        success: false,
        message: "Driver with this email already exists",
      });
    }

    // Create driver
    driver = await Driver.create({
      name,
      email,
      phone,
      nic,
      drivingLicenseId,
      password,
    });

    // Generate token
    const token = generateToken(driver._id, "driver");

    res.status(201).json({
      success: true,
      message: "Driver registered successfully",
      token,
      driver: {
        id: driver._id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Driver Login
// @route   POST /api/drivers/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Get driver with password
    const driver = await Driver.findOne({ email }).select("+password");

    if (!driver) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isPasswordValid = await driver.matchPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(driver._id, "driver");

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      driver: {
        id: driver._id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get Driver Details
// @route   GET /api/drivers/:id
exports.getDetails = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    res.status(200).json({
      success: true,
      driver,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update Driver Details
// @route   PUT /api/drivers/:id
exports.updateDetails = async (req, res) => {
  try {
    const { name, phone, busNumber, busRouteName, busRouteNumber } = req.body;

    let driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    // Update fields
    if (name) driver.name = name;
    if (phone) driver.phone = phone;
    if (busNumber) driver.busNumber = busNumber;
    if (busRouteName) driver.busRouteName = busRouteName;
    if (busRouteNumber) driver.busRouteNumber = busRouteNumber;

    driver = await driver.save();

    res.status(200).json({
      success: true,
      message: "Driver details updated successfully",
      driver,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update Driver Location
// @route   PUT /api/drivers/:id/location
exports.updateLocation = async (req, res) => {
  try {
    const { longitude, latitude, status } = req.body;

    if (longitude === undefined || latitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide latitude and longitude",
      });
    }

    let driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    driver.currentLocation = {
      type: "Point",
      coordinates: [longitude, latitude],
    };

    if (status) {
      driver.status = status;
    }

    driver = await driver.save();

    res.status(200).json({
      success: true,
      message: "Location updated successfully",
      driver: {
        id: driver._id,
        currentLocation: driver.currentLocation,
        status: driver.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get Driver Profile
// @route   GET /api/drivers/:id/profile
exports.getProfile = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    res.status(200).json({
      success: true,
      driver: {
        id: driver._id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        nic: driver.nic,
        drivingLicenseId: driver.drivingLicenseId,
        busNumber: driver.busNumber,
        busRouteName: driver.busRouteName,
        busRouteNumber: driver.busRouteNumber,
        status: driver.status,
        isActive: driver.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
