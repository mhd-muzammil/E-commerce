# E-Commerce Application

A full-stack e-commerce application built with React, Vite, and Express.js.

## Features

- Browse products with filtering and search
- Add products to cart
- Add new products via backend API
- Product details page
- Responsive design with Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Setup Instructions

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

### 3. Start the Backend Server

In the `server` directory:

```bash
cd server
npm start
```

The backend server will run on `http://localhost:5000`

### 4. Start the Frontend Development Server

In the root directory:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## Usage

1. **View Products**: Navigate to the Products page to see all available products
2. **Add Product**: Click on "Add Product" in the navigation to add a new product with:
   - Product Image URL
   - Product Name
   - Product Description
   - Product Price
   - Product Discount (percentage)
   - Category (optional)
3. **Add to Cart**: Click "Add" on any product card to add it to your cart
4. **View Cart**: Click the Cart button in the navigation to view your cart

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a single product by ID
- `POST /api/products` - Add a new product

## Project Structure

```
my-ecom/
├── server/              # Backend Express server
│   ├── index.js        # Server entry point
│   ├── products.json   # Products data storage
│   └── package.json    # Backend dependencies
├── src/
│   ├── components/     # React components
│   ├── context/        # React context providers
│   ├── pages/          # Page components
│   └── data/           # Static data (legacy)
└── package.json        # Frontend dependencies
```

## Technologies Used

- **Frontend**: React, React Router, Tailwind CSS, Vite
- **Backend**: Express.js, Node.js
- **State Management**: React Context API
