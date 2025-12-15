import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";
import { defaultProducts } from "./config/defaultProducts.js";

// Load environment variables
dotenv.config();

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    // eslint-disable-next-line no-undef
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Initialize products in database if empty
const initializeProducts = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(defaultProducts);
      console.log("Initialized database with default products");
    }
  } catch (error) {
    console.error("Error initializing products:", error);
  }
};

// Initialize products after a short delay to ensure DB connection
setTimeout(initializeProducts, 2000);

// Socket.IO: Track viewers per product room
// In-memory map: productId -> viewerCount
const productViewers = new Map();

// Track available stock per product (productId -> availableStock)
// This will be updated when users add/remove items from cart
const productAvailableStock = new Map();

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle joining a product room
  socket.on("joinProductRoom", async (productId) => {
    if (!productId) {
      return;
    }

    const roomId = `product:${productId}`;

    // Join the room
    socket.join(roomId);

    // Increment viewer count for this product
    const currentCount = productViewers.get(productId) || 0;
    const newCount = currentCount + 1;
    productViewers.set(productId, newCount);

    // Get current available stock (if not set, fetch from database)
    let availableStock = productAvailableStock.get(productId);
    if (availableStock === undefined) {
      try {
        const product = await Product.findById(productId);
        availableStock = product ? product.stock || 0 : 0;
        productAvailableStock.set(productId, availableStock);
      } catch (error) {
        console.error("Error fetching product stock:", error);
        availableStock = 0;
      }
    }

    // Emit updated viewer count to all clients in this room
    io.to(roomId).emit("viewerCountUpdate", {
      productId,
      viewerCount: newCount,
    });

    // Emit current stock to the newly joined user
    socket.emit("stockUpdate", {
      productId,
      availableStock,
    });

    console.log(
      `User ${socket.id} joined product room ${productId}. Viewers: ${newCount}, Stock: ${availableStock}`
    );
  });

  // Handle leaving a product room
  socket.on("leaveProductRoom", (productId) => {
    if (!productId) {
      return;
    }

    const roomId = `product:${productId}`;

    // Leave the room
    socket.leave(roomId);

    // Decrement viewer count
    const currentCount = productViewers.get(productId) || 0;
    const newCount = Math.max(0, currentCount - 1);

    if (newCount === 0) {
      productViewers.delete(productId);
    } else {
      productViewers.set(productId, newCount);
    }

    // Emit updated viewer count to all clients in this room
    io.to(roomId).emit("viewerCountUpdate", {
      productId,
      viewerCount: newCount,
    });

    console.log(
      `User ${socket.id} left product room ${productId}. Viewers: ${newCount}`
    );
  });

  // Handle stock updates from clients
  socket.on("updateProductStock", (data) => {
    const { productId, availableStock } = data;

    if (!productId || availableStock === undefined) {
      return;
    }

    const roomId = `product:${productId}`;

    // Update available stock for this product
    productAvailableStock.set(productId, availableStock);

    // Emit stock update to all viewers in this product room
    io.to(roomId).emit("stockUpdate", {
      productId,
      availableStock,
    });

    console.log(
      `Stock updated for product ${productId}: ${availableStock} available`
    );
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    // Get all rooms this socket was in
    const rooms = Array.from(socket.rooms);

    // Decrement count for each product room
    rooms.forEach((room) => {
      if (room.startsWith("product:")) {
        const productId = room.replace("product:", "");
        const currentCount = productViewers.get(productId) || 0;
        const newCount = Math.max(0, currentCount - 1);

        if (newCount === 0) {
          productViewers.delete(productId);
          // Optionally clear stock tracking when no viewers
          // productAvailableStock.delete(productId);
        } else {
          productViewers.set(productId, newCount);
        }

        // Emit updated count to remaining viewers
        io.to(room).emit("viewerCountUpdate", {
          productId,
          viewerCount: newCount,
        });
      }
    });
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "E-commerce API is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Socket.IO server is ready`);
});
