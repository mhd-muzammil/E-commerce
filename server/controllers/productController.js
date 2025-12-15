import Product from "../models/Product.js";

/**
 * Get all products
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

/**
 * Get a single product by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if valid MongoDB ObjectId
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Return product with stock field
    res.json({
      _id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      discount: product.discount,
      category: product.category,
      image: product.image,
      stock: product.stock || 0,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

/**
 * Create a new product (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createProduct = async (req, res) => {
  try {
    const { title, description, price, discount, category, image } = req.body;

    // Validation
    if (
      !title ||
      !description ||
      price === undefined ||
      discount === undefined ||
      !image
    ) {
      return res.status(400).json({
        error:
          "All fields are required: title, description, price, discount, and image",
      });
    }

    if (isNaN(price) || Number(price) < 0) {
      return res.status(400).json({
        error: "Price must be a valid positive number",
      });
    }

    if (isNaN(discount) || Number(discount) < 0 || Number(discount) > 100) {
      return res.status(400).json({
        error: "Discount must be a number between 0 and 100",
      });
    }

    // Create new product
    const product = new Product({
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      discount: Number(discount),
      category: category?.trim() || "Uncategorized",
      image: image.trim(),
      stock: req.body.stock !== undefined ? Number(req.body.stock) : 100,
    });

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        error: "Validation failed",
        details: errors,
      });
    }

    res.status(500).json({ error: "Failed to create product" });
  }
};

/**
 * Update a product (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { title, description, price, discount, category, image, stock } =
      req.body;

    // Check if valid MongoDB ObjectId
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    // Find product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update fields if provided
    if (title !== undefined) product.title = title.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) {
      if (isNaN(price) || Number(price) < 0) {
        return res.status(400).json({
          error: "Price must be a valid positive number",
        });
      }
      product.price = Number(price);
    }
    if (discount !== undefined) {
      if (isNaN(discount) || Number(discount) < 0 || Number(discount) > 100) {
        return res.status(400).json({
          error: "Discount must be a number between 0 and 100",
        });
      }
      product.discount = Number(discount);
    }
    if (category !== undefined)
      product.category = category?.trim() || "Uncategorized";
    if (image !== undefined) product.image = image.trim();
    if (stock !== undefined) {
      if (isNaN(stock) || Number(stock) < 0) {
        return res.status(400).json({
          error: "Stock must be a valid non-negative number",
        });
      }
      product.stock = Number(stock);
    }

    await product.save();

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        error: "Validation failed",
        details: errors,
      });
    }

    res.status(500).json({ error: "Failed to update product" });
  }
};

/**
 * Delete a product (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if valid MongoDB ObjectId
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    // Find and delete product
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
