const express = require('express');

const router = express.Router();

const {body} = require('express-validator');

const rideController = require('../controllers/ride.controller');

router.get('/create', 

  body('userId').isString().isLength({ min: 24,max: 24 }).withMessage('userId is required').withMessage('Invelid userId'),
  body('pickup').isString().isLength({ min: 3}).withMessage('Invelid message'),
  body('destination').isString().isLength({ min: 3}).withMessage('Invelid destination add'),
  body('vehicleType').isString().isIn(['car', 'motorcycle', 'auto']).withMessage('Invelid vehicle type'),
  rideController.createRide
);
  






exports.module = router;