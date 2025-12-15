import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // eslint-disable-next-line no-undef
    const mongoUri =
      process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce";
    const conn = await mongoose.connect(mongoUri);

    console.log(
      `✅ MongoDB Connected: ${conn.connection.host}, DB: ${conn.connection.name}`
    );
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    // eslint-disable-next-line no-undef
    process.exit(1);
  }
};

export default connectDB;
