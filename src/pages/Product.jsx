import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useProducts } from "../context/productsContext";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const { products, loading, fetchProducts } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read params
  const categoryParam = searchParams.get("category") || ""; // comma-separated
  const sortParam = searchParams.get("sort") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const qParam = (searchParams.get("q") || "").trim(); // search query

  // derived state: selected categories (array)
  const selectedCategories = useMemo(() => {
    if (!categoryParam) return [];
    return categoryParam
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
  }, [categoryParam]);

  const [page, setPage] = useState(pageParam);
  const perPage = 8;

  // build unique categories
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category || "Uncategorized"));
    return ["All", ...Array.from(set)];
  }, []);

  // search helper
  function matchesSearch(item, q) {
    if (!q) return true;
    const s = q.toLowerCase();
    return (
      (item.title || "").toLowerCase().includes(s) ||
      (item.description || "").toLowerCase().includes(s) ||
      (item.category || "").toLowerCase().includes(s)
    );
  }

  // filtered list using multi-select + search
  const filtered = useMemo(() => {
    let list = products.slice();

    if (selectedCategories.length > 0) {
      list = list.filter((p) =>
        selectedCategories.some(
          (cat) => (p.category || "").toLowerCase() === cat.toLowerCase()
        )
      );
    }

    // apply search filter (works whether or not categories selected)
    if (qParam) {
      list = list.filter((p) => matchesSearch(p, qParam));
    }

    // sorting
    if (sortParam === "price-asc") {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortParam === "price-desc") {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortParam === "discount") {
      list.sort((a, b) => Number(b.discount) - Number(a.discount));
    }

    return list;
  }, [selectedCategories, sortParam, qParam]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  // helpers to sync URL
  function setCategoriesArray(arr) {
    const params = Object.fromEntries([...searchParams]);
    if (!arr || arr.length === 0) {
      delete params.category;
    } else {
      params.category = arr.join(",");
    }
    params.page = 1;
    setSearchParams(params);
    setPage(1);
  }

  function toggleCategory(cat) {
    if (cat === "All") {
      setCategoriesArray([]);
      return;
    }

    const exists = selectedCategories.find(
      (c) => c.toLowerCase() === cat.toLowerCase()
    );
    if (exists) {
      const next = selectedCategories.filter(
        (c) => c.toLowerCase() !== cat.toLowerCase()
      );
      setCategoriesArray(next);
    } else {
      const next = [...selectedCategories, cat];
      setCategoriesArray(next);
    }
  }

  function setSort(s) {
    const params = Object.fromEntries([...searchParams]);
    if (!s) delete params.sort;
    else params.sort = s;
    params.page = 1;
    setSearchParams(params);
    setPage(1);
  }

  function gotoPage(p) {
    const params = Object.fromEntries([...searchParams]);
    params.page = p;
    setSearchParams(params);
    setPage(p);
    window.scrollTo({ top: 200, behavior: "smooth" });
  }

  // If q param changes externally (from Header navigation), reset page
  useEffect(() => {
    setPage(1);
  }, [qParam, categoryParam, sortParam]); // reset when these change

  // convenience: is a category active
  function isActive(cat) {
    if (cat === "All") return selectedCategories.length === 0;
    return selectedCategories.some(
      (c) => c.toLowerCase() === cat.toLowerCase()
    );
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          {qParam && (
            <div className="text-sm text-gray-500 mt-1">
              Search results for: <strong>{qParam}</strong>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Sort by</label>
          <select
            value={sortParam}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="">Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="discount">Discount: High → Low</option>
          </select>
        </div>
      </div>

      {/* category chips (multi-select) */}
      <div className="mb-6 flex flex-wrap gap-3">
        {categories.map((c) => {
          const active = isActive(c);
          return (
            <button
              key={c}
              onClick={() => toggleCategory(c)}
              className={`px-4 py-2 rounded-md border ${
                active
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-700"
              }`}
            >
              {c}
            </button>
          );
        })}

        <button
          onClick={() => {
            setSearchParams({});
            setPage(1);
            navigate("/products");
          }}
          className="px-3 py-2 rounded-md border bg-white text-sm text-gray-600"
        >
          Reset
        </button>
      </div>

      {/* product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {current.map((p) => (
          <ProductCard
            key={p._id || p.id}
            p={p}
            onDelete={async (productId) => {
              await fetchProducts();
            }}
          />
        ))}
      </div>

      {/* pagination */}
      <div className="flex items-center justify-center gap-2 mt-8">
        <button
          onClick={() => gotoPage(Math.max(1, page - 1))}
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page === 1}
        >
          Prev
        </button>

        {Array.from({ length: pages }).map((_, i) => (
          <button
            key={i}
            onClick={() => gotoPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              page === i + 1 ? "bg-indigo-600 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => gotoPage(Math.min(pages, page + 1))}
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page === pages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
