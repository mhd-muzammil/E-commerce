const products = [
  {
    id: 1,
    title: "Wireless Headphones",
    description:
      "Experience superior sound and comfort with our wireless Bluetooth headphones — 20 hours of playtime and deep bass.",
    price: 2499,
    discount: 30,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500",
  },
  {
    id: 2,
    title: "Smartwatch Pro X",
    description:
      "Track your fitness, heart rate, and notifications in style with the latest Smartwatch Pro X — water-resistant and durable.",
    price: 3999,
    discount: 25,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1719075596884-2020f827a8dd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8U21hcnR3YXRjaCUyMFBybyUyMFh8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
  },
  {
    id: 3,
    title: "Classic Cotton T-Shirt",
    description:
      "Soft and breathable 100% cotton T-shirt with a modern fit. Perfect for everyday wear and available in multiple colors.",
    price: 799,
    discount: 15,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Men’s Running Shoes",
    description:
      "Comfortable and lightweight running shoes with superior grip — ideal for gym, running, and casual use.",
    price: 1899,
    discount: 40,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cnVubmluZyUyMHNob2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
  },
  {
    id: 5,
    title: "Ceramic Coffee Mug",
    description:
      "Elegant and sturdy ceramic mug with matte finish. Holds 350ml — dishwasher and microwave safe.",
    price: 399,
    discount: 10,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1542556398-95fb5b9f9b48?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fENvZmZlZSUyME11Z3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500",
  },
  {
    id: 6,
    title: "Wooden Table Lamp",
    description:
      "Stylish bedside lamp made of oak wood and linen shade — adds warmth and style to your home.",
    price: 1499,
    discount: 20,
    category: "Home",
    image:
      "https://plus.unsplash.com/premium_photo-1682402665354-47f253ce0060?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d29vZGVuJTIwdGFibGUlMjBsYW1wfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
  },
  {
    id: 7,
    title: "Organic Face Cream",
    description:
      "Made with aloe vera and green tea extracts — hydrates and nourishes your skin naturally.",
    price: 999,
    discount: 18,
    category: "Beauty",
    image:
      "https://images.unsplash.com/photo-1695972235610-0c68661d537c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJlYXV0eSUyMHByb2R1Y3R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
  },
  {
    id: 8,
    title: "Makeup Brush Set",
    description:
      "Complete 12-piece professional makeup brush set with soft synthetic bristles for flawless application.",
    price: 1299,
    discount: 22,
    category: "Beauty",
    image:
      "https://plus.unsplash.com/premium_photo-1661726457110-c43a88d74567?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFrZXVwJTIwc2V0fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
  },
  {
    id: 9,
    title: "Toy Car Set",
    description:
      "Pack of 5 premium miniature metal cars with smooth wheels — perfect for kids and collectors alike.",
    price: 699,
    discount: 15,
    category: "Toys",
    image:
      "https://images.unsplash.com/photo-1597670250484-0e9aff7f8804?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dG95JTIwY2FyJTIwc2V0fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
  },
  {
    id: 10,
    title: "Soft Teddy Bear",
    description:
      "Adorable 18-inch teddy made with ultra-soft plush fabric — perfect gift for your loved ones.",
    price: 899,
    discount: 12,
    category: "Toys",
    image:
      "https://plus.unsplash.com/premium_photo-1725075087109-5ee07f242436?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c29mdCUyMHRlZGR5JTIwYmVhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500",
  },
  {
    id: 11,
    title: "Bluetooth Speaker",
    description:
      "Portable mini Bluetooth speaker with powerful sound and splash resistance — perfect for parties or travel.",
    price: 1999,
    discount: 35,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ymx1ZXRvb3RoJTIwc3BlYWtlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500",
  },
  {
    id: 12,
    title: "Stylish Sunglasses",
    description:
      "UV400-protected sunglasses with premium matte black frame — ideal for both men and women.",
    price: 1199,
    discount: 28,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1756725520459-b324901a56c8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHN0eWxpc2glMjBzdW5nbGFzc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500",
  },
  {
    id: 13,
    title: "Slim Fit Denim Jeans",
    description:
      "Classic slim-fit denim jeans with stretch for comfort. Durable stitching and modern wash.",
    price: 1599,
    discount: 25,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 14,
    title: "Leather Crossbody Handbag",
    description:
      "Compact leather crossbody bag with multiple compartments — perfect for daily carry and travel.",
    price: 2499,
    discount: 30,
    category: "Fashion",
    image:
      "https://media.istockphoto.com/id/2205639282/photo/quilted-crossbody-bags.webp?a=1&b=1&s=612x612&w=0&k=20&c=4pKUilzW7G_N2-YpMaCt-Imz1DaBaacbExFob9K8kdY=",
  },
  {
    id: 15,
    title: "Men’s Summer Dress",
    description:
      "Lightweight and breathable summer dress with floral print and comfortable fit.",
    price: 1299,
    discount: 20,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1692818552790-009ddba8c29f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fE1lbiUyMFN1bW1lciUyMERyZXNzfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
  },
  {
    id: 16,
    title: "Classic Leather Belt",
    description:
      "Premium leather belt with brushed metal buckle — pairs well with casual and formal wear.",
    price: 699,
    discount: 10,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1666723043169-22e29545675c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bGVhdGhlciUyMGJlbHR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
  },
  {
    id: 17,
    title: "Men’s Bomber Jacket",
    description:
      "Lightweight bomber jacket with quilted lining — warm yet stylish for city wear.",
    price: 2999,
    discount: 35,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1624548140129-74786c5f1279?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8TWVuJTIwamFja2V0JTIwZm9yJTIwZWNvbW1lcmNlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
  },
  {
    id: 18,
    title: "Minimalist Wrist Watch",
    description:
      "Sleek minimalist wrist watch with leather strap and water resistance for everyday use.",
    price: 1999,
    discount: 18,
    category: "Fashion",
    image:
      "https://media.istockphoto.com/id/1536082397/photo/closeup-of-silver-old-watch-in-box.webp?a=1&b=1&s=612x612&w=0&k=20&c=ch3pKQ_jMzLM--T7c9iFphXHUVUIM0cxDUdtN0QyE0A=",
  },
];

export default products;
