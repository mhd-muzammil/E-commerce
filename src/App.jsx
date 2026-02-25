import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Product from "./pages/Product";
import ProductDetails from "./components/ProductDetails";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import AddProduct from "./pages/AddProduct";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EditProduct from "./pages/EditProduct";
import ProtectedRoute from "./components/ProtectedRoute";
import io from 'socket.io-client';
import axios from "axios";
import { BASE_URL } from "./utils/constants";

const socket = io("http://localhost:5000");

function AppRoutes() {

  const [visitorCount, setVisitorCount] = useState(null);

  useEffect(() => {
    const fetchAndIncrement = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/stats/getVisitors`);
        setVisitorCount(res.data.count);
        await axios.post(`${BASE_URL}/stats/increment`);
      } catch (err) {
        console.error("Visitor count error:", err);
      }
    };

    fetchAndIncrement();

    socket.on("visitorCount", (count) => {
      setVisitorCount(count);
    });

    return () => socket.off("visitorCount");
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Product />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route path="/contact" element={<Contact />} />
      <Route
        path="/add-product"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AddProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-product/:id"
        element={
          <ProtectedRoute requireAdmin={true}>
            <EditProduct />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Header always visible */}
      <Navbar />

      {/* Page content changes here */}
      <main className="flex-1 py-8">
        <AppRoutes />
      </main>

      {/* Footer always visible */}
      <Footer />
    </div>
  );
}
