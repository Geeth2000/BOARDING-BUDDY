const mongoose = require("mongoose");

/**
 * Create default admin user if not exists
 */
const seedAdminUser = async () => {
  try {
    // Import User model here to avoid circular dependency
    const User = require("../models/User");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });

    if (!existingAdmin) {
      // Create admin user (password is auto-hashed by User model pre-save hook)
      await User.create({
        name: "Admin",
        email: "admin@boardingbuddy.com",
        password: "Admin@123",
        role: "admin",
        isVerified: true,
      });

      console.log("✅ Default admin user created (admin@boardingbuddy.com)");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error.message);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 8+ handles these options automatically
    });

    console.log(`🚀MongoDB Connected: ${conn.connection.host}`);

    // Seed default admin user after connection
    await seedAdminUser();

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
    });
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
