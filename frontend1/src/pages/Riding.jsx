import React from 'react';

const Riding = () => {
  return (
    <div className="h-screen">
      
      {/* Top half with image */}
      <div className="h-1/2 relative">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="Riding"
        />
                <h5 className='pl-85 font-bold text-2xl absolute top-0'><i className=" fonts-xl ri-home-8-line"></i></h5>

      </div>

      <div>
         <div className="flex items-center gap-4">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="driver"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h2 className="text-lg font-bold">SANTH</h2>
          <p className="text-sm text-gray-600">KA15AK00-0</p>
          <p className="text-sm text-gray-500">White Suzuki S-Presso LXI</p>
        </div>
        <div className="flex items-center gap-1 text-yellow-500 font-semibold">
          <span>⭐</span>
          <span>4.9</span>
        </div>
      </div>
      </div>

      {/* Pickup Info */}
      <div className="flex items-center gap-5 p-3 border-b-2">
        <div>
          <h3 className="text-lg font-medium">562/11-A</h3>
          <p className="text-sm -mt-1 text-gray-600">Pickup location</p>
        </div>
      </div>

      {/* Payment Info */}
      <div className="flex items-center gap-5 p-3 border-b-2">
        <i className="ri-currency-line text-xl"></i>
        <div>
          <h3 className="text-lg font-medium">₹250</h3>
          <p className="text-sm -mt-1 text-gray-600">Cash</p>
        </div>
      </div>

      {/* Make Payment Button */}
      <div className="p-20 w-full">
        <button className="w-full bg-green-600 text-white font-semibold p-2 rounded-lg">
          Make A Payment
        </button>
      </div>
    </div>
  );
};

export default Riding;
