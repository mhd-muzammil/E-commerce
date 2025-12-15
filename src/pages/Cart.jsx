import React from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ added useNavigate
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, updateQty, removeFromCart, clearCart, itemsCount, subtotal } =
    useCart();
  const navigate = useNavigate(); // ✅ hook for navigation

  return (
    <div className="container">
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="bg-white rounded-lg p-6 shadow-sm text-center">
          <p className="text-gray-600">Your cart is empty.</p>
          <div className="mt-4">
            <Link
              to="/products"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Shop Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => {
              const itemId = item._id || item.id;
              return (
                <div
                  key={itemId}
                  className="flex items-center gap-4 bg-white p-4 rounded shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <div className="text-sm text-gray-600">
                      ₹{item.price} each
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => updateQty(itemId, item.qty - 1)}
                        className="px-2 py-1 border rounded"
                      >
                        -
                      </button>
                      <div className="px-3 py-1 border rounded">{item.qty}</div>
                      <button
                        onClick={() => updateQty(itemId, item.qty + 1)}
                        className="px-2 py-1 border rounded"
                      >
                        +
                      </button>

                      <button
                        onClick={() => removeFromCart(itemId)}
                        className="text-sm text-red-600 hover:underline ml-4"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold">
                      ₹{(Number(item.price) * item.qty).toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-between items-center">
              <button
                onClick={() => clearCart()}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Clear Cart
              </button>
              <div className="text-sm text-gray-600">{itemsCount} item(s)</div>
            </div>
          </div>

          {/* Order Summary */}
          <aside className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-semibold">Order Summary</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{subtotal}</span>
                </div>

                {/* ✅ Checkout button navigates to /checkout */}
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full mt-3 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
