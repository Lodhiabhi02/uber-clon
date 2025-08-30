const mongoose = require("mongoose");

function connectToDB() {
  console.log("Loaded ENV:", process.env.MONGO_URI);

  mongoose
    .connect(process.env.MONGO_URI) // no need for options in latest mongoose
    .then(() => {
      console.log("✅ Connected to MongoDB successfully");
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      process.exit(1);
    });
}

module.exports = connectToDB;
