const userModel = require("../models/user.model");
const userservices = require("../services/user.services");
const { validationResult } = require("express-validator");

const blacklistTokenSchema = require("../models/blacklistToken.model");

module.exports.registerUser = async (req, res, next) => {
  try {
    // ✅ check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {  fullname,email, password } = req.body;

    const isUserAlready = await userModel.findOne({ email });
    if (isUserAlready) {
      return res.status(400).json({ message: "User already exists" });
    }

    // if (!email || !fullname || !password) {
    //   return res.status(400).json({ error: "All fields are required" });
    // }

    // ✅ hash password using model method
    const hashedPassword = await userModel.hashPassword(password);

    // ✅ create user using service
    const user = await userservices.createUser({
      fullname,
      email,
      password: hashedPassword,
    });

    // ✅ generate token using user model method
    const token = user.generateAuthToken();

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.loginUser = async (req, res, next) => {
  try {
    // ✅ check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // ✅ find user by email
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    // ✅ compare password (using instance method)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid or password" });
    }

    // ✅ generate token
    const token = user.generateAuthToken();
    
    res.cookie('token',token);

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.getUserProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.logoutUser = async (req, res, next) => {
  res.clearCookie('token');
  const token = req.cookies.token || req.headers.authorization.split('') [1];
   await blacklistTokenSchema.create({token});
   res.status(200).json({message: "Logged out successfully"});
  }
