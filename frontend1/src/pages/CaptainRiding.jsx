import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false)

  const finishRidePanelRef = useRef(null)

  useGSAP(
    () => {
      if (finishRidePanel) {
        gsap.to(finishRidePanelRef.current, {
          y: "0%",
          duration: 0.5,
          ease: "power2.out",
        })
      } else {
        gsap.to(finishRidePanelRef.current, {
          y: "100%",
          duration: 0.5,
          ease: "power2.in",
        })
      }
    },
    [finishRidePanel]
  )

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
      <div className="h-4/5">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="Map"
        />
      </div>

      {/* Ride Info / Button */}
      <div 
  onClick={() => setFinishRidePanel(true)}  
  className="h-1/5 p-6 flex items-center justify-between relative bg-yellow-400"
>
  <h5 className='p-1 text-center w-screen absolute top-0 cursor-pointer'> 
    <i className='text-3xl text-gray-200 ri-arrow-down-wide-line'></i>
  </h5>

  <h4 className='text-xl font-semibold'>4km away</h4>

  <button className='bg-green-600 text-white px-6 py-2 rounded-lg font-semibold'>
    Complete Ride
  </button>
</div>
A
      {/* Slide-up Finish Ride Panel */}
      <div
        ref={finishRidePanelRef}
        className="fixed w-full z-10 bottom-0 bg-white px-3 py-8 translate-y-full"
      >
        <FinishRide  setFinishRidePanel={setFinishRidePanel}/>
      </div>
    </div>
  )
}

export default CaptainRiding
