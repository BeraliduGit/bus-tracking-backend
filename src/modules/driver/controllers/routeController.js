const Route = require("../models/Route");

// @desc    Get all routes
// @route   GET /api/routes
exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find({ isActive: true }).populate(
      "assignedDriver",
      "name email phone currentLocation"
    );

    res.status(200).json({
      success: true,
      count: routes.length,
      routes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single route
// @route   GET /api/routes/:id
exports.getRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id).populate(
      "assignedDriver",
      "name email phone currentLocation"
    );

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    res.status(200).json({
      success: true,
      route,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create route
// @route   POST /api/routes
exports.createRoute = async (req, res) => {
  try {
    const route = await Route.create(req.body);

    res.status(201).json({
      success: true,
      message: "Route created successfully",
      route,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update route
// @route   PUT /api/routes/:id
exports.updateRoute = async (req, res) => {
  try {
    let route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    route = await Route.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Route updated successfully",
      route,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get routes by driver
// @route   GET /api/routes/driver/:driverId
exports.getRoutesByDriver = async (req, res) => {
  try {
    const routes = await Route.find({
      assignedDriver: req.params.driverId,
      isActive: true,
    });

    res.status(200).json({
      success: true,
      count: routes.length,
      routes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get route schedule
// @route   GET /api/routes/:id/schedule
exports.getRouteSchedule = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    res.status(200).json({
      success: true,
      schedule: route.schedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get route stops
// @route   GET /api/routes/:id/stops
exports.getRouteStops = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    res.status(200).json({
      success: true,
      stops: route.stops,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
