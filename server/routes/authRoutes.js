import express from "express";
import { signup, login, getProfile } from "../controllers/authController.js";
import {
  changePassword,
  updateProfile,
} from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// POST /api/auth/signup - User signup
router.post("/signup", signup);

// POST /api/auth/login - User login
router.post("/login", login);

// GET /api/auth/profile - Get current user profile (protected)
router.get("/profile", authenticate, getProfile);

// PUT /api/auth/profile - Update user profile (protected)
router.put("/profile", authenticate, updateProfile);

// PUT /api/auth/change-password - Change password (protected)
router.put("/change-password", authenticate, changePassword);

export default router;
