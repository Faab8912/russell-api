const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  try {
    await mongoose.connect(uri, {
      dbName: process.env.DB_NAME || "russell_marina",
    });
    console.log("MongoDB connecté");
  } catch (err) {
    console.error("Erreur connexion MongoDB:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
