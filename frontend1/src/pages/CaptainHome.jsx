  import React, { useRef, useState, useEffect, useContext } from 'react'
  import { Link } from 'react-router-dom'
  import CaptainDetails from '../components/CaptainDetails'
  import RidePopUp from '../components/RidePopUp'
  import { useGSAP } from '@gsap/react'
  import gsap from 'gsap'
  import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
  import { CaptainDataContext } from '../Context/CaptainContext'
  import { SocketContext } from "../Context/SocketContext"

  const CaptainHome = () =>
  {
    // Get captain data from context instead of local state
    const { captain, setCaptain } = useContext(CaptainDataContext)
    const { sendMessage, receiveMessage, getConnectionStatus } = useContext(SocketContext)

    // State for panels
    const [ridePopUpPanel, setRidePopUpPanel] = useState(false)
    const [confirmRidePanel, setConfirmRidePanel] = useState(false)

    // State to store the current ride data
    const [currentRideData, setCurrentRideData] = useState(null)

    // Refs for GSAP animations
    const ridePopupPanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)

    // Refs to prevent duplicate effects
    const locationIntervalRef = useRef(null)
    const joinSentRef = useRef(false)
    const rideListenerSetRef = useRef(false)

    // Separate useEffect for joining socket
    useEffect(() =>
    {
      console.log("🏠 CaptainHome mounted, captain:", captain?._id);
      console.log("🔌 Socket connection status:", getConnectionStatus());

      if (captain?._id && !joinSentRef.current) {
        console.log("📡 Joining socket room for captain:", captain._id);

        // Join the socket room - only once
        sendMessage("join", {
          userId: captain._id,
          userType: "captain",
        }).then(() =>
        {
          console.log("✅ Join message sent successfully");
        }).catch((err) =>
        {
          console.error("❌ Error sending join message:", err);
        });

        joinSentRef.current = true;
      }
    }, [captain?._id, sendMessage, getConnectionStatus]);

    // Separate useEffect for setting up ride listener
    useEffect(() =>
    {
      if (!receiveMessage) {
        console.log("⏳ receiveMessage not available yet");
        return;
      }

      if (!rideListenerSetRef.current) {
        console.log("👂 Setting up receiveMessage for new-ride");

        const cleanup = receiveMessage("new-ride", (data) =>
        {
          console.log("🚗 NEW RIDE REQUEST RECEIVED!");
          console.log("📋 Full ride data:", JSON.stringify(data, null, 2));

          // Log specific ride details
          if (data && data.ride) {
            console.log("🔍 Ride Details:");
            console.log("   📍 Ride ID:", data.ride._id);
            console.log("   👤 User:", data.ride.user?.fullname?.firstname, data.ride.user?.fullname?.lastname);
            console.log("   📧 User Email:", data.ride.user?.email);
            console.log("   📞 User Phone:", data.ride.user?.phone);
            console.log("   🏁 Pickup:", data.ride.pickup);
            console.log("   🎯 Destination:", data.ride.destination);
            console.log("   🚙 Vehicle Type:", data.ride.vehicleType);
            console.log("   💰 Fare:", data.ride.fare);
            console.log("   📅 Created:", data.ride.createdAt);
            console.log("   📝 Status:", data.ride.status);
          }

          // Log additional message data
          if (data.message) {
            console.log("💬 Message:", data.message);
          }

          if (data.timestamp) {
            console.log("⏰ Timestamp:", data.timestamp);
          }

          // Store the ride data in state
          setCurrentRideData(data);

          // Show the ride popup
          setRidePopUpPanel(true);

          // You can also show a browser notification if needed
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('New Ride Request!', {
              body: `From: ${data.ride?.pickup} To: ${data.ride?.destination}`,
              icon: '/uber-icon.png' // Add your app icon
            });
          }
        });

        rideListenerSetRef.current = true;
        console.log("✅ Ride listener set up successfully");

        // Return cleanup function
        return () =>
        {
          console.log("🧹 Cleaning up ride listener");
          cleanup();
          rideListenerSetRef.current = false;
        };
      }
    }, [receiveMessage]);

    // Separate useEffect for location updates to prevent conflicts
    useEffect(() =>
    {
      if (!captain?._id) return;

      const updateLocation = () =>
      {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) =>
            {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;

              // Validate coordinates before sending
              if (isNaN(lat) || isNaN(lng)) {
                console.error("❌ Invalid coordinates:", { lat, lng });
                return;
              }

              console.log("📍 Sending location update:", { lat, lng, userId: captain._id });

              sendMessage("update-location-captain", {
                userId: captain._id,
                location: { lat, lng },
              }).catch((err) =>
              {
                console.error("❌ Error sending location update:", err);
              });
            },
            (error) =>
            {
              console.error("❌ Geolocation error:", error);
            },
            {
              // Add geolocation options for better accuracy and timeout
              enableHighAccuracy: false,
              timeout: 10000,
              maximumAge: 30000 // Use cached position if available within 30 seconds
            }
          );
        }
      };

      // Clear any existing interval
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }

      // Update immediately
      updateLocation();

      // Then update every 30 seconds (reduced frequency to prevent overwhelming)
      locationIntervalRef.current = setInterval(updateLocation, 30000);

      return () =>
      {
        if (locationIntervalRef.current) {
          clearInterval(locationIntervalRef.current);
          locationIntervalRef.current = null;
        }
      };
    }, [captain?._id, sendMessage]);

    // Reset refs when captain changes
    useEffect(() =>
    {
      if (!captain?._id) {
        console.log("🔄 Captain changed, resetting refs");
        joinSentRef.current = false;
        rideListenerSetRef.current = false;
        setCurrentRideData(null);
      }
    }, [captain?._id]);

    // Listen for socket connection events for debugging
    useEffect(() =>
    {
      const cleanup1 = receiveMessage("join-success", (data) =>
      {
        console.log("✅ Join successful:", data);
      });

      const cleanup2 = receiveMessage("error", (error) =>
      {
        console.error("❌ Socket error received:", error);
      });

      const cleanup3 = receiveMessage("location-updated", (data) =>
      {
        console.log("📍 Location update confirmed:", data);
      });

      return () =>
      {
        cleanup1();
        cleanup2();
        cleanup3();
      };
    }, [receiveMessage]);

    // Debug function to test ride popup manually
    const testRidePopup = () =>
    {
      const testRideData = {
        ride: {
          _id: "test123",
          pickup: "123 Test Street",
          destination: "456 Demo Avenue",
          vehicleType: "car",
          fare: 150,
          user: {
            fullname: { firstname: "Test", lastname: "User" },
            email: "test@example.com",
            phone: "1234567890"
          }
        },
        message: "Test ride request",
        timestamp: new Date().toISOString()
      };

      console.log("🧪 Testing ride popup with test data");
      setCurrentRideData(testRideData);
      setRidePopUpPanel(true);
    };

    // Force setup ride listener
    const forceSetupListener = () =>
    {
      console.log("🔧 Force setting up ride listener");
      rideListenerSetRef.current = false; // Reset the flag

      if (receiveMessage) {
        const cleanup = receiveMessage("new-ride", (data) =>
        {
          console.log("🚗 FORCED LISTENER - NEW RIDE REQUEST RECEIVED!");
          console.log("📋 Full ride data:", JSON.stringify(data, null, 2));

          setCurrentRideData(data);
          setRidePopUpPanel(true);
        });

        rideListenerSetRef.current = true;
        console.log("✅ Forced ride listener set up successfully");
      } else {
        console.error("❌ receiveMessage not available");
      }
    };

    // Check socket events manually
    const checkSocketEvents = () =>
    {
      console.log("🔍 Checking socket events...");
      console.log("Socket status:", getConnectionStatus());
      console.log("receiveMessage function:", typeof receiveMessage);
      console.log("sendMessage function:", typeof sendMessage);
      console.log("Join sent:", joinSentRef.current);
      console.log("Listener set:", rideListenerSetRef.current);
    };

    // Animate Ride Popup
    useGSAP(() =>
    {
      if (ridePopupPanelRef.current) {
        gsap.to(ridePopupPanelRef.current, {
          y: ridePopUpPanel ? '0%' : '100%',
          duration: 0.5,
          ease: ridePopUpPanel ? 'power2.out' : 'power2.in',
        })
      }
    }, [ridePopUpPanel])

    // Animate Confirm Ride Popup
    useGSAP(() =>
    {
      if (confirmRidePanelRef.current) {
        gsap.to(confirmRidePanelRef.current, {
          y: confirmRidePanel ? '0%' : '100%',
          duration: 0.5,
          ease: confirmRidePanel ? 'power2.out' : 'power2.in',
        })
      }
    }, [confirmRidePanel])

    return (
      <div className="h-screen bg-white">
        {/* Top Navbar */}
        <div className="fixed top-0 left-0 right-0 p-6 flex items-center justify-between z-20">
          <img
            className="w-16"
            src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
            alt="Uber Logo"
          />
          <div className="flex gap-2">
            {/* Debug buttons - remove in production */}
            <button
              onClick={testRidePopup}
              className="h-10 px-3 bg-blue-500 text-white text-sm rounded-full shadow-md"
            >
              Test Ride
            </button>
            <button
              onClick={forceSetupListener}
              className="h-10 px-3 bg-green-500 text-white text-sm rounded-full shadow-md"
            >
              Setup Listener
            </button>
            <button
              onClick={checkSocketEvents}
              className="h-10 px-3 bg-yellow-500 text-white text-sm rounded-full shadow-md"
            >
              Check Socket
            </button>
            <Link
              to="/captain-home"
              className="h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md"
            >
              <i className="text-lg font-medium ri-logout-box-r-line"></i>
            </Link>
          </div>
        </div>

        {/* Map Section */}
        <div className="h-3/5">
          <img
            className="h-full w-full object-cover"
            src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
            alt="Map"
          />
        </div>

        {/* Bottom Info Card */}
        <div className="h-2/5 p-6">
          <CaptainDetails captain={captain} />

          {/* Debug info - remove in production */}
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
            <p><strong>Socket Status:</strong> {getConnectionStatus()?.connected ? '🟢 Connected' : '🔴 Disconnected'}</p>
            <p><strong>Socket ID:</strong> {getConnectionStatus()?.id}</p>
            <p><strong>Captain ID:</strong> {captain?._id}</p>
            <p><strong>Join Sent:</strong> {joinSentRef.current ? '✅' : '❌'}</p>
            <p><strong>Listener Set:</strong> {rideListenerSetRef.current ? '✅' : '❌'}</p>
            {currentRideData && (
              <p><strong>Current Ride:</strong> {currentRideData.ride?._id}</p>
            )}
          </div>
        </div>

        {/* Ride Popup Panel */}
        <div
          ref={ridePopupPanelRef}
          className="fixed w-full z-10 bottom-0 bg-white px-3 py-8 translate-y-full"
        >
          <RidePopUp
            rideData={currentRideData} // Pass the ride data to the component
            setRidePopUpPanel={setRidePopUpPanel}
            setConfirmRidePanel={setConfirmRidePanel}
          />
        </div>

        {/* Confirm Ride Popup Panel */}
        <div
          ref={confirmRidePanelRef}
          className="fixed w-full h-screen z-30 bg-white px-3 py-8 translate-y-full bottom-0"
        >
          <ConfirmRidePopUp
            rideData={currentRideData} // Pass the ride data to the component
            setConfirmRidePanel={setConfirmRidePanel}
            setRidePopUpPanel={setRidePopUpPanel}
          />
        </div>
      </div>
    )
  }

  export default CaptainHome