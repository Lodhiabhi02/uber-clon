const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: [
        "http://localhost:5173", // local frontend
        "https://9|7|cbmz-5173.devtunnels.ms", // your dev tunnel URL
        /.*\.devtunnels\.ms$/ // any devtunnels.ms domain
      ],
      methods: ["GET", "POST"],
      credentials: true
    },
    allowEIO3: true // for compatibility
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.onAny((event, ...args) => {
      console.log(`📡 Event received: ${event}`, args);
    });

    // Handle join event
    socket.on('join', async (message) => {
      try {
        const { userId, userType } = message;
        console.log(`User ID: ${userId}, User Type: ${userType}`);

        if (!userId || !userType) {
          console.warn("⚠️ Invalid join data:", message);
          return socket.emit("error", { message: "Invalid join data" });
        }

        if (userType === 'user') {
          await userModel.findByIdAndUpdate(userId, {
            socketId: socket.id,
          });
        } else if (userType === 'captain') {
          await captainModel.findByIdAndUpdate(userId, {
            socketId: socket.id,
          });
        } else {
          console.warn("⚠️ Unknown user type:", userType);
          return socket.emit("error", { message: "Invalid user type" });
        }

        console.log(`${userType} with ID ${userId} joined. Socket: ${socket.id}`);
        
        // Send confirmation back to client
        socket.emit("join-success", { 
          message: `Successfully joined as ${userType}`,
          socketId: socket.id 
        });

      } catch (err) {
        console.error('Error in join event:', err.message);
        socket.emit("error", { message: "Failed to join" });
      }
    });

    // Handle captain location updates
    socket.on("update-location-captain", async (data) => {
      try {
        const { userId, location } = data;

        console.log("📩 Received location update:", data);

        // Validate data
        if (!userId) {
          console.warn("⚠️ No userId provided in location update");
          return socket.emit("error", { message: "User ID is required" });
        }

        if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
          console.warn("⚠️ Invalid location data received:", location);
          return socket.emit("error", { message: "Invalid location data format" });
        }

        console.log(`✅ Updating captain ${userId} location to`, location);

        // Update captain location in database
        const updatedCaptain = await captainModel.findByIdAndUpdate(
          userId,
          {
            location: {
              lat: location.lat,
              lng: location.lng,
            },
          },
          { new: true } // Return updated document
        );

        if (!updatedCaptain) {
          console.warn(`⚠️ Captain with ID ${userId} not found`);
          return socket.emit("error", { message: "Captain not found" });
        }

        console.log("💾 Location updated in DB successfully!");
        
        // Send confirmation back to client
        socket.emit("location-updated", {
          message: "Location updated successfully",
          location: updatedCaptain.location
        });

      } catch (err) {
        console.error("❌ Error updating location:", err);
        socket.emit("error", { message: "Server error while updating location" });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });

    // Handle generic errors
    socket.on('error', (err) => {
      console.error(`Socket error from ${socket.id}:`, err);
    });
  });
}

// Send message to a specific socket
function sendMessageToSocketId(socketId, messageObject) {
  console.log("📤 Sending message to socket:", socketId, messageObject);
  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
    // console.log(`📤 Message sent to ${socketId}:`, socketId );
  } else {
    console.error('Socket.io not initialized.');
  }
}

// Send message to all captains
function sendMessageToAllCaptains(eventName, message) {
  if (io) {
    io.emit(eventName,data);
    console.log(`📤 Broadcast message to all clients:`, eventName, message);
  } else {
    console.error('Socket.io not initialized.');
  }
}

module.exports = {
  initializeSocket,
  sendMessageToSocketId,
  sendMessageToAllCaptains,
};