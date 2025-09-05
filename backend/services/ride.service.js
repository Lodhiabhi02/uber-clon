const rideModel = require('../models/ride.model');
const mapService = require('./map.service');
const crypto = require('crypto');
const  bcrypt = require('bcrypt');

// 🔹 Calculate fare based on distance & time
async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error('Pickup and destination are required');
  }

  // Get distance and time from map service
  const distanceTime = await mapService.getDistanceTime(pickup, destination);

  // Define base fare and rates
  const baseFare = { auto: 30, car: 50, motorcycle: 20 };
  const perKmRate = { auto: 8, car: 10, motorcycle: 5 };
  const perMinuteRate = { auto: 0.25, car: 0.5, motorcycle: 0.1 };

  // Calculate fares for each vehicle type
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


// generrate otp

function getOtp(length = 6) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return crypto.randomInt(min, max + 1); // returns number
}

// 🔹 Create Ride Controller
module.exports.createRide = async (req, res) => {
  const { pickup, destination, vehicleType } = req.body; // req.body must exist
  const userId = req.user?.id;

  // validate
  if (!userId || !pickup || !destination || !vehicleType) {
    return res.status(400).json({ error: 'All fields required' });
  }

const ride = await rideModel.create({
  user: userId,
  pickup,
  destination,
  vehicleType,
  fare: fare[vehicleType],
  otp: getOtp(6),   // ✅ always provide OTP
  status: 'pending'
});

  return res.status(201).json({ message: 'Ride created', ride });
};

