
const rideService = require('../services/ride.service');

const {validationResult} = require('express-validator');

module.exports.createRide = async (req, res) => {
 
  const errors = validationResult(req);
  
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
  }

  
} 