import React from "react";

const WaitingForDriver = (waitingfordriver) => {
  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-5 space-y-4">
      <h5  onClick ={() => {
            waitingfordriver(false);
      }} className="p-1 text-center w-[93%] absolute top-0"> <i className="ri-arrow-down-wide-line"></i>
        </h5>
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

      {/* Message Input */}
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Send a message..."
          className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button className="bg-gray-300 p-2 rounded-r-lg hover:bg-gray-400 transition">
          ➤
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-around text-center text-gray-700">
        <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-500">
          <div className="p-3 bg-gray-100 rounded-full">
            <i className="ri-shield-user-line text-xl"></i>
          </div>
          <span className="text-sm">Safety</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-500">
          <div className="p-3 bg-gray-100 rounded-full">
            <i className="ri-share-line text-xl"></i>
          </div>
          <span className="text-sm">Share my trip</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-500">
          <div className="p-3 bg-gray-100 rounded-full">
            <i className="ri-phone-line text-xl"></i>
          </div>
          <span className="text-sm">Call driver</span>
        </div>
      </div>

      {/* Trip Location */}
      <div className="border-t border-gray-200 pt-2">
        <p className="text-sm font-semibold">562/11-A</p>
        <p className="text-gray-600 text-sm">
          Kaikondrahalli, Bengaluru, Karnataka
        </p>
      </div>
    </div>
  );
};

export default WaitingForDriver;
