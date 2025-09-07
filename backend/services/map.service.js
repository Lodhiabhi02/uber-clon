const axios = require('axios');
const CaptainModel = require('../models/captain.model');
// ✅ Get coordinates from an address using Google Geocoding API
async function getAddressCoordinates(address) {
  const apiKey = process.env.GOOGLE_MAPS_API;

  if (!apiKey) throw new Error("Google Maps API key not set");

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  const response = await axios.get(url);

  if (response.data.status !== "OK" || response.data.results.length === 0) {
    return null;
  }

  const location = response.data.results[0].geometry.location;

  return {
    lat: location.lat,
    lng: location.lng,
    formattedAddress: response.data.results[0].formatted_address
  };
}

// ✅ Get distance & time between origin and destination
async function getDistanceTime(origin, destination) {
  const apiKey = process.env.GOOGLE_MAPS_API;
  if (!apiKey) throw new Error("Google Maps API key not set");

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    origin
  )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  try {
    const response = await axios.get(url, { timeout: 10000 });

    const element = response.data.rows[0].elements[0];


    if (!element || element.status !== 'OK') {
      throw new Error(`Failed to resolve origin/destination: ${element?.status}`);
    }

    return {
      distance: element.distance.value / 1000, // meters → km (number)
      time: element.duration.value / 60        // seconds → minutes (number)
    };
  } catch (err) {
    console.error('Map API request failed:', err.message);
    return null;
  }
}

// ✅ Get autocomplete suggestions using Google Places API
async function getAutoCompleteSuggestions(input) {
  const apiKey = process.env.GOOGLE_MAPS_API;

  if (!apiKey) throw new Error("Google Maps API key not set");

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${apiKey}`;

  const response = await axios.get(url);

  if (response.data.status !== "OK") return null;

  return response.data.predictions.map(prediction => ({
    description: prediction.description,
    placeId: prediction.place_id
  }));
}

async function getCaptainsInTheRadius(lat, lng, radius) {
  // radius in KM

  const captains = await CaptainModel.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius / 111.045]
      }
    }
  });

  return captains
}



module.exports = {
  getAddressCoordinates,
  getDistanceTime,
  getAutoCompleteSuggestions,
  getCaptainsInTheRadius
};
