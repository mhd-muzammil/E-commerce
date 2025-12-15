import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { authenticate } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";

const router = express.Router();

// GET /api/products - Get all products (public)
router.get("/", getAllProducts);

// POST /api/products - Create new product (Admin only)
router.post("/", authenticate, isAdmin, createProduct);

// PUT /api/products/:id - Update product (Admin only)
router.put("/:id", authenticate, isAdmin, updateProduct);

// DELETE /api/products/:id - Delete product (Admin only)
router.delete("/:id", authenticate, isAdmin, deleteProduct);

// GET /api/products/:id - Get single product by ID (public)
// This should be last to avoid matching other routes
router.get("/:id", getProductById);

export default router;
