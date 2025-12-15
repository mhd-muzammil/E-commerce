import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("mystore_cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("mystore_cart", JSON.stringify(cart));
    } catch (err) {
      console.error(err);
    }
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      // Normalize product ID (support both _id and id)
      const productId = product._id || product.id;

      // Find existing product in cart using normalized ID
      const found = prev.find((p) => {
        const cartProductId = p._id || p.id;
        return (
          cartProductId &&
          productId &&
          cartProductId.toString() === productId.toString()
        );
      });

      if (found) {
        // Product already in cart, increase quantity
        return prev.map((p) => {
          const cartProductId = p._id || p.id;
          if (
            cartProductId &&
            productId &&
            cartProductId.toString() === productId.toString()
          ) {
            return { ...p, qty: p.qty + qty };
          }
          return p;
        });
      }
      // New product, add to cart with normalized ID
      return [...prev, { ...product, _id: productId, id: productId, qty }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) =>
      prev.filter((p) => {
        const productId = p._id || p.id;
        return productId && productId.toString() !== id.toString();
      })
    );
  };

  const updateQty = (id, qty) => {
    setCart((prev) =>
      prev.map((p) => {
        const productId = p._id || p.id;
        if (productId && productId.toString() === id.toString()) {
          return { ...p, qty: Math.max(1, qty) };
        }
        return p;
      })
    );
  };

  const clearCart = () => setCart([]);

  const itemsCount = cart.reduce((s, p) => s + p.qty, 0);

  const subtotal = cart
    .reduce((s, p) => s + Number(p.price) * p.qty, 0)
    .toFixed(2);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        itemsCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
