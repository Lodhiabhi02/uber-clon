const { validationResult } = require("express-validator");
const rideModel = require("../models/ride.model");
const mapService = require("../services/map.service");
const rideService = require("../services/ride.service");
const {sendMessageToSocketId} = require("../socket");
  
// Controller for GET /get-fare

module.exports.getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination } = req.query;

  try {
    // Example: Call your map service to calculate fare
    const fare = await rideService.getFare(pickup, destination);

    return res.status(200).json({ fare });
  } catch (err) {
    console.error("❌ Error in getFare:", err);
    return res.status(500).json({ error: err.message });
  }
};


// Controller for POST /create
module.exports.createRide = async (req, res) => {
  try {
    const { pickup, destination, vehicleType } = req.body;
    const userId = req.user?._id;

    console.log("📥 Incoming ride request:", { userId, pickup, destination, vehicleType });

    if (!userId || !pickup || !destination || !vehicleType) {
      console.warn("⚠️ Missing required fields:", { userId, pickup, destination, vehicleType });
      return res.status(400).json({
        error: "User, pickup, destination, and vehicleType are required",
      });
    }

    // Fare calculation
    const fare = await rideService.getFare(pickup, destination);
    console.log("💰 Calculated fare:", fare);

    // Save ride
    const ride = await rideModel.create({
      user: userId,
      pickup,
      destination,
      vehicleType,
      fare: fare[vehicleType],
    });

    console.log("✅ Ride created in DB:", ride._id);

    res.status(201).json({
      message: "Ride created successfully",
      ride,
    });

    // After responding → do async background work
    try {
      const pickupCoordinates = await mapService.getAddressCoordinates(pickup);
      // const pickupCoordinates = { lat: 23.189711524536936, lng: 79.90988884528421 };
      console.log("📍 Pickup coordinates:", pickupCoordinates);

      const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.lat, pickupCoordinates.lng, 10000);
      console.log("🧭 Captains in radius:", captainsInRadius);

      ride.otp = ""
    const rideWithUser = await rideModel.findOne({_id:ride._id}).populate("user");

      captainsInRadius.map(captain => {
       console.log(captain,)
        sendMessageToSocketId(captain.socketId,{
          eventName: "new-ride",
          data: rideWithUser
        })

      })
    } catch (mapErr) {
      console.error("❌ Map service error:", mapErr.message);
    }
  } catch (error) {
    console.error("❌ Error in createRide:", error);
    return res.status(500).json({ error: error.message });
  }
};
