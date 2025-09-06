import React from "react";

const VehiclePanel = ({
  setVehiclePanel,
  setConfirmRidePanel,
  setVehicleType,
  fare,
  distanceAndTime,
  
}) =>
{
  // safely format fare
  const formatFare = (value) =>
    value !== undefined && value !== null ? value.toFixed(2) : "--";

  // vehicle options mapped from API keys
  const vehicles = [
    {
      key: "auto",
      name: "Auto",
      desc: "Affordable auto rides",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ7Kt54z31PkbdlqmqnyWnaCjvcLYRG-T_8Q&s",
    },
    {
      key: "car",
      name: "Car",
      desc: "Affordable, compact rides",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ7Kt54z31PkbdlqmqnyWnaCjvcLYRG-T_8Q&s",
    },
    {
      key: "motorcycle",
      name: "Bike",
      desc: "Cheapest bike rides",
      img: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
    },
  ];

  return (
    <div>
      <h5
        className="p-3 text-center absolute top-0 w-[93%] cursor-pointer"
        onClick={() => setVehiclePanel(false) 
          
        }
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5">Choose a vehicle</h3>

      {vehicles.map((v) => (
        <div
          key={v.key}
          className="flex border-2 border-gray-100 hover:border-black mb-2 rounded-xl w-full p-3 items-center cursor-pointer"
          onClick={() =>
          {
            setVehiclePanel(false);
            setConfirmRidePanel(true);
            setVehicleType(v.key);
          }}
        >
          <img className="h-10" src={v.img} alt={v.name} />
          <div className="ml-2 w-1/2">
            <h4 className="font-medium text-base">
              {v.name} <span><i className="ri-user-3-fill" /></span>
            </h4>
            <h5 className="font-medium text-base">
              {distanceAndTime?.distance || "--"} • {distanceAndTime?.duration || "--"}
            </h5>
            <p className="font-normal text-xs text-gray-600">{v.desc}</p>
          </div>
          <h2 className="text-xl font-semibold">
            ₹{formatFare(fare?.[v.key])}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default VehiclePanel;
