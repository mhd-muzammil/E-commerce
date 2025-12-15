import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 2500);
    setForm({ name: "", email: "", message: "" });
  }

    return (
        <div className="container max-w-2xl">
            <h1 className="text-2xl font-semibold mb-4">Contact Us</h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-lg p-6 shadow-sm grid gap-4"
            >
                <label className="flex flex-col">
                    <span className="text-sm text-gray-600">Name</span>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="border rounded px-3 py-2"
                    />
                </label>

                <label className="flex flex-col">
                    <span className="text-sm text-gray-600">Email</span>
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="border rounded px-3 py-2"
                    />
                </label>

                <label className="flex flex-col">
                    <span className="text-sm text-gray-600">Message</span>
                    <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        className="border rounded px-3 py-2 h-32"
                    />
                </label>

                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        We'll respond within 1-2 business days.
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                    >
                        {sent ? "Sent!" : "Send"}
                    </button>
                </div>
            </form>
        </div>
    );
}
