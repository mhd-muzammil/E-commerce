import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { defaultProducts } from "../config/defaultProducts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to products.json (in server root)
const productsPath = path.join(__dirname, "..", "products.json");

/**
 * Read all products from the JSON file
 * @returns {Array} Array of products
 */
export function readProducts() {
  try {
    if (fs.existsSync(productsPath)) {
      const data = fs.readFileSync(productsPath, "utf8");
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error("Error reading products:", error);
    return [];
  }
}

/**
 * Write products to the JSON file
 * @param {Array} products - Array of products to write
 * @returns {boolean} Success status
 */
export function writeProducts(products) {
  try {
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing products:", error);
    return false;
  }
}

/**
 * Initialize products.json with default products if it doesn't exist
 */
export function initializeProducts() {
  if (!fs.existsSync(productsPath)) {
    writeProducts(defaultProducts);
    console.log("Initialized products.json with default products");
  }
}
