const rideModel = require('../models/ride.model');

const mapService = require('./map.service');

async function gatFare(pickup, destination) {



module.exports.createRide = async ({ user, captain, pickup, destination, fare }) =>{} ;




  if(!pickup || !destination) {

    throw new Error('Pickup and destination are required');
  }

const distanceTime = await mapService.getDistanceTime(pickup, destination);
  

  const farePerKm = {
    auto: 8,
    car: 10,
    motorcycle: 5
  };

  const farePerMinute = {
    auto: 0.25,
    car: 0.5,
    motorcycle: 0.1
  };

  const farePerHour = {
    auto: 20,
    car: 50,
    motorcycle: 10
  };

const fare = {
  auto: baseFare.auto +
    (distanceTime.distance * perKmRate.auto) +
    (distanceTime.time * perMinuteRate.auto),

  car: baseFare.car +
    (distanceTime.distance * perKmRate.car) +
    (distanceTime.time * perMinuteRate.car),

  motorcycle: baseFare.motorcycle +
    (distanceTime.distance * perKmRate.motorcycle) +
    (distanceTime.time * perMinuteRate.motorcycle),
};

return fare;


}

module.exports.createRide = async ({
  user, pickup, destination, vehicleType
}) => {
  if (!userId || !pickup || !destination || !vehicleType) {
    throw new Error('All fields are required');
  }

  const fare = await getFare(pickup, destination);

  const ride = rideModel.create({
    userId,
    pickup,
    destination,
    fare: fare[vehicleType]
  });

  return ride;
};
