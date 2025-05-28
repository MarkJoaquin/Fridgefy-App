import { config } from "dotenv";
import path from "path";

export const ENV = process.env.NODE_ENV || "development";

// Only load from .env file in development, Vercel will use its own env variables in production
if (ENV === "development") {
  const PATH = path.join(__dirname, `../.env`);
  config({ path: PATH });
} else {
  // In production, env variables are already set by Vercel
  config();
}

export const PORT = process.env.PORT || 3000;
