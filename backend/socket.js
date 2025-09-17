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
    allowEIO3: true, // for compatibility
    // Add these configurations for better connection management
    pingTimeout: 60000,
    pingInterval: 25000,
    upgradeTimeout: 30000,
    maxHttpBufferSize: 1e6
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

        let updateResult;
        if (userType === 'user') {
          updateResult = await userModel.findByIdAndUpdate(userId, {
            socketId: socket.id,
          }, { new: true });
        } else if (userType === 'captain') {
          updateResult = await captainModel.findByIdAndUpdate(userId, {
            socketId: socket.id,
          }, { new: true });
        } else {
          console.warn("⚠️ Unknown user type:", userType);
          return socket.emit("error", { message: "Invalid user type" });
        }

        if (!updateResult) {
          console.warn(`⚠️ ${userType} with ID ${userId} not found in database`);
          return socket.emit("error", { message: `${userType} not found` });
        }

        console.log(`✅ ${userType} with ID ${userId} joined successfully. Socket: ${socket.id}`);
        
        // Send confirmation back to client
        socket.emit("join-success", { 
          message: `Successfully joined as ${userType}`,
          socketId: socket.id,
          userId: userId,
          userType: userType
        });

      } catch (err) {
        console.error('❌ Error in join event:', err.message);
        socket.emit("error", { message: "Failed to join", details: err.message });
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
            // Also update socketId to ensure it's current
            socketId: socket.id,
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
          location: updatedCaptain.location,
          socketId: socket.id
        });

      } catch (err) {
        console.error("❌ Error updating location:", err);
        socket.emit("error", { message: "Server error while updating location", details: err.message });
      }
    });

    // Handle disconnect - Clean up socket references
    socket.on('disconnect', async (reason) => {
      console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
      
      try {
        // Clean up socketId from both user and captain collections
        await Promise.all([
          userModel.updateMany({ socketId: socket.id }, { $unset: { socketId: 1 } }),
          captainModel.updateMany({ socketId: socket.id }, { $unset: { socketId: 1 } })
        ]);
        console.log(`✅ Cleaned up socket references for ${socket.id}`);
      } catch (err) {
        console.error(`❌ Error cleaning up socket references for ${socket.id}:`, err);
      }
    });

    // Handle generic errors
    socket.on('error', (err) => {
      console.error(`Socket error from ${socket.id}:`, err);
    });

    // Add heartbeat mechanism
    socket.on('ping', () => {
      socket.emit('pong');
    });
  });

  // Add connection error handling
  io.on('connect_error', (err) => {
    console.error('Socket.io connection error:', err);
  });
}

// Send message to a specific socket
function sendMessageToSocketId(socketId, messageObject) {
  console.log("📤 Sending message to socket:", socketId, messageObject);
  
  if (!io) {
    console.error('❌ Socket.io not initialized.');
    return false;
  }

  if (!socketId) {
    console.error('❌ No socketId provided');
    return false;
  }

  if (!messageObject || !messageObject.event) {
    console.error('❌ Invalid message object:', messageObject);
    return false;
  }

  try {
    // Check if socket exists and is connected
    const targetSocket = io.sockets.sockets.get(socketId);
    if (!targetSocket) {
      console.warn(`⚠️ Socket ${socketId} not found or disconnected`);
      return false;
    }

    if (!targetSocket.connected) {
      console.warn(`⚠️ Socket ${socketId} is not connected`);
      return false;
    }

    // Send the message
    io.to(socketId).emit(messageObject.event, messageObject.data);
    console.log(`✅ Message sent to ${socketId}:`, messageObject.event);
    return true;
    
  } catch (err) {
    console.error(`❌ Error sending message to ${socketId}:`, err);
    return false;
  }
}

// Send message to all captains
function sendMessageToAllCaptains(eventName, message) {
  if (!io) {
    console.error('❌ Socket.io not initialized.');
    return false;
  }

  if (!eventName) {
    console.error('❌ No event name provided');
    return false;
  }

  try {
    // Fixed: use 'message' instead of undefined 'data'
    io.emit(eventName, message);
    console.log(`📤 Broadcast message to all clients:`, eventName, message);
    return true;
  } catch (err) {
    console.error('❌ Error broadcasting message:', err);
    return false;
  }
}

// Get all connected sockets count
function getConnectedSocketsCount() {
  if (!io) {
    return 0;
  }
  return io.sockets.sockets.size;
}

// Get socket by ID
function getSocketById(socketId) {
  if (!io) {
    return null;
  }
  return io.sockets.sockets.get(socketId);
}

module.exports = {
  initializeSocket,
  sendMessageToSocketId,
  sendMessageToAllCaptains,
  getConnectedSocketsCount,
  getSocketById,
};