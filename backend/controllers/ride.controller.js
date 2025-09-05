const rideModel = require('../models/ride.model');
const mapService = require('../services/map.service');

async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error('Pickup and destination are required');
  }
  const distanceTime = await mapService.getDistanceTime(pickup, destination);

   if (!distanceTime || typeof distanceTime.distance !== 'number' || typeof distanceTime.time !== 'number') {
    throw new Error('Failed to get distance and time from map service');
  }

  const baseFare = { auto: 30, car: 50, motorcycle: 20 };
  const perKmRate = { auto: 8, car: 10, motorcycle: 5 };
  const perMinuteRate = { auto: 0.25, car: 0.5, motorcycle: 0.1 };

  return {
    auto:
      baseFare.auto +
      distanceTime.distance * perKmRate.auto +
      distanceTime.time * perMinuteRate.auto,
    car:
      baseFare.car +
      distanceTime.distance * perKmRate.car +
      distanceTime.time * perMinuteRate.car,
    motorcycle:
      baseFare.motorcycle +
      distanceTime.distance * perKmRate.motorcycle +
      distanceTime.time * perMinuteRate.motorcycle,
  };
}

module.exports.createRide = async (req, res) => {
  try {
    const { pickup, destination, vehicleType } = req.body;
    const userId = req.user?._id;

    if (!userId || !pickup || !destination || !vehicleType) {
      return res
        .status(400)
        .json({ error: 'User, pickup, destination, and vehicleType are required' });
    }

    const fare = await getFare(pickup, destination);

    const ride = await rideModel.create({
      user: userId,
      pickup,
      destination,
      vehicleType,
      fare: fare[vehicleType],
    });

    return res.status(201).json({
      message: 'Ride created successfully',
      ride,
    });
  } catch (error) {
    console.error('❌ Error in createRide:', error);
    return res.status(500).json({ error: error.message });
  }
};
