import React from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/productsContext";
import ProductCard from "../components/ProductCard";
import NewsletterForm from "../components/NewsletterForm";

const categories = [
  { id: 1, name: "Electronics", icon: "🔌" },
  { id: 2, name: "Fashion", icon: "👕" },
  { id: 3, name: "Home", icon: "🏠" },
  { id: 4, name: "Beauty", icon: "💄" },
  { id: 5, name: "Toys", icon: "🧸" },
];

const testimonials = [
  {
    id: 1,
    name: "Ravi K.",
    text: "Great prices and fast delivery. Loved the UI!",
  },
  {
    id: 2,
    name: "Anita S.",
    text: "Easy checkout and the product quality was excellent.",
  },
  {
    id: 3,
    name: "Rahul P.",
    text: "Customer support helped me quickly. Recommended.",
  },
];

export default function Home() {
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  const featured = products.slice(0, 8);
  const deals = products.slice(0, 6);

  return (
    <div className="container">
      {/* HERO */}
      <section className="grid md:grid-cols-2 gap-8 items-center py-8">
        <div>
          <div className="inline-flex items-center gap-3 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm mb-4">
            <span className="font-semibold">Hot</span> Up to 50% off
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Find everything you need <br className="hidden md:inline" />
            at unbeatable prices.
          </h1>

          <p className="mt-4 text-gray-700 max-w-xl">
            Shop electronics, fashion, home essentials and more. Curated deals,
            trusted sellers, and fast delivery all in one place.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/products" className="btn btn-primary">
              Shop Deals
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Get Help
            </Link>
            <a
              href="#deals"
              className="text-sm self-center text-gray-600 hover:text-indigo-600"
            >
              See today's deals →
            </a>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-white rounded shadow-sm">
              <div className="text-sm text-gray-500">Free Delivery</div>
              <div className="font-semibold">From ₹499</div>
            </div>
            <div className="p-3 bg-white rounded shadow-sm">
              <div className="text-sm text-gray-500">Easy Returns</div>
              <div className="font-semibold">15 days</div>
            </div>
            <div className="p-3 bg-white rounded shadow-sm">
              <div className="text-sm text-gray-500">Secure Payment</div>
              <div className="font-semibold">Trusted gateways</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2lyZWxlc3MlMjBoZWFkcGhvbmVzfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500"
              alt="Hero banner"
              className="w-full h-72 md:h-96 object-cover"
            />
          </div>

          {/* floating promo card */}
          <div className="absolute left-4 bottom-4 bg-white p-4 rounded-lg shadow-md w-64">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">Deal of the hour</div>
                <div className="font-semibold">Combo Wireless Headphones</div>
                <div className="text-sm text-green-600 mt-1">
                  ₹4,499 — 30% off
                </div>
              </div>
              <div className="ml-3">
                <button className="px-3 py-2 bg-indigo-600 text-white rounded">
                  Buy
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-6">
        <h2 className="text-2xl font-semibold mb-4">Shop by category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/products"
              className="bg-white p-4 rounded-lg flex flex-col items-center justify-center text-center hover:shadow-md transition product-card"
            >
              <div className="text-3xl mb-2">{c.icon}</div>
              <div className="font-medium">{c.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* DEALS CAROUSEL */}
      <section id="deals" className="py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Deals of the Day</h2>
          <Link
            to="/products"
            className="text-sm text-indigo-600 hover:underline"
          >
            View all deals
          </Link>
        </div>

        <div className="relative">
          <div className="overflow-x-auto no-scrollbar -mx-3 px-3">
            <div className="flex gap-4">
              {deals.map((d) => (
                <article
                  key={d.id}
                  className="min-w-[220px] bg-white rounded-lg p-3 shadow-sm flex-shrink-0"
                >
                  <div className="w-full h-40 rounded overflow-hidden">
                    <img
                      src={d.image}
                      alt={d.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="mt-3 font-medium text-sm line-clamp-2">
                    {d.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <div className="text-lg font-semibold">₹{d.price}</div>
                      <div className="text-xs text-green-600">
                        {d.discount}% OFF
                      </div>
                    </div>
                    <button className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm">
                      Add
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED GRID */}
      <section className="py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Featured products</h2>
          <Link
            to="/products"
            className="text-sm text-indigo-600 hover:underline"
          >
            See all
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map((p) => (
            <ProductCard key={p._id || p.id} p={p} />
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-8 bg-white rounded-lg p-6 shadow-sm mt-8">
        <h2 className="text-2xl font-semibold mb-4">What shoppers say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div key={t.id} className="p-4 border rounded">
              <div className="text-gray-700">“{t.text}”</div>
              <div className="mt-3 font-semibold">{t.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER CTA */}
      <section className="py-10 mt-8 bg-indigo-700 rounded-lg text-white">
        <div className="grid md:grid-cols-2 items-center gap-6 container">
          <div>
            <h3 className="text-2xl font-semibold">Subscribe & get 10% off</h3>
            <p className="mt-2 text-indigo-100">
              Sign up for exclusive offers and early access to new products.
            </p>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center gap-2 max-w-md"
          >
            {/* <button className="px-4 py-2 bg-white text-indigo-700 rounded-r-md">
                Subscribe
              </button> */}
            <NewsletterForm
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-l-md text-gray-800"
            />
          </form>
        </div>
      </section>
    </div>
  );
}

// export default function Home() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:5000/api/products")
//       .then(res => setProducts(res.data))
//       .catch(err => console.log(err));
//   }, []);
