const Passenger = require("../models/Passenger");
const { generateToken } = require("../middleware/auth");

// @desc    Passenger Sign Up
// @route   POST /api/passengers/signup
exports.signUp = async (req, res) => {
  try {
    const { name, email, phone, homeAddress, password } = req.body;

    // Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if passenger already exists
    let passenger = await Passenger.findOne({ email });
    if (passenger) {
      return res.status(400).json({
        success: false,
        message: "Passenger with this email already exists",
      });
    }

    // Create passenger
    passenger = await Passenger.create({
      name,
      email,
      phone,
      homeAddress,
      password,
    });

    // Generate token
    const token = generateToken(passenger._id, "passenger");

    res.status(201).json({
      success: true,
      message: "Passenger registered successfully",
      token,
      passenger: {
        id: passenger._id,
        name: passenger.name,
        email: passenger.email,
        phone: passenger.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Passenger Login
// @route   POST /api/passengers/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Get passenger with password
    const passenger = await Passenger.findOne({ email }).select("+password");

    if (!passenger) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isPasswordValid = await passenger.matchPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(passenger._id, "passenger");

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      passenger: {
        id: passenger._id,
        name: passenger.name,
        email: passenger.email,
        phone: passenger.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get Passenger Details
// @route   GET /api/passengers/:id
exports.getDetails = async (req, res) => {
  try {
    const passenger = await Passenger.findById(req.params.id);

    if (!passenger) {
      return res.status(404).json({
        success: false,
        message: "Passenger not found",
      });
    }

    res.status(200).json({
      success: true,
      passenger,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update Passenger Details
// @route   PUT /api/passengers/:id
exports.updateDetails = async (req, res) => {
  try {
    const { name, phone, homeAddress } = req.body;

    let passenger = await Passenger.findById(req.params.id);

    if (!passenger) {
      return res.status(404).json({
        success: false,
        message: "Passenger not found",
      });
    }

    // Update fields
    if (name) passenger.name = name;
    if (phone) passenger.phone = phone;
    if (homeAddress) passenger.homeAddress = homeAddress;

    passenger = await passenger.save();

    res.status(200).json({
      success: true,
      message: "Passenger details updated successfully",
      passenger,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get Passenger Profile
// @route   GET /api/passengers/:id/profile
exports.getProfile = async (req, res) => {
  try {
    const passenger = await Passenger.findById(req.params.id);

    if (!passenger) {
      return res.status(404).json({
        success: false,
        message: "Passenger not found",
      });
    }

    res.status(200).json({
      success: true,
      passenger: {
        id: passenger._id,
        name: passenger.name,
        email: passenger.email,
        phone: passenger.phone,
        homeAddress: passenger.homeAddress,
        isActive: passenger.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
