const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// 🚀 Add logs for debugging
router.post(
  '/create',
  authMiddleware.authUser,
  (req, res, next) => {
    next();
  },
  body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup'),
  body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination'),
  body('vehicleType').isString().isIn(['car', 'motorcycle', 'auto']).withMessage('Invalid vehicle type'),
  (req, res, next) => {
    console.log('✅ Validation passed, calling controller');
    next();
  },
  rideController.createRide
);

module.exports = router;
