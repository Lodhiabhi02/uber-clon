// Improved SocketProvider with better connection management
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { UserDataContext } from "../Context/UserContext";
import { CaptainDataContext } from "../Context/CaptainContext";

export const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

// Global socket instance to prevent multiple connections
let globalSocket = null;
let socketInitialized = false; // Additional flag to prevent re-initialization

export const SocketProvider = ({ children, type = "user" }) =>
{
  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  // Get logged-in user/captain
  const { user } = useContext(UserDataContext) || {};
  const { captain } = useContext(CaptainDataContext) || {};

  // Track initialization to prevent multiple setups
  const initRef = useRef(false);
  const joinSentRef = useRef(false);
  const currentUserIdRef = useRef(null);
  const cleanupRef = useRef(null);

  // Initialize socket only once
  useEffect(() =>
  {
    // Prevent multiple initializations more strictly
    if (socketInitialized && globalSocket?.connected) {
      console.log("🔄 Socket already initialized and connected, skipping...");
      setIsConnected(globalSocket.connected);
      return;
    }

    if (initRef.current) {
      console.log("🔄 Socket initialization already in progress, skipping...");
      return;
    }

    console.log("🚀 Initializing socket connection...");
    initRef.current = true;
    socketInitialized = true;

    // Cleanup existing socket if any
    if (globalSocket) {
      console.log("🧹 Cleaning up existing socket...");
      globalSocket.removeAllListeners();
      globalSocket.disconnect();
      globalSocket = null;
    }

    // Create socket with better configuration
    globalSocket = io(import.meta.env.VITE_BASE_URL, {
      timeout: 20000,
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      pingTimeout: 60000,
      pingInterval: 25000,
      forceNew: true, // Force new connection to prevent conflicts
      upgrade: true
    });

    // Connection event handlers
    const handleConnect = () =>
    {
      console.log("✅ Socket connected:", globalSocket.id);
      setIsConnected(true);
      setConnectionAttempts(0);
      joinSentRef.current = false; // Reset join flag for new connection
    };

    const handleDisconnect = (reason) =>
    {
      console.log("❌ Socket disconnected:", {
        socketId: globalSocket?.id,
        reason,
        connected: globalSocket?.connected,
      });

      setIsConnected(false);
      joinSentRef.current = false;

      // Handle different disconnect reasons
      if (reason === "io server disconnect") {
        console.warn("⚠️ Server initiated disconnect");
      } else if (reason === "io client disconnect") {
        console.warn("⚠️ Client initiated disconnect");
      } else if (reason === "ping timeout") {
        console.warn("⚠️ Ping timeout - connection lost");
      } else if (reason === "transport close") {
        console.warn("⚠️ Transport closed");
      }
    };

    const handleConnectError = (err) =>
    {
      console.error("❌ Socket connection error:", {
        message: err.message,
        description: err.description,
        context: err.context,
        attempt: connectionAttempts + 1
      });
      setIsConnected(false);
      setConnectionAttempts(prev => prev + 1);
    };

    const handleError = (err) =>
    {
      console.error("❌ Socket error:", err);

      // Log error details
      if (err?.type) console.error("   🔎 Error type:", err.type);
      if (err?.message) console.error("   🔎 Error message:", err.message);
      if (err?.description) console.error("   🔎 Error description:", err.description);
    };

    // Attach event listeners
    globalSocket.on("connect", handleConnect);
    globalSocket.on("disconnect", handleDisconnect);
    globalSocket.on("connect_error", handleConnectError);
    globalSocket.on("error", handleError);

    // Store cleanup function
    cleanupRef.current = () =>
    {
      if (globalSocket) {
        console.log("🧹 Cleaning up socket listeners...");
        globalSocket.off("connect", handleConnect);
        globalSocket.off("disconnect", handleDisconnect);
        globalSocket.off("connect_error", handleConnectError);
        globalSocket.off("error", handleError);
      }
    };

    // Cleanup function for useEffect
    return () =>
    {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []); // Keep empty dependency array but use better internal logic

  // Component unmount cleanup
  useEffect(() =>
  {
    return () =>
    {
      console.log("🧹 SocketProvider unmounting...");
      if (globalSocket && !globalSocket.connected) {
        globalSocket.disconnect();
        globalSocket = null;
        socketInitialized = false;
        initRef.current = false;
      }
    };
  }, []);

  // Handle join logic separately with better validation
  useEffect(() =>
  {
    if (!globalSocket || !isConnected) {
      console.log("⏳ Waiting for socket connection before join...");
      return;
    }

    const userId = type === "captain" ? captain?._id : user?._id;
    if (!userId) {
      console.log("⏳ Waiting for user/captain data...");
      return;
    }

    // Check if we need to send join for a different user
    const shouldSendJoin = !joinSentRef.current || currentUserIdRef.current !== userId;

    if (shouldSendJoin) {
      const joinData = { userId, userType: type };

      console.log(`📡 Sending join for ${type}: ${userId} on socket ${globalSocket.id}`);

      // Add join success/error handlers
      const handleJoinSuccess = (data) =>
      {
        console.log("✅ Join successful:", data);
        globalSocket.off("join-success", handleJoinSuccess);
        globalSocket.off("error", handleJoinError);
      };

      const handleJoinError = (error) =>
      {
        console.error("❌ Join failed:", error);
        joinSentRef.current = false; // Reset to retry
        globalSocket.off("join-success", handleJoinSuccess);
        globalSocket.off("error", handleJoinError);
      };

      globalSocket.once("join-success", handleJoinSuccess);
      globalSocket.once("error", handleJoinError);

      globalSocket.emit("join", joinData);
      joinSentRef.current = true;
      currentUserIdRef.current = userId;
    }
  }, [isConnected, user?._id, captain?._id, type]);

  // Rest of your methods remain the same...
  const sendMessage = (eventName, message) =>
  {
    if (!globalSocket) {
      console.error("⚠️ Socket not available");
      return Promise.reject(new Error("Socket not available"));
    }

    if (!eventName || typeof eventName !== 'string') {
      console.error("❌ Invalid event name:", eventName);
      return Promise.reject(new Error("Invalid event name"));
    }

    try {
      const serialized = JSON.stringify(message);
      if (serialized === undefined) {
        throw new Error("Message cannot be serialized");
      }
    } catch (err) {
      console.error("❌ Message serialization error:", err);
      return Promise.reject(err);
    }

    return new Promise((resolve, reject) =>
    {
      if (globalSocket.connected) {
        try {
          globalSocket.emit(eventName, message);
          console.log("📡 Message sent:", eventName, message);
          resolve();
        } catch (err) {
          console.error("❌ Error sending message:", err);
          reject(err);
        }
      } else {
        console.warn("⚠️ Socket not connected, queuing message...");

        const timeout = setTimeout(() =>
        {
          reject(new Error("Connection timeout"));
        }, 5000);

        globalSocket.once("connect", () =>
        {
          clearTimeout(timeout);
          try {
            globalSocket.emit(eventName, message);
            console.log("📡 Queued message sent:", eventName, message);
            resolve();
          } catch (err) {
            console.error("❌ Error sending queued message:", err);
            reject(err);
          }
        });
      }
    });
  };

  const receiveMessage = (eventName, callback) =>
  {
    if (!globalSocket) {
      console.error("⚠️ Socket not available for receiving messages");
      return () => { };
    }

    if (!eventName || typeof eventName !== 'string') {
      console.error("❌ Invalid event name:", eventName);
      return () => { };
    }

    if (!callback || typeof callback !== 'function') {
      console.error("❌ Invalid callback:", callback);
      return () => { };
    }

    const wrappedCallback = (...args) =>
    {
      try {
        callback(...args);
      } catch (err) {
        console.error(`❌ Error in ${eventName} callback:`, err);
      }
    };

    globalSocket.on(eventName, wrappedCallback);
    console.log(`👂 Listening for event: ${eventName}`);

    return () =>
    {
      globalSocket.off(eventName, wrappedCallback);
      console.log(`🔇 Stopped listening for event: ${eventName}`);
    };
  };

  const getConnectionStatus = () =>
  {
    return {
      connected: globalSocket?.connected || false,
      id: globalSocket?.id || null,
      isConnected,
      connectionAttempts
    };
  };

  return (
    <SocketContext.Provider value={{
      socket: globalSocket,
      sendMessage,
      receiveMessage,
      getConnectionStatus,
      isConnected
    }}>
      {children}
    </SocketContext.Provider>
  );
};