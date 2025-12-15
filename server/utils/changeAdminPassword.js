import mongoose from "mongoose";
import User from "../models/User.js";
import connectDB from "../config/db.js";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

const changeAdminPassword = async () => {
  try {
    // Connect to database
    await connectDB();

    // Get admin email
    const adminEmail = await question(
      "Enter admin email (default: admin@example.com): "
    );
    const email = adminEmail.trim() || "admin@example.com";

    // Check if admin exists
    const admin = await User.findOne({ email: email.toLowerCase() });
    if (!admin) {
      console.log(`❌ User with email ${email} not found!`);
      process.exit(1);
    }

    if (admin.role !== "admin") {
      console.log(`❌ User ${email} is not an admin!`);
      process.exit(1);
    }

    // Get new password
    const newPassword = await question(
      "Enter new password (min 6 characters): "
    );
    if (!newPassword || newPassword.length < 6) {
      console.log("❌ Password must be at least 6 characters long!");
      process.exit(1);
    }

    // Confirm password
    const confirmPassword = await question("Confirm new password: ");
    if (newPassword !== confirmPassword) {
      console.log("❌ Passwords do not match!");
      process.exit(1);
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    console.log(`\n✅ Password changed successfully for ${email}!`);
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error changing password:", error.message);
    rl.close();
    process.exit(1);
  }
};

changeAdminPassword();
