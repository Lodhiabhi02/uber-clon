import React from "react";

const LocationSearchPanel = ({ setVehiclePanel }) => {
  const locations = [
    "d24,vijay nagar near to school,bhopal",
    "kolar road near to reliance trend,bhopal",
    "kolar road near to reliance smart,bhopal",
    "kolar road near to hotel landmark,bhopal",
    "kolar road near to hotel the mark,bhopal",
    "kolar road near to hotel the landmark,bhopal",
    "kolar road near to hotel the mark,bhopal",
    "kolar road near to hotel the landmark,bhopal",
    "kolar road near to hotel the mark,bhopal",
  ];

  return (
    <div>
      {locations.map((elem, index) => (
        <div
          key={index}
          onClick={() => setVehiclePanel(true)}
          className="flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start cursor-pointer"
        >
          <h2 className="bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full">
            <i className="ri-map-pin-fill"></i>
          </h2>
          <h4 className="font-medium">{elem}</h4>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchPanel;
