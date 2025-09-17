const { validationResult } = require("express-validator");
const rideModel = require("../models/ride.model");
const mapService = require("../services/map.service");
const rideService = require("../services/ride.service");
const captainModel = require("../models/captain.model");
const { sendMessageToSocketId, getSocketById } = require("../socket");

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
      console.log("📍 Pickup coordinates:", pickupCoordinates);

      const captainsInRadius = await mapService.getCaptainsInTheRadius(
        pickupCoordinates.lat, 
        pickupCoordinates.lng, 
        10000
      );
      console.log("🧭 Captains in radius:", captainsInRadius.length);

      // Get ride with populated user data
      const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate("user");

      if (!rideWithUser) {
        console.error("❌ Could not find created ride with user data");
        return;
      }

      console.log("📦 Ride with user data:", {
        rideId: rideWithUser._id,
        userId: rideWithUser.user._id,
        pickup: rideWithUser.pickup,
        destination: rideWithUser.destination
      });

      // Track successful and failed notifications
      let successfulNotifications = 0;
      let failedNotifications = 0;
      const failedCaptains = [];

      // Send notifications to captains
      for (const captain of captainsInRadius) {
        try {
          console.log(`📡 Attempting to notify captain ${captain._id} on socket ${captain.socketId}`);
          
          // Check if captain has a valid socket ID
          if (!captain.socketId) {
            console.warn(`⚠️ Captain ${captain._id} has no socketId`);
            failedNotifications++;
            failedCaptains.push({ 
              captainId: captain._id, 
              reason: 'No socket ID' 
            });
            continue;
          }

          // Verify socket exists and is connected
          const targetSocket = getSocketById(captain.socketId);
          if (!targetSocket || !targetSocket.connected) {
            console.warn(`⚠️ Captain ${captain._id} socket ${captain.socketId} is not connected`);
            
            // Try to clean up stale socket reference
            try {
              await captainModel.findByIdAndUpdate(captain._id, {
                $unset: { socketId: 1 }
              });
              console.log(`🧹 Cleaned up stale socket reference for captain ${captain._id}`);
            } catch (cleanupErr) {
              console.error(`❌ Error cleaning up socket reference:`, cleanupErr);
            }
            
            failedNotifications++;
            failedCaptains.push({ 
              captainId: captain._id, 
              reason: 'Socket not connected',
              socketId: captain.socketId 
            });
            continue;
          }

          // Send the ride notification
          const messageSuccess = sendMessageToSocketId(captain.socketId, {
            event: "new-ride",
            data: {
              ride: rideWithUser,
              message: "New ride request available",
              timestamp: new Date().toISOString()
            }
          });

          if (messageSuccess) {
            successfulNotifications++;
            console.log(`✅ Successfully notified captain ${captain._id}`);
          } else {
            failedNotifications++;
            failedCaptains.push({ 
              captainId: captain._id, 
              reason: 'Message send failed',
              socketId: captain.socketId 
            });
            console.warn(`❌ Failed to notify captain ${captain._id}`);
          }

        } catch (notificationErr) {
          console.error(`❌ Error notifying captain ${captain._id}:`, notificationErr);
          failedNotifications++;
          failedCaptains.push({ 
            captainId: captain._id, 
            reason: notificationErr.message,
            socketId: captain.socketId 
          });
        }
      }

      // Log notification results
      console.log(`📊 Notification Results:`, {
        totalCaptains: captainsInRadius.length,
        successful: successfulNotifications,
        failed: failedNotifications,
        rideId: ride._id
      });

      if (failedNotifications > 0) {
        console.warn(`⚠️ Failed notifications details:`, failedCaptains);
      }

      // Optionally, save notification results to the ride document
      try {
        await rideModel.findByIdAndUpdate(ride._id, {
          $set: {
            notificationStats: {
              totalCaptains: captainsInRadius.length,
              successful: successfulNotifications,
              failed: failedNotifications,
              timestamp: new Date()
            }
          }
        });
      } catch (updateErr) {
        console.error("❌ Error updating ride with notification stats:", updateErr);
      }

    } catch (mapErr) {
      console.error("❌ Map service error:", mapErr.message);
    }
  } catch (error) {
    console.error("❌ Error in createRide:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Optional: Add endpoint to check captain connection status
module.exports.checkCaptainStatus = async (req, res) => {
  try {
    const captains = await captainModel.find({}, 'socketId _id email');
    
    const captainStatus = captains.map(captain => {
      const socket = captain.socketId ? getSocketById(captain.socketId) : null;
      return {
        captainId: captain._id,
        email: captain.email,
        socketId: captain.socketId,
        isConnected: socket ? socket.connected : false
      };
    });

    res.json({
      totalCaptains: captains.length,
      connectedCaptains: captainStatus.filter(c => c.isConnected).length,
      captains: captainStatus
    });
  } catch (error) {
    console.error("❌ Error checking captain status:", error);
    res.status(500).json({ error: error.message });
  }
};