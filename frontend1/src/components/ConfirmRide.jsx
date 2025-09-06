import React from 'react';

const ConfirmRide = ({
  setConfirmRidePanel,
  setDriverRidePanel,
  createRide,
  vehicleType,
  pickup,
  destination,
  fare
}) =>
{
  // ✅ Helper to get fare safely
  const rideFare = fare?.[vehicleType] ?? "--";

  // ✅ Map vehicle types to images
  const vehicleImages = {
    car: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/UberX_car.png/640px-UberX_car.png",
    auto: "https://static.vecteezy.com/system/resources/previews/014/349/941/original/auto-rickshaw-clipart-design-illustration-free-png.png",
    motorcycle: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
  };

  // ✅ Choose the image dynamically (fallback: car)
  const vehicleImage = vehicleImages[vehicleType] || vehicleImages.car;

  return (
    <div>
      {/* Close button */}
      <h5
        className="p-1 text-center w-[93%] absolute top-0 cursor-pointer"
        onClick={() => setConfirmRidePanel(false)}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5">Confirm your Ride</h3>

      <div className="flex gap-2 justify-between flex-col items-center">
        {/* ✅ Vehicle image changes dynamically */}
        <img className="h-20" src={vehicleImage} alt={vehicleType} />

        <div className="w-full mt-5">
          {/* Pickup */}
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">{pickup}</h3>
              <p className="text-sm -mt-1 text-gray-600">Pickup location</p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">{destination}</h3>
              <p className="text-sm -mt-1 text-gray-600">Destination</p>
            </div>
          </div>

          {/* Fare */}
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹{rideFare}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>

        {/* Confirm button */}
        <button
          onClick={async () =>
          {
            await createRide(vehicleType); // sends pickup + destination + vehicleType
            setConfirmRidePanel(false);
            setDriverRidePanel(true);
          }}
          className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmRide;
