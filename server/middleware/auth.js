import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware to verify JWT token and attach user to request
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication required. Please provide a valid token.",
      });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    if (!token) {
      return res.status(401).json({
        error: "Authentication required. Please provide a valid token.",
      });
    }

    try {
      // Verify token
      // eslint-disable-next-line no-undef
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key-change-in-production"
      );

      // Get user from database
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(401).json({
          error: "User not found. Token is invalid.",
        });
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (tokenError) {
      if (tokenError.name === "TokenExpiredError") {
        return res.status(401).json({
          error: "Token has expired. Please login again.",
        });
      }
      if (tokenError.name === "JsonWebTokenError") {
        return res.status(401).json({
          error: "Invalid token. Please login again.",
        });
      }
      throw tokenError;
    }
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({
      error: "Authentication failed. Please try again.",
    });
  }
};
