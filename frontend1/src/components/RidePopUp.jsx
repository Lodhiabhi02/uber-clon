import React from 'react'

const RidePopUp = ({ rideData, setRidePopUpPanel, setConfirmRidePanel }) =>
{
  // Helper function to capitalize first letter
  const capitalize = (str) =>
  {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Extract ride information from rideData
  const ride = rideData?.ride;
  const user = ride?.user;
  const pickup = ride?.pickup || "Pickup location";
  const destination = ride?.destination || "Destination";
  const fare = ride?.fare || 0;
  const userName = user?.fullname
    ? `${capitalize(user.fullname.firstname)} ${capitalize(user.fullname.lastname)}`
    : "Unknown User";
  const userEmail = user?.email || "";

  // Debug logging
  console.log("🎭 RidePopUp render - rideData:", rideData);

  return (
    <div className="relative">
      {/* Close button */}
      <h5
        className="p-1 text-center w-[93%] absolute top-0 cursor-pointer"
        onClick={() => setRidePopUpPanel(false)}
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5 mt-6">New Ride Available!</h3>

      {/* Show debug info if no ride data */}
      {!ride && (
        <div className="p-3 bg-red-100 border border-red-300 rounded mb-4">
          <p className="text-red-700 text-sm">⚠️ No ride data available</p>
          <p className="text-xs text-gray-600">rideData: {JSON.stringify(rideData)}</p>
        </div>
      )}

      {/* Profile Card */}
      <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7EJg1q3hgf9nJnb17jfg8KfX3fQ"
            alt="Passenger"
          />
          <div>
            <h2 className="text-lg font-medium">{userName}</h2>
          </div>
        </div>
        <div className="text-right">
          <h5 className="text-lg font-semibold">2.7 KM</h5>
          {ride?.vehicleType && (
            <p className="text-sm text-gray-700 capitalize">{ride.vehicleType}</p>
          )}
        </div>
      </div>

      {/* Ride Details */}
      <div className="w-full mt-5">
        <div className="flex items-center gap-5 p-3 border-b-2">
          <i className="ri-map-pin-user-fill text-green-600"></i>
          <div className="flex-1">
            <h3 className="text-lg font-medium">{pickup}</h3>
            <p className="text-sm -mt-1 text-gray-600">Pickup location</p>
          </div>
        </div>

        <div className="flex items-center gap-5 p-3 border-b-2">
          <i className="text-lg ri-map-pin-2-fill text-red-600"></i>
          <div className="flex-1">
            <h3 className="text-lg font-medium">{destination}</h3>
            <p className="text-sm -mt-1 text-gray-600">Destination</p>
          </div>
        </div>

        <div className="flex items-center gap-5 p-3">
          <i className="ri-currency-line text-yellow-600"></i>
          <div className="flex-1">
            <h3 className="text-lg font-medium">₹{fare}</h3>
            <p className="text-sm -mt-1 text-gray-600">Cash</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <button
        onClick={() =>
        {
          console.log("✅ Captain accepting ride:", ride?._id);
          setConfirmRidePanel(true); // open driver panel
        }}
        className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg hover:bg-green-700 transition-colors"
      >
        Accept
      </button>

      <button
        onClick={() =>
        {
          console.log("❌ Captain ignoring ride:", ride?._id);
          setRidePopUpPanel(false);
        }}
        className="w-full mt-1 bg-gray-600 text-gray-200 font-semibold p-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        Ignore
      </button>
    </div>
  )
}

export default RidePopUp