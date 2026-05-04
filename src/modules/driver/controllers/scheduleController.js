const Schedule = require("../models/Schedule");
const Route = require("../models/Route");
const Bus = require("../models/Bus");

// @desc    Get all schedules
// @route   GET /api/schedules
exports.getAllSchedules = async (req, res) => {
  try {
    const { routeId, date, dayOfWeek, status } = req.query;
    
    let filter = {};
    if (routeId) filter.routeId = routeId;
    if (date) filter.date = new Date(date);
    if (dayOfWeek) filter.dayOfWeek = dayOfWeek;
    if (status) filter.status = status;

    const schedules = await Schedule.find(filter)
      .populate("routeId", "routeName routeNumber startPoint endPoint")
      .populate("busId", "busNumber registrationNumber")
      .sort({ date: 1, departureTime: 1 });

    res.status(200).json({
      success: true,
      count: schedules.length,
      schedules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get schedule by ID
// @route   GET /api/schedules/:id
exports.getSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate("routeId")
      .populate("busId")
      .populate("driverId", "name email phone");

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }

    res.status(200).json({
      success: true,
      schedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get schedules for a route
// @route   GET /api/schedules/route/:routeId
exports.getSchedulesByRoute = async (req, res) => {
  try {
    const { date, dayOfWeek } = req.query;
    
    let filter = { routeId: req.params.routeId };
    if (date) filter.date = new Date(date);
    if (dayOfWeek) filter.dayOfWeek = dayOfWeek;

    const schedules = await Schedule.find(filter)
      .populate("busId", "busNumber")
      .populate("driverId", "name phone")
      .sort({ departureTime: 1 });

    res.status(200).json({
      success: true,
      count: schedules.length,
      schedules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get daily schedule for a route
// @route   GET /api/schedules/route/:routeId/daily
exports.getDailySchedule = async (req, res) => {
  try {
    const { date } = req.query;
    const scheduleDate = date ? new Date(date) : new Date();

    const schedule = await Schedule.find({
      routeId: req.params.routeId,
      date: {
        $gte: new Date(scheduleDate.setHours(0, 0, 0, 0)),
        $lt: new Date(scheduleDate.setHours(23, 59, 59, 999)),
      },
    })
      .populate("busId", "busNumber capacity")
      .populate("driverId", "name phone")
      .sort({ departureTime: 1 });

    res.status(200).json({
      success: true,
      count: schedule.length,
      schedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get first and last bus of the day
// @route   GET /api/schedules/route/:routeId/first-last
exports.getFirstLastBus = async (req, res) => {
  try {
    const { date } = req.query;
    const scheduleDate = date ? new Date(date) : new Date();

    const schedules = await Schedule.find({
      routeId: req.params.routeId,
      date: {
        $gte: new Date(scheduleDate.setHours(0, 0, 0, 0)),
        $lt: new Date(scheduleDate.setHours(23, 59, 59, 999)),
      },
      status: { $ne: "cancelled" },
    })
      .populate("busId", "busNumber")
      .sort({ departureTime: 1 });

    const firstBus = schedules.length > 0 ? schedules[0] : null;
    const lastBus = schedules.length > 0 ? schedules[schedules.length - 1] : null;

    res.status(200).json({
      success: true,
      firstBus,
      lastBus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get delayed buses
// @route   GET /api/schedules/delayed
exports.getDelayedBuses = async (req, res) => {
  try {
    const delayedSchedules = await Schedule.find({
      status: "delayed",
      date: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
      },
    })
      .populate("routeId", "routeName routeNumber")
      .populate("busId", "busNumber")
      .sort({ date: -1, delayMinutes: -1 });

    res.status(200).json({
      success: true,
      count: delayedSchedules.length,
      schedules: delayedSchedules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create schedule
// @route   POST /api/schedules
exports.createSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.create(req.body);
    const populatedSchedule = await Schedule.findById(schedule._id)
      .populate("routeId")
      .populate("busId");

    res.status(201).json({
      success: true,
      message: "Schedule created successfully",
      schedule: populatedSchedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update schedule
// @route   PUT /api/schedules/:id
exports.updateSchedule = async (req, res) => {
  try {
    let schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }

    schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("routeId")
      .populate("busId");

    res.status(200).json({
      success: true,
      message: "Schedule updated successfully",
      schedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update schedule status
// @route   PATCH /api/schedules/:id/status
exports.updateScheduleStatus = async (req, res) => {
  try {
    const { status, delayMinutes } = req.body;
    
    if (!["scheduled", "in-progress", "completed", "cancelled", "delayed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(delayMinutes !== undefined && { delayMinutes }),
        ...(status === "in-progress" && { actualDepartureTime: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }) }),
        ...(status === "completed" && { actualArrivalTime: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }) }),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Schedule status updated",
      schedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete schedule
// @route   DELETE /api/schedules/:id
exports.deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Schedule deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get schedule by bus ID
// @route   GET /api/schedules/bus/:busId
exports.getSchedulesByBus = async (req, res) => {
  try {
    const { date } = req.query;
    
    let filter = { busId: req.params.busId };
    if (date) {
      const scheduleDate = new Date(date);
      filter.date = {
        $gte: new Date(scheduleDate.setHours(0, 0, 0, 0)),
        $lt: new Date(scheduleDate.setHours(23, 59, 59, 999)),
      };
    }

    const schedules = await Schedule.find(filter)
      .populate("routeId", "routeName routeNumber")
      .populate("driverId", "name phone")
      .sort({ departureTime: 1 });

    res.status(200).json({
      success: true,
      count: schedules.length,
      schedules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
