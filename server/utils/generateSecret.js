import crypto from "crypto";

// Generate a secure random secret
const secret = crypto.randomBytes(64).toString("hex");

console.log("\n✅ Generated JWT_SECRET:");
console.log(secret);
console.log("\n📝 Add this to your .env file:");
console.log(`JWT_SECRET=${secret}\n`);
