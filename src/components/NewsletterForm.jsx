// src/components/NewsletterForm.jsx
import React, { useState } from "react";

const EMAIL_KEY = "mystore_newsletter_email";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterForm({
  placeholder = "Enter your email",
  className = "",
  onSuccessUrl = null,
}) {
  const [email, setEmail] = useState(
    () => localStorage.getItem(EMAIL_KEY) || ""
  );
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e?.preventDefault();
    setMessage("");

    const value = (email || "").trim();
    if (!EMAIL_REGEX.test(value)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("sending");

    try {
      // Try calling backend endpoint if present
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });

      if (!res.ok) {
        // if backend returned error, fallback to storing locally
        const text = (await res.json()).error || "Subscription failed";
        console.warn("Subscribe API error:", text);
        // fallback to localStorage
        localStorage.setItem(EMAIL_KEY, value);
        setStatus("success");
        setMessage("Subscribed locally (backend failed).");
      } else {
        // success
        localStorage.setItem(EMAIL_KEY, value);
        setStatus("success");
        setMessage("Thanks — you’re subscribed!");
        // optional redirect after subscribe (e.g., special coupon page)
        if (onSuccessUrl) {
          window.location.href = onSuccessUrl;
        }
      }
    } catch (err) {
      // network error — fallback to local storage
      console.error(err);
      localStorage.setItem(EMAIL_KEY, value);
      setStatus("success");
      setMessage("Subscribed locally (offline).");
    }

    // clear success message after a while
    setTimeout(() => {
      setMessage("");
      if (status === "success") setStatus("idle");
    }, 3500);
  }

    return (
        <form
            onSubmit={handleSubmit}
            className={`flex items-center gap-2 ${className}`}
        >
            <input
                type="email"
                aria-label="Email for newsletter"
                placeholder={placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 rounded-l-md border focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
                type="submit"
                disabled={status === "sending"}
                className={`px-4 py-2 rounded-r-md text-white ${status === "sending"
                        ? "bg-gray-400"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
            >
                {status === "sending" ? "Subscribing..." : "Subscribe"}
            </button>

            {/* feedback */}
            {message && (
                <div
                    className={`ml-3 text-sm ${status === "error" ? "text-red-600" : "text-green-600"
                        }`}
                >
                    {message}
                </div>
            )}
        </form>
    );
}
