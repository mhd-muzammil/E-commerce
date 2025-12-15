import mongoose from "mongoose";
import User from "../models/User.js";
import connectDB from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to database
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@zamil.com" });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      name: "Admin User",
      email: "admin@zamil.com",
      password: "Zamil123$", // Change this in production!
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin user created successfully!");
    console.log("Email: admin@zamil.com");
    console.log("Password: Zamil123$");
    console.log("⚠️  Please change the password after first login!");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
