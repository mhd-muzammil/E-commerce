import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/authContext";

const PLACEHOLDER = "https://via.placeholder.com/600x400?text=No+Image";

/**
 * Normalize image URL:
 * - return placeholder if missing
 * - ensure https protocol for mixed-content issues
 * - add basic Unsplash params when applicable
 */
function normalizeImage(url) {
  if (!url) return PLACEHOLDER;
  try {
    // If url is relative, URL will resolve against current origin
    const u = new URL(url, window.location.origin);
    if (u.protocol === "http:") u.protocol = "https:";
    if (
      u.hostname.includes("images.unsplash.com") &&
      !u.searchParams.has("auto")
    ) {
      u.searchParams.set("auto", "format");
      u.searchParams.set("fit", "crop");
      u.searchParams.set("w", "600");
      u.searchParams.set("q", "80");
    }
    return u.toString();
  } catch (err) {
    return PLACEHOLDER;
  }
}

export default function ProductCard({ p, onDelete }) {
  const { addToCart } = useCart();
  const { isAdmin, token } = useAuth();
  const navigate = useNavigate();
  const imageSrc = normalizeImage(p?.image);
  const productId = p._id || p.id;

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      !window.confirm(
        `Are you sure you want to delete "${p.title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete product");
      }

      // Call onDelete callback if provided, otherwise reload
      if (onDelete) {
        onDelete(productId);
      } else {
        window.location.reload();
      }
    } catch (error) {
      alert(error.message || "Failed to delete product");
      console.error("Delete error:", error);
    }
  };

  return (
    <article className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition product-card">
      <Link to={`/product/${p._id || p.id}`}>
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={imageSrc}
            alt={p.title || "product"}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PLACEHOLDER;
            }}
          />
        </div>
      </Link>

      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{p.title}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {p.description}
        </p>

        <div className="flex items-center justify-between mt-4">
          <div>
            <div className="text-xl font-bold">₹{p.price}</div>
            <div className="text-xs text-green-600">{p.discount}% off</div>
          </div>

          <div className="flex flex-col gap-2">
            {!isAdmin() ? (
              <>
                <button
                  onClick={() => addToCart(p, 1)}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-sky-400 hover:text-black"
                >
                  Add
                </button>
                <Link
                  to={`/product/${p._id || p.id}`}
                  className="text-xs text-gray-600 hover:text-indigo-600"
                >
                  View
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={`/product/${p._id || p.id}`}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-md text-center text-sm"
                >
                  View
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/edit-product/${productId}`);
                  }}
                  className="px-3 py-2 bg-yellow-600 text-white rounded-md text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-2 bg-red-600 text-white rounded-md text-sm"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
