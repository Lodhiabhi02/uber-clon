import React from 'react'


const CaptainDetails = () => {
  

  return (
    <div>
      {/* Profile + Earnings Card */}
      <div className="h-2/5 p-6 bg-white rounded-t-3xl -mt-6 relative z-10 shadow-lg">
        {/* Profile + Earnings */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              className="w-16 h-16 rounded-full object-cover"
              src="https://tse1.mm.bing.net/th/id/OET.7252da000e8341b2ba1fb61c275c1f30?w=594&h=594&c=7&rs=1&o=5&pid=1.9"
              alt="Driver"
            />
            <h4 className="text-lg font-medium">Abhishek Lodhi</h4>
          </div>

          {/* Earnings clickable */}
          <div
            className="text-right cursor-pointer active:scale-95 transition"
            
          >
            <h4 className="text-xl font-semibold flex items-start">
              <span className="text-sm align-top">$</span>
              <span>295.20</span>
            </h4>
            <p className="text-sm text-gray-600">Earned</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex items-start justify-between mt-6">
          <div className="text-center">
            <i className="text-2xl ri-timer-line"></i>
            <h5 className="text-lg font-medium">10.2</h5>
            <p className="text-sm text-gray-600">Hours Online</p>
          </div>
          <div className="text-center">
            <i className="text-2xl ri-speed-up-fill"></i>
            <h5 className="text-lg font-medium">120</h5>
            <p className="text-sm text-gray-600">Trips Completed</p>
          </div>
          <div className="text-center">
            <i className="text-2xl ri-star-s-fill"></i>
            <h5 className="text-lg font-medium">4.8</h5>
            <p className="text-sm text-gray-600">Rating</p>
          </div>
        </div>
      </div>

      {/* Confirm Ride Panel */}
      <div
        
        className="fixed w-full h-1/2 z-20 bottom-0 translate-y-full bg-white px-5 py-6 shadow-lg rounded-t-3xl"
      >
        <h2 className="text-xl font-semibold mb-4">Confirm Ride</h2>

        <div className="mb-4">
          <h3 className="text-lg font-medium">Pickup: 562/11-A</h3>
          <p className="text-sm text-gray-600">Destination: 89/7</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Fare: ₹250</h3>
          <p className="text-sm text-gray-600">Cash</p>
        </div>

        
      </div>
    </div>
  )
}

export default CaptainDetails
