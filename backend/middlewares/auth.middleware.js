const userModel = require("../models/user.model");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklistToken.model");

module.exports.authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.header('Authorization')?.split(' ')[1];
    console.log("Token received:", token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const isBlacklisted = await userModel.findOne({token : token});

    if(isBlacklisted) {
      return res.status(401).json({ message: "Unauthorized: Token is blacklisted" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    const user = await userModel.findById(decoded._id);
    console.log("User found in DB:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
