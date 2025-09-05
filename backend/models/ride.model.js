const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
  },
  captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Captain"
  },
  
  pickup:{
      type: String,
      required: true
  },
   destination: {
      type: String,
      required: true
  },
    fare: {
      type: Number,
      required: true
      },
  status: {
      type: String,
      enum: ["pending", "accepted", "ongoing","rejected", "completed"] ,
      default: "pending"
  },
  duration: {
      type: Number
      },
   distance: {
        type: Number
   },
   paymentId: {
       type: String
   },
   
   orderId: {
       type: String
   },
   signature: {
       type: String
   },
otp: {
  type: Number,
  required: true,
  default: function() {
    const min = Math.pow(10, 5);
    const max = Math.pow(10, 6) - 1;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
})



module.exports = mongoose.model("ride", rideSchema);