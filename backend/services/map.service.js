const axios = require('axios');

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

  const response = await axios.get(url);

  if (response.data.status !== "OK") return null;

  const element = response.data.rows[0].elements[0];
  if (element.status !== "OK") return null;

  return {
    distance: element.distance.text,
    duration: element.duration.text,
    distanceValue: element.distance.value, // meters
    durationValue: element.duration.value  // seconds
  };
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

module.exports = {
  getAddressCoordinates,
  getDistanceTime,
  getAutoCompleteSuggestions
};
