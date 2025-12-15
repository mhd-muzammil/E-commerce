import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

/**
 * Checkout page (UI-only / mock payments)
 * - Validates basic shipping info
 * - Lets user choose shipping & payment method
 * - Simulates placing the order, clears cart, and shows confirmation
 */

export default function Checkout() {
  const { cart, subtotal, itemsCount, clearCart } = useCart();
  const navigate = useNavigate();

  const [billing, setBilling] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [shippingMethod, setShippingMethod] = useState("standard"); // standard | express
  const [paymentMethod, setPaymentMethod] = useState("cod"); // cod | card | razorpay (mock)
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvv: "" });
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [errors, setErrors] = useState({});

  const shippingCost = useMemo(
    () => (shippingMethod === "express" ? 149 : 49),
    [shippingMethod]
  );
  const total = useMemo(
    () => (Number(subtotal) + shippingCost).toFixed(2),
    [subtotal, shippingCost]
  );

  function handleChange(e) {
    setBilling((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  function handleCardChange(e) {
    setCard((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  function validate() {
    const err = {};
    if (!billing.name.trim()) err.name = "Name is required";
    if (!billing.email.trim() || !/^\S+@\S+\.\S+$/.test(billing.email))
      err.email = "Valid email required";
    if (!billing.address.trim()) err.address = "Address is required";
    if (!billing.city.trim()) err.city = "City is required";
    if (!billing.zip.trim()) err.zip = "Postal code is required";
    if (itemsCount === 0) err.cart = "Your cart is empty";

    if (paymentMethod === "card") {
      if (!card.number.trim() || card.number.replace(/\s+/g, "").length < 12)
        err.card = "Valid card number required";
      if (!card.name.trim()) err.cardName = "Name on card required";
      if (!card.exp.trim()) err.cardExp = "Expiry required";
      if (!card.cvv.trim() || card.cvv.length < 3) err.cardCvv = "CVV required";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);

    // Simulate network call / payment processing
    await new Promise((r) => setTimeout(r, 1200));

    // Mock order id
    const orderId = "ORD-" + Date.now().toString(36).toUpperCase().slice(-8);

    const orderPayload = {
      id: orderId,
      items: cart,
      subtotal: Number(subtotal),
      shipping: shippingCost,
      total: Number(total),
      billing,
      shippingMethod,
      paymentMethod,
      placedAt: new Date().toISOString(),
    };

    // In real app: send orderPayload to backend API
    // e.g. await fetch('/api/orders', { method: 'POST', body: JSON.stringify(orderPayload) })

    // Clear cart locally
    clearCart();

    setOrder(orderPayload);
    setLoading(false);

    // Optionally navigate to a /order/:id page instead:
    // navigate(`/order/${orderId}`);
  }

  if (itemsCount === 0 && !order) {
    return (
      <div className="container py-12">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600">
            Add items to cart before checking out.
          </p>
          <div className="mt-4">
            <Link to="/products" className="btn btn-primary">
              Shop Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (order) {
      return (
          <div className="container py-12">
              <div className="bg-white rounded-lg p-8 shadow">
                  <h2 className="text-2xl font-semibold mb-4">
                      Order placed successfully 🎉
                  </h2>
                  <p className="text-gray-700">
                      Your order <strong>{order.id}</strong> has been placed.
                  </p>

                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                      <div>
                          <h3 className="font-semibold">Shipping to</h3>
                          <div className="text-gray-700 mt-2">
                              {order.billing.name}
                              <br />
                              {order.billing.address}
                              <br />
                              {order.billing.city} — {order.billing.zip}
                              <br />
                              {order.billing.state}
                              <br />
                              {order.billing.phone} • {order.billing.email}
                          </div>
                      </div>

                      <div>
                          <h3 className="font-semibold">Order summary</h3>
                          <div className="mt-2 text-gray-700">
                              <div className="flex justify-between">
                                  <span>Items</span>
                                  <span>{order.items.length}</span>
                              </div>
                              <div className="flex justify-between">
                                  <span>Subtotal</span>
                                  <span>₹{order.subtotal.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                  <span>Shipping</span>
                                  <span>₹{order.shipping.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between font-semibold mt-2">
                                  <span>Total</span>
                                  <span>₹{order.total.toFixed(2)}</span>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                      <Link to="/" className="btn btn-outline">
                          Continue Shopping
                      </Link>
                      <a className="btn btn-primary" href="#">
                          Download Invoice (mock)
                      </a>
                  </div>
              </div>
          </div>
      );
  }

  // Checkout form
    return (
        <div className="container py-12">
            <div className="grid md:grid-cols-3 gap-8">
                {/* Left: form */}
                <form
                    onSubmit={handlePlaceOrder}
                    className="md:col-span-2 bg-white p-6 rounded shadow space-y-4"
                >
                    <h2 className="text-xl font-semibold">Shipping & Billing</h2>

                    {/* simple errors */}
                    {errors.cart && <div className="text-red-600">{errors.cart}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label className="flex flex-col">
                            <span className="text-sm text-gray-600">Full name</span>
                            <input
                                name="name"
                                value={billing.name}
                                onChange={handleChange}
                                className="border rounded px-3 py-2"
                            />
                            {errors.name && (
                                <small className="text-red-600">{errors.name}</small>
                            )}
                        </label>

                        <label className="flex flex-col">
                            <span className="text-sm text-gray-600">Email</span>
                            <input
                                name="email"
                                value={billing.email}
                                onChange={handleChange}
                                className="border rounded px-3 py-2"
                            />
                            {errors.email && (
                                <small className="text-red-600">{errors.email}</small>
                            )}
                        </label>

                        <label className="flex flex-col md:col-span-2">
                            <span className="text-sm text-gray-600">Address</span>
                            <input
                                name="address"
                                value={billing.address}
                                onChange={handleChange}
                                className="border rounded px-3 py-2"
                            />
                            {errors.address && (
                                <small className="text-red-600">{errors.address}</small>
                            )}
                        </label>

                        <label className="flex flex-col">
                            <span className="text-sm text-gray-600">City</span>
                            <input
                                name="city"
                                value={billing.city}
                                onChange={handleChange}
                                className="border rounded px-3 py-2"
                            />
                            {errors.city && (
                                <small className="text-red-600">{errors.city}</small>
                            )}
                        </label>

                        <label className="flex flex-col">
                            <span className="text-sm text-gray-600">State</span>
                            <input
                                name="state"
                                value={billing.state}
                                onChange={handleChange}
                                className="border rounded px-3 py-2"
                            />
                        </label>

                        <label className="flex flex-col">
                            <span className="text-sm text-gray-600">ZIP / Postal code</span>
                            <input
                                name="zip"
                                value={billing.zip}
                                onChange={handleChange}
                                className="border rounded px-3 py-2"
                            />
                            {errors.zip && (
                                <small className="text-red-600">{errors.zip}</small>
                            )}
                        </label>

                        <label className="flex flex-col">
                            <span className="text-sm text-gray-600">Phone</span>
                            <input
                                name="phone"
                                value={billing.phone}
                                onChange={handleChange}
                                className="border rounded px-3 py-2"
                            />
                        </label>
                    </div>

                    {/* Shipping method */}
                    <div>
                        <h3 className="font-semibold mt-2">Shipping method</h3>
                        <div className="flex gap-3 mt-2">
                            <label
                                className={`px-3 py-2 border rounded ${shippingMethod === "standard" ? "bg-gray-100" : ""
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="ship"
                                    checked={shippingMethod === "standard"}
                                    onChange={() => setShippingMethod("standard")}
                                />{" "}
                                <span className="ml-2">Standard (₹49)</span>
                            </label>

                            <label
                                className={`px-3 py-2 border rounded ${shippingMethod === "express" ? "bg-gray-100" : ""
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="ship"
                                    checked={shippingMethod === "express"}
                                    onChange={() => setShippingMethod("express")}
                                />{" "}
                                <span className="ml-2">Express (₹149)</span>
                            </label>
                        </div>
                    </div>

                    {/* Payment method */}
                    <div>
                        <h3 className="font-semibold mt-4">Payment</h3>

                        <div className="flex flex-col gap-2 mt-2">
                            <label
                                className={`px-3 py-2 border rounded ${paymentMethod === "cod" ? "bg-gray-50" : ""
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === "cod"}
                                    onChange={() => setPaymentMethod("cod")}
                                />{" "}
                                <span className="ml-2">Cash on Delivery</span>
                            </label>

                            <label
                                className={`px-3 py-2 border rounded ${paymentMethod === "card" ? "bg-gray-50" : ""
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === "card"}
                                    onChange={() => setPaymentMethod("card")}
                                />{" "}
                                <span className="ml-2">Pay with Card</span>
                            </label>

                            <label
                                className={`px-3 py-2 border rounded ${paymentMethod === "razor" ? "bg-gray-50" : ""
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === "razor"}
                                    onChange={() => setPaymentMethod("razor")}
                                />{" "}
                                <span className="ml-2">Razorpay (mock)</span>
                            </label>
                        </div>

                        {/* show card fields conditionally (mock only) */}
                        {paymentMethod === "card" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                <input
                                    name="number"
                                    value={card.number}
                                    onChange={handleCardChange}
                                    placeholder="Card number"
                                    className="border rounded px-3 py-2"
                                />
                                <input
                                    name="name"
                                    value={card.name}
                                    onChange={handleCardChange}
                                    placeholder="Name on card"
                                    className="border rounded px-3 py-2"
                                />
                                <input
                                    name="exp"
                                    value={card.exp}
                                    onChange={handleCardChange}
                                    placeholder="MM/YY"
                                    className="border rounded px-3 py-2"
                                />
                                <input
                                    name="cvv"
                                    value={card.cvv}
                                    onChange={handleCardChange}
                                    placeholder="CVV"
                                    className="border rounded px-3 py-2"
                                />
                                {errors.card && (
                                    <div className="text-red-600">{errors.card}</div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-gray-600">
                            By placing an order you agree to our Terms of Service.
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-5 py-2 rounded ${loading
                                        ? "bg-gray-400 text-white"
                                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                                    }`}
                            >
                                {loading ? "Placing order..." : `Place order • ₹${total}`}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Right: order summary */}
                <aside className="bg-white p-6 rounded shadow space-y-4">
                    <h3 className="text-lg font-semibold">Order summary</h3>

                    <div className="space-y-3">
                        {cart.map((item) => (
                            <div key={item.id} className="flex items-start gap-3">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <div className="font-medium">{item.title}</div>
                                    <div className="text-sm text-gray-500">Qty: {item.qty}</div>
                                </div>
                                <div className="font-medium">
                                    ₹{(Number(item.price) * item.qty).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-3 text-sm text-gray-700">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>₹{Number(subtotal).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>₹{shippingCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold mt-2">
                            <span>Total</span>
                            <span>₹{total}</span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
