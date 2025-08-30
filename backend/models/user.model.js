const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fullname: {
    firstname:
    {
      type: String,
      required: true,
      minlength:[3, 'First name must have at least 3 charachters long'],

    },
    lastname: {
      type: String,
      required: true,
      minlength: [3, 'Last name must have at least 3 characters long'],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, 'Email must have at least 5 characters long'],
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: [6, 'Password must have at least 6 characters long'],
  },
  socketId: {
    type: String,
  },
});


// 🔹 Instance method for generating JWT
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET,{ expiresIn: '24h'});
  return token;
};
  
  // 🔹 Instance method for comparing password
  userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };
  // 🔹 Static method for hashing password
  userSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
  };


const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
