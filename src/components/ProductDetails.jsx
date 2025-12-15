import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProducts } from "../context/productsContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/authContext";
import { getSocket } from "../utils/socket";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart, updateQty, removeFromCart } = useCart();
  const { products, loading, fetchProducts } = useProducts();
  const { isAdmin, token } = useAuth();
  const [viewerCount, setViewerCount] = useState(0);
  const [availableStock, setAvailableStock] = useState(0);

  // Find the product based on ID (support both _id and id)
  const product = products.find((p) => (p._id || p.id).toString() === id);

  // Find product in cart and get quantity
  const productId = product ? product._id || product.id : null;
  const cartItem = productId
    ? cart.find((item) => {
        const itemId = item._id || item.id;
        return itemId && itemId.toString() === productId.toString();
      })
    : null;
  const cartQuantity = cartItem ? cartItem.qty : 0;

  if (loading) {
    return (
      <div className="container text-center py-20">
        <div>Loading product...</div>
      </div>
    );
  }

  // Calculate available stock (original stock - items in cart)
  useEffect(() => {
    if (product) {
      const originalStock = product.stock !== undefined ? product.stock : 0;
      const newAvailableStock = Math.max(0, originalStock - cartQuantity);
      setAvailableStock(newAvailableStock);
    }
  }, [product, cartQuantity]);

  // Socket.IO setup for live viewers and stock updates
  useEffect(() => {
    if (!product || !id) return;

    const socketInstance = getSocket();

    // Join product room when component mounts
    socketInstance.emit("joinProductRoom", id);

    // Listen for viewer count updates
    const handleViewerCountUpdate = (data) => {
      if (data.productId === id) {
        setViewerCount(data.viewerCount);
      }
    };

    // Listen for stock updates from other users
    const handleStockUpdate = (data) => {
      if (data.productId === id) {
        // Update available stock from broadcast
        // This gives us a sense of what others are seeing
        // But we'll recalculate based on our own cart
        const originalStock = product.stock !== undefined ? product.stock : 0;
        const ourAvailableStock = Math.max(0, originalStock - cartQuantity);
        // Use the minimum to show most conservative estimate
        const minStock = Math.min(
          ourAvailableStock,
          data.availableStock || ourAvailableStock
        );
        setAvailableStock(minStock);
      }
    };

    socketInstance.on("viewerCountUpdate", handleViewerCountUpdate);
    socketInstance.on("stockUpdate", handleStockUpdate);

    // Cleanup on unmount
    return () => {
      if (socketInstance && id) {
        socketInstance.emit("leaveProductRoom", id);
        socketInstance.off("viewerCountUpdate", handleViewerCountUpdate);
        socketInstance.off("stockUpdate", handleStockUpdate);
      }
    };
  }, [id, product]);

  // Emit stock update when cart quantity changes
  useEffect(() => {
    if (!product || !id) return;

    const socketInstance = getSocket();
    const originalStock = product.stock !== undefined ? product.stock : 0;
    const newAvailableStock = Math.max(0, originalStock - cartQuantity);

    // Emit stock update to all viewers
    socketInstance.emit("updateProductStock", {
      productId: id,
      availableStock: newAvailableStock,
    });
  }, [cartQuantity, id, product]);

  if (!product) {
    return (
      <div className="container text-center py-20">
        <h1 className="text-3xl font-semibold mb-4">Product Not Found</h1>
        <Link to="/products" className="text-indigo-600 underline">
          Go Back to Products
        </Link>
      </div>
    );
  }

  // Render viewer count message
  const renderViewerCount = () => {
    if (viewerCount > 1) {
      return `🔥 ${viewerCount} people are viewing this product right now`;
    } else if (viewerCount === 1) {
      return "🔥 1 person is viewing this product right now";
    }
    return null; // Hide if no viewers
  };

  // Render stock message (using available stock)
  const renderStockMessage = () => {
    if (availableStock > 10) {
      return <span className="text-green-600 font-medium">In stock</span>;
    } else if (availableStock >= 1 && availableStock <= 10) {
      return (
        <span className="text-orange-600 font-medium">
          Only {availableStock} left in stock – order soon
        </span>
      );
    } else {
      return <span className="text-red-600 font-medium">Out of stock</span>;
    }
  };

  // Handle quantity changes
  const handleIncreaseQty = () => {
    if (availableStock > 0) {
      if (cartItem) {
        updateQty(productId, cartQuantity + 1);
      } else {
        addToCart(product, 1);
      }
    }
  };

  const handleDecreaseQty = () => {
    if (cartQuantity > 1) {
      updateQty(productId, cartQuantity - 1);
    } else if (cartQuantity === 1) {
      removeFromCart(productId);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${product.title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete product");
      }

      // Refresh products and navigate
      await fetchProducts();
      navigate("/products");
    } catch (error) {
      alert(error.message || "Failed to delete product");
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="container py-10">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="bg-white shadow rounded-lg overflow-hidden flex justify-center items-center">
          <img
            src={product.image}
            alt={product.title}
            className="object-cover w-full max-h-[500px]"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {product.title}
          </h1>
          <p className="text-gray-500 mb-4">{product.description}</p>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl font-semibold text-indigo-600">
              ₹{product.price}
            </span>
            <span className="text-green-600 font-medium">
              {product.discount}% OFF
            </span>
          </div>

          {/* Stock Status */}
          <div className="mb-4">{renderStockMessage()}</div>

          {/* Live Viewers */}
          {renderViewerCount() && (
            <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
              {renderViewerCount()}
            </div>
          )}

          {/* Quantity Controls */}
          {cartQuantity > 0 ? (
            <div className="mb-4 flex items-center gap-4">
              <div className="flex items-center gap-2 border rounded-lg p-2">
                <button
                  onClick={handleDecreaseQty}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-lg font-semibold"
                >
                  -
                </button>
                <span className="px-4 py-1 text-lg font-semibold min-w-[3rem] text-center">
                  {cartQuantity}
                </span>
                <button
                  onClick={handleIncreaseQty}
                  disabled={availableStock === 0}
                  className={`px-3 py-1 rounded text-lg font-semibold ${
                    availableStock === 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(productId)}
                className="text-sm text-red-600 hover:text-red-700 underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              onClick={handleIncreaseQty}
              disabled={availableStock === 0}
              className={`mb-4 px-6 py-3 rounded-lg transition ${
                availableStock === 0
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {availableStock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          )}

          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/products"
              className="text-gray-700 underline hover:text-indigo-600"
            >
              Back to Products
            </Link>

            {isAdmin() && (
              <>
                <button
                  onClick={() => navigate(`/edit-product/${id}`)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                >
                  Edit Product
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete Product
                </button>
              </>
            )}
          </div>

          <div className="mt-10 border-t pt-6">
            <h2 className="text-lg font-semibold mb-2">Product Details</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Category: {product.category}</li>
              <li>Rating: ⭐ {product.rating || "4.3"}</li>
              <li>Available Offers: Free Delivery, Easy Returns</li>
              <li>Secure Payment via Trusted Gateways</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
