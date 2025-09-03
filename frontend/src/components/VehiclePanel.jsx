import React from 'react';

const VehiclePanel = ({ setVehiclePanel, setConfirmRidePanel }) => {
  return (
    <div>
      <h5
        className="p-3 text-center absolute top-0 w-[93%] cursor-pointer"
        onClick={() => setVehiclePanel(false)}
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5">Choose a vehicle</h3>

      {/* Example vehicle card */}
      <div
        className="flex border-2 border-gray-100 active:border-black mb-2 rounded-xl w-full p-3 items-center cursor-pointer"
        onClick={() => {
          setVehiclePanel(false);       // close vehicle panel
          setConfirmRidePanel(true);    // open confirm ride panel
        }}
      >
        <img
          className="h-10"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ7Kt54z31PkbdlqmqnyWnaCjvcLYRG-T_8Q&s"
          alt="Uber Go"
        />
        <div className="ml-2 w-1/2">
          <h4 className="font-medium text-base">
            UberGO <span><i className="ri-user-3-fill" /></span>
          </h4>
          <h5 className="font-medium text-base">2 mins away</h5>
          <p className="font-normal text-xs text-gray-600">Affordable, compact rides</p>
        </div>
        <h2 className="text-xl font-semibold">₹193.20</h2>
      </div>
    </div>
  );
};

export default VehiclePanel;
