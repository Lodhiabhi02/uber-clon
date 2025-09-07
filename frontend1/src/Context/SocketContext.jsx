import React, { createContext, useContext, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import { UserDataContext } from "../Context/UserContext";
import { CaptainDataContext } from "../Context/CaptainContext";

export const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, type = "user" }) =>
{
  // Create socket once
  const socket = useMemo(() => io(import.meta.env.VITE_BASE_URL), []);

  // Get logged-in user/captain
  const { user } = useContext(UserDataContext) || {};
  const { captain } = useContext(CaptainDataContext) || {};

  // Handle connection / disconnection logging
  useEffect(() =>
  {
    if (!socket) return;

    const handleConnect = () =>
    {
      console.log("✅ Socket connected:", socket.id);
    };

    const handleDisconnect = (reason) =>
    {
      console.log("❌ Socket disconnected:", socket.id, "Reason:", reason);
    };

    const handleConnectError = (err) =>
    {
      console.error("❌ Socket connection error:", err.message);
    };

    const handleError = (err) =>
    {
      console.error("❌ Socket error:", err);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("error", handleError);

    return () =>
    {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("error", handleError);
    };
  }, [socket]);

  // Emit join event when socket connects and user/captain is available
  useEffect(() =>
  {
    if (!socket) return;

    const userId = type === "captain" ? captain?._id : user?._id;
    if (!userId) return;

    const emitJoin = () =>
    {
      socket.emit("join", { userId, userType: type });
      console.log(`📡 Emitted join for ${type}: ${userId}`);
    };

    if (socket.connected) {
      emitJoin();
    } else {
      socket.once("connect", emitJoin);
    }
  }, [socket, user?._id, captain?._id, type]);

  // Send message safely with better error handling
  const sendMessage = (eventName, message) =>
  {
    if (!socket) {
      console.error("⚠️ Socket not available");
      return;
    }

    if (socket.connected) {
      socket.emit(eventName, message);
      console.log("📡 Message sent:", eventName, message);
    } else {
      console.warn("⚠️ Socket not connected yet, will send on connect");
      socket.once("connect", () =>
      {
        socket.emit(eventName, message);
        console.log("📡 Message sent after connection:", eventName, message);
      });
    }
  };

  // Receive message with automatic cleanup
  const receiveMessage = (eventName, callback) =>
  {
    if (!socket) {
      console.error("⚠️ Socket not available for receiving messages");
      return () => { };
    }

    socket.on(eventName, callback);
    return () => socket.off(eventName, callback);
  };

  return (
    <SocketContext.Provider value={{ socket, sendMessage, receiveMessage }}>
      {children}
    </SocketContext.Provider>
  );
};