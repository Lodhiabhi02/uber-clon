import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'

const CaptainHome = () =>
{
  // State for panels
  const [ridePopUpPanel, setRidePopUpPanel] = useState(false)
  const [confirmRidePanel, setConfirmRidePanel] = useState(false)

  // Refs for GSAP animations
  const ridePopupPanelRef = useRef(null)
  const confirmRidePanelRef = useRef(null)

  // Open RidePopUp automatically when component mounts
  useEffect(() =>
  {
    setRidePopUpPanel(true)
  }, [])

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
        <CaptainDetails />
      </div>

      {/* Ride Popup Panel */}
      <div
        ref={ridePopupPanelRef}
        className="fixed w-full z-10 bottom-0 bg-white px-3 py-8 translate-y-full"
      >
        <RidePopUp setRidePopUpPanel={setRidePopUpPanel} 
        setConfirmRidePanel={setConfirmRidePanel} />
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
