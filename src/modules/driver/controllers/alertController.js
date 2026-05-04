const Alert = require("../models/Alert");

// @desc    Get all alerts for a passenger
// @route   GET /api/alerts/passenger/:passengerId
exports.getPassengerAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ passengerId: req.params.passengerId })
      .populate("routeId", "routeName routeNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get active alerts
// @route   GET /api/alerts/active
exports.getActiveAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ isActive: true })
      .populate("passengerId", "email phone")
      .populate("routeId", "routeName routeNumber")
      .sort({ nextTrigger: 1 });

    res.status(200).json({
      success: true,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get alert by ID
// @route   GET /api/alerts/:id
exports.getAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id)
      .populate("passengerId")
      .populate("routeId")
      .populate("scheduleId");

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    res.status(200).json({
      success: true,
      alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create alert
// @route   POST /api/alerts
exports.createAlert = async (req, res) => {
  try {
    const {
      passengerId,
      routeId,
      scheduleId,
      alertType,
      alertTime,
      triggerBefore,
      notificationMethods,
      recurrence,
      daysOfWeek,
      expiryDate,
      description,
    } = req.body;

    // Validate required fields
    if (!passengerId || !routeId || !alertType) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: passengerId, routeId, alertType",
      });
    }

    // Calculate next trigger time
    const [hours, minutes] = alertTime.split(":").map(Number);
    const nextTrigger = new Date();
    nextTrigger.setHours(hours, minutes, 0, 0);
    if (nextTrigger < new Date()) {
      nextTrigger.setDate(nextTrigger.getDate() + 1);
    }

    const alert = await Alert.create({
      passengerId,
      routeId,
      scheduleId,
      alertType,
      alertTime,
      triggerBefore: triggerBefore || 15,
      notificationMethods: notificationMethods || ["in-app"],
      recurrence: recurrence || "once",
      daysOfWeek,
      expiryDate,
      description,
      nextTrigger,
    });

    const populatedAlert = await Alert.findById(alert._id)
      .populate("routeId")
      .populate("passengerId");

    res.status(201).json({
      success: true,
      message: "Alert created successfully",
      alert: populatedAlert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update alert
// @route   PUT /api/alerts/:id
exports.updateAlert = async (req, res) => {
  try {
    let alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    // Recalculate nextTrigger if alertTime changed
    if (req.body.alertTime && req.body.alertTime !== alert.alertTime) {
      const [hours, minutes] = req.body.alertTime.split(":").map(Number);
      const nextTrigger = new Date();
      nextTrigger.setHours(hours, minutes, 0, 0);
      if (nextTrigger < new Date()) {
        nextTrigger.setDate(nextTrigger.getDate() + 1);
      }
      req.body.nextTrigger = nextTrigger;
    }

    alert = await Alert.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("routeId")
      .populate("passengerId");

    res.status(200).json({
      success: true,
      message: "Alert updated successfully",
      alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle alert active status
// @route   PATCH /api/alerts/:id/toggle
exports.toggleAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    alert.isActive = !alert.isActive;
    await alert.save();

    res.status(200).json({
      success: true,
      message: `Alert ${alert.isActive ? "enabled" : "disabled"} successfully`,
      alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Mark alert as triggered
// @route   PATCH /api/alerts/:id/trigger
exports.triggerAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      {
        isTriggered: true,
        lastTriggered: new Date(),
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Alert triggered successfully",
      alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete alert
// @route   DELETE /api/alerts/:id
exports.deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Alert deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get alerts for a route
// @route   GET /api/alerts/route/:routeId
exports.getRouteAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({
      routeId: req.params.routeId,
      isActive: true,
    })
      .populate("passengerId", "name email phone")
      .sort({ nextTrigger: 1 });

    res.status(200).json({
      success: true,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Bulk update alerts for a route (e.g., set delay status)
// @route   PATCH /api/alerts/route/:routeId/bulk-update
exports.bulkUpdateRouteAlerts = async (req, res) => {
  try {
    const { delayMinutes, status } = req.body;

    const alerts = await Alert.updateMany(
      {
        routeId: req.params.routeId,
        isActive: true,
        alertType: { $in: ["delay", "route-update"] },
      },
      {
        $set: {
          ...(status && { status }),
          isTriggered: true,
          lastTriggered: new Date(),
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Alerts updated successfully",
      modifiedCount: alerts.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
