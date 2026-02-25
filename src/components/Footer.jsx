import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-10">
            {/* Top Section */}
            <div className="container grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
                {/* Brand Info */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">RajanStore</h2>
                    <p className="text-sm leading-relaxed">
                        Shop the latest trends and products from top brands — at unbeatable
                        prices.
                    </p>
                    <p className="text-sm mt-4 text-gray-400">
                        Crafted with ❤️ using React + Tailwind
                    </p>
                </div>

                {/* Shop Links */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Shop</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/products" className="hover:text-indigo-400">
                                All Products
                            </Link>
                        </li>
                        <li>
                            <Link to="/cart" className="hover:text-indigo-400">
                                Your Cart
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:text-indigo-400">
                                Contact Us
                            </Link>
                        </li>
                        <li>
                            <a href="#" className="hover:text-indigo-400">
                                Gift Cards
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Support Links */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Support</h3>
                    <ul className="space-y-2">
                        <li>
                            <a href="#" className="hover:text-indigo-400">
                                Help Center
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-indigo-400">
                                Returns & Refunds
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-indigo-400">
                                Shipping Info
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-indigo-400">
                                Terms of Service
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Subscribe</h3>
                    <p className="text-sm mb-3">
                        Get exclusive deals and product updates straight to your inbox.
                    </p>
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="flex items-center"
                    >
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 rounded-l-md text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700"></div>

            {/* Bottom Section */}
            <div className="container flex flex-col md:flex-row items-center justify-between py-4 text-sm text-gray-400">
                <p>© {new Date().getFullYear()} MyStore. All rights reserved.</p>

                <div className="flex gap-4 mt-3 md:mt-0">
                    <a href="#" className="hover:text-indigo-400">
                        Facebook
                    </a>
                    <a href="#" className="hover:text-indigo-400">
                        Instagram
                    </a>
                    <a href="#" className="hover:text-indigo-400">
                        Twitter
                    </a>
                    <a href="#" className="hover:text-indigo-400">
                        YouTube
                    </a>
                </div>
            </div>
        </footer>
    );
}
