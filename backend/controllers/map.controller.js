const { validationResult } = require('express-validator');
const axios = require('axios');
const mapService = require('../services/map.service');

module.exports.getCoordinates = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { address } = req.query;

  try {
    const coordinates = await mapService.getAddressCoordinates(address);

    if (!coordinates) return res.status(404).json({ message: "Coordinates not found" });

    res.status(200).json(coordinates);
  } catch (error) {
    console.error("Error fetching coordinates:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.getDistanceTime = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { origin, destination } = req.query;
  const apiKey = process.env.GOOGLE_MAPS_API;

  if (!apiKey) return res.status(500).json({ message: "Google Maps API key not set" });

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    origin
  )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);

    if (response.data.status !== "OK")
      return res.status(404).json({ message: "Unable to fetch distance and time" });

    const element = response.data.rows[0].elements[0];
    if (element.status !== "OK")
      return res.status(404).json({ message: "No result found for given locations" });

    res.status(200).json({
      distance: element.distance.text,
      duration: element.duration.text,
      distanceValue: element.distance.value, // meters
      durationValue: element.duration.value  // seconds
    });
  } catch (err) {
    console.error("Error fetching distance:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Autocomplete suggestions
module.exports.getAutoCompleteSuggestions = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { input } = req.query;
  const apiKey = process.env.GOOGLE_MAPS_API;

  if (!apiKey) return res.status(500).json({ message: "Google Maps API key not set" });

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url);

    if (response.data.status !== "OK") {
      return res.status(404).json({ message: "No suggestions found" });
    }

    const suggestions = response.data.predictions.map(prediction => prediction.description);

    res.status(200).json({ suggestions });
  } catch (err) {
    console.error("Error fetching suggestions:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
