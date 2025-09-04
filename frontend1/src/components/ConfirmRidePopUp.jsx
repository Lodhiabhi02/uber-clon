import React from 'react'
import CaptainRiding from '../pages/CaptainRiding'
import { Link } from 'react-router-dom'

const ConfirmRidePopUp = ({ setConfirmRidePanel, setRidePopUpPanel }) => {

  const submitHandler = (e) => {
    e.preventDefault()
    
   
  }


  return (
    <div className="relative">
      {/* Close button */}
      <h5
        onClick={() => setConfirmRidePanel(false)}
        className="w-[93%] text-center absolute cursor-pointer"
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5 mt-6">
        Confirm that this ride should start
      </h3>

      {/* Profile Card */}
      <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7EJg1q3hgf9nJnb17jfg8KfX3fQ"
            alt="Passenger"
          />
          <h2 className="text-lg font-medium">Harsh Patel</h2>
        </div>
        <h5 className="text-lg font-semibold">2.2 KM</h5>
      </div>

      {/* Ride Details */}
      <div className="w-full mt-5">
        <div className="flex items-center gap-5 p-3 border-b-2">
          <i className="ri-map-pin-user-fill"></i>
          <div>
            <h3 className="text-lg font-medium">562/11-A</h3>
            <p className="text-sm -mt-1 text-gray-600">Pickup location</p>
          </div>
        </div>

        <div className="flex items-center gap-5 p-3 border-b-2">
          <i className="text-lg ri-map-pin-2-fill"></i>
          <div>
            <h3 className="text-lg font-medium">89/7</h3>
            <p className="text-sm -mt-1 text-gray-600">Destination</p>
          </div>
        </div>

        <div className="flex items-center gap-5 p-3">
          <i className="ri-currency-line"></i>
          <div>
            <h3 className="text-lg font-medium">₹250</h3>
            <p className="text-sm -mt-1 text-gray-600">Cash</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='mt-6'>
         
         <form onSubmit={(e) =>{
          
          submitHandler(e)
          
          }}>
            
            <input value={'otp'} onChange={(e) => senOTP (e.target.value)}  type="text" className='bg-[#eee] px-6 py-4 text-lg rounded-lg w-full mt-3' placeholder='Enter OTP'/>

        <Link
           to="/captain-riding"
        className="w-full mt-5 flex justify-center bg-green-600 text-white font-semibold p-2 rounded-lg"
      >
        Confirm
      </Link>

      <button
        onClick={() => {
          setConfirmRidePanel(false)
          setRidePopUpPanel(false)
        }}
        className="w-full mt-1 bg-red-600 text-white font-semibold p-2 rounded-lg"
      >
        Cancel
      </button>

         </form>

      </div>
    </div>
  )
}

export default ConfirmRidePopUp
