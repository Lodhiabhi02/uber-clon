const express = require('express');
const { query } = require('express-validator');
const mapController = require('../controllers/map.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// ✅ Route for coordinates
router.get(
  '/get-coordinates',
  query('address').isString().isLength({ min: 3 }).withMessage('Address is required'),
  authMiddleware.authUser,
  mapController.getCoordinates
);

// ✅ Route for distance & time
router.get(
  '/get-distance-time',
  query('origin').isString().isLength({ min: 3 }).withMessage('Origin is required'),
  query('destination').isString().isLength({ min: 3 }).withMessage('Destination is required'),
  authMiddleware.authUser,
  mapController.getDistanceTime
);

// ✅ Route for autocomplete suggestions
router.get(
  '/get-suggestions',
  query('input').isString().isLength({ min: 3 }).withMessage('Input is required'),
  authMiddleware.authUser,
  mapController.getAutoCompleteSuggestions
);

module.exports = router;
