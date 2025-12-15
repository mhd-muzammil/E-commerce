# Server Structure

This server follows a clean MVC (Model-View-Controller) architecture pattern for better organization and maintainability.

## Folder Structure

```
server/
├── config/              # Configuration files
│   └── defaultProducts.js    # Default products data
├── controllers/         # Business logic handlers
│   └── productController.js  # Product-related controllers
├── models/              # Data models and schemas
│   └── Product.js      # Product model with validation
├── routes/              # API route definitions
│   └── productRoutes.js     # Product routes
├── utils/               # Utility functions
│   └── fileStorage.js  # File read/write operations
├── index.js            # Main server entry point
└── package.json        # Dependencies
```

## File Descriptions

### `index.js`

Main entry point for the Express server. Sets up middleware, routes, and error handling.

### `routes/productRoutes.js`

Defines all product-related API endpoints:

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product

### `controllers/productController.js`

Contains the business logic for product operations:

- `getAllProducts()` - Fetch all products
- `getProductById()` - Fetch single product by ID
- `createProduct()` - Create and save new product

### `models/Product.js`

Product model class with:

- Data structure definition
- Validation logic
- Factory method for creating products

### `utils/fileStorage.js`

Utility functions for file operations:

- `readProducts()` - Read products from JSON file
- `writeProducts()` - Write products to JSON file
- `initializeProducts()` - Initialize with default data

### `config/defaultProducts.js`

Default products data used for initialization.

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product

### Request Body for POST /api/products

```json
{
  "image": "https://example.com/image.jpg",
  "title": "Product Name",
  "description": "Product description",
  "price": 999,
  "discount": 10,
  "category": "Electronics"
}
```

## Database Setup

The server uses MongoDB for data storage. Make sure MongoDB is installed and running.

### Option 1: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. The default connection string is: `mongodb://localhost:27017/ecommerce`

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get your connection string
3. Set it in your `.env` file

### Environment Variables

1. Copy the `.env.example` file to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and update with your MongoDB connection string:

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/ecommerce
   ```

   Or for MongoDB Atlas:

   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```

### Creating Admin User

After setting up the database, create an admin user:

```bash
npm run create-admin
```

This will create an admin user with:

- Email: `admin@example.com`
- Password: `admin123`

**⚠️ Important:** Change the admin password after first login!

### Changing Admin Password

#### Method 1: Using Command Line Script (Recommended)

```bash
npm run change-admin-password
```

This will prompt you for:

- Admin email (default: admin@example.com)
- New password
- Password confirmation

#### Method 2: Using API (After Login)

Once logged in as admin, you can change password via API:

```bash
PUT /api/auth/change-password
Headers: Authorization: Bearer <your-token>
Body: {
  "currentPassword": "old-password",
  "newPassword": "new-password"
}
```

## Running the Server

```bash
cd server
npm install
npm start
```

The server will run on `http://localhost:5000` and automatically connect to MongoDB.
