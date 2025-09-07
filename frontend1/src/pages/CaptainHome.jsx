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
  const { sendMessage, receiveMessage } = useContext(SocketContext)

  // State for panels
  const [ridePopUpPanel, setRidePopUpPanel] = useState(false)
  const [confirmRidePanel, setConfirmRidePanel] = useState(false)

  // Refs for GSAP animations
  const ridePopupPanelRef = useRef(null)
  const confirmRidePanelRef = useRef(null)

  useEffect(() =>
  {
    setRidePopUpPanel(true);

    if (captain?._id) {
      // Join the socket room
      sendMessage("join", {
        userId: captain._id,
        userType: "captain",
      });

      receiveMessage("new-ride", (data) =>
      {
        console.log("New ride request:", data);
        // You might want to update state here to show the ride popup
      });


      const updateLocation = () =>
      {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) =>
            {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;

              // ✅ Log location values
              console.log("📍 Captured location:", { lat, lng, userId: captain._id });

              // ✅ Use sendMessage instead of socket.emit
              console.log("Sending update-location-captain via sendMessage");
              sendMessage("update-location-captain", {
                userId: captain._id,
                location: { lat, lng },
              });

              // ✅ Confirm event sent
              console.log("📤 Sent 'update-location-captain' to server via sendMessage");
            },
            (error) =>
            {
              console.error("❌ Geolocation error:", error);
            }
          );
        }
      };

      // Update immediately + then every 5s
      updateLocation();
      const locationInterval = setInterval(updateLocation, 10000);

      return () =>
      {
        clearInterval(locationInterval);
      };
    }
  }, [captain, sendMessage, receiveMessage]);




  // Animate Ride Popup
  useGSAP(() =>
  {
    gsap.to(ridePopupPanelRef.current, {
      y: ridePopUpPanel ? '0%' : '100%',
      duration: 0.5,
      ease: ridePopUpPanel ? 'power2.out' : 'power2.in',
    })
  }, [ridePopUpPanel])

  // Animate Confirm Ride Popup
  useGSAP(() =>
  {
    gsap.to(confirmRidePanelRef.current, {
      y: confirmRidePanel ? '0%' : '100%',
      duration: 0.5,
      ease: confirmRidePanel ? 'power2.out' : 'power2.in',
    })
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
        <Link
          to="/captain-home"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
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
      </div>

      {/* Ride Popup Panel */}
      <div
        ref={ridePopupPanelRef}
        className="fixed w-full z-10 bottom-0 bg-white px-3 py-8 translate-y-full"
      >
        <RidePopUp
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
          setConfirmRidePanel={setConfirmRidePanel}
          setRidePopUpPanel={setRidePopUpPanel}
        />
      </div>
    </div>
  )
}

export default CaptainHome