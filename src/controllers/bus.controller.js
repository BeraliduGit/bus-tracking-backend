import BusLocation from "../models/busLocation.model.js";

export const updateBusLocation = async (req, res) => {
  try {
    const { busId, latitude, longitude, speed } = req.body;

    const bus = await BusLocation.findOneAndUpdate(
      { busId },
      {
        latitude,
        longitude,
        speed,
        timestamp: Date.now()
      },
      { new: true, upsert: true }
    );

    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBusLocation = async (req, res) => {
  try {
    const buses = await BusLocation.find();
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};