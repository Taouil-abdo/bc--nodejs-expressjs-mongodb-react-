import * as tripService from "../services/tripService.js";

export const getAssignedTrips = async (req, res) => {
  try {
    const trips = await tripService.getTripsAssignedByDriverId(req.user.id);
    res.status(200).json(trips);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTripStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const trip = await tripService.updateTripStatus(
      req.params.id,
      req.user.id,
      status
    );

    res.status(200).json({
      message: "Trip status updated successfully",
      trip,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTripData = async (req, res) => {
  try {
    const trip = await tripService.updateTripData(
      req.params.id,
      req.user.id,
      req.body
    );

    res.status(200).json({
      message: "Trip data updated successfully",
      trip,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


