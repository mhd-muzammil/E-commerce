import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  function handleSearchSubmit(e) {
    e?.preventDefault();
    const q = (query || "").trim();
    if (q) navigate(`/products?q=${encodeURIComponent(q)}`);
    else navigate("/products");
    // close mobile menu on search
    setMenuOpen(false);
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-indigo-600 tracking-wide"
        >
          RajanStore
        </Link>

        {/* Search bar (Desktop only) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 mx-8"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search for products, brands and more"
            className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700"
          >
            🔍
          </button>
        </form>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:text-indigo-600 ${
                isActive ? "text-indigo-600 font-semibold" : "text-gray-700"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `hover:text-indigo-600 ${
                isActive ? "text-indigo-600 font-semibold" : "text-gray-700"
              }`
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `hover:text-indigo-600 ${
                isActive ? "text-indigo-600 font-semibold" : "text-gray-700"
              }`
            }
          >
            Contact
          </NavLink>

          {isAdmin() && (
            <NavLink
              to="/add-product"
              className={({ isActive }) =>
                `hover:text-indigo-600 ${
                  isActive ? "text-indigo-600 font-semibold" : "text-gray-700"
                }`
              }
            >
              Add Product
            </NavLink>
          )}

          {isAuthenticated() ? (
            <>
              <Link
                to="/cart"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                🛒 Cart
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700">
                  {user?.name}
                  {isAdmin() && (
                    <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                      Admin
                    </span>
                  )}
                </span>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-gray-700 hover:text-indigo-600"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Sign Up
              </Link>
              
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 border rounded text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <div className="container flex flex-col py-4 space-y-4">
            {/* mobile search */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 border rounded px-3 py-2"
                placeholder="Search products..."
              />
              <button
                type="submit"
                className="px-3 py-2 bg-indigo-600 text-white rounded"
              >
                Go
              </button>
            </form>

            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-indigo-600"
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-indigo-600"
            >
              Products
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-indigo-600"
            >
              Contact
            </NavLink>
            {isAdmin() && (
              <NavLink
                to="/add-product"
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 hover:text-indigo-600"
              >
                Add Product
              </NavLink>
            )}
            {isAuthenticated() ? (
              <>
                <Link
                  to="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-center"
                >
                  🛒 Cart
                </Link>
                <div className="pt-2 border-t">
                  <div className="text-sm text-gray-700 mb-2">
                    {user?.name}
                    {isAdmin() && (
                      <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                        Admin
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                      navigate("/");
                    }}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-center"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
