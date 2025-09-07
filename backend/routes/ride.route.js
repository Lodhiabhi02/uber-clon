const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');

const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// 🚀 Create Ride
router.post(
  '/create',
  authMiddleware.authUser,
  body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup'),
  body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination'),
  body('vehicleType')
    .isString()
    .isIn(['car', 'motorcycle', 'auto'])
    .withMessage('Invalid vehicle type'),
  (req, res, next) => {
    console.log('✅ Validation passed, calling controller');
    next();
  },
  rideController.createRide
);

// 🚀 Get Fare
router.get(
  '/get-fare',
  authMiddleware.authUser,

  query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup'),
  query('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination'),
  rideController.getFare
  
);

// ✅ Export once
module.exports = router;
