import dotenv from "dotenv";
import path from "path";

// Load .env from the backend root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

/**
 * Centralized configuration.
 *
 * WHY THIS EXISTS:
 * All environment variables are read once here and exported as typed constants.
 * Services import from here — never call process.env directly.
 * This means:
 *   1. You get TypeScript types on config values.
 *   2. A missing env var fails loudly here at startup, not silently later.
 *   3. Swapping config sources (e.g., secrets manager) means changing ONE file.
 */
export const config = {
  port: parseInt(process.env.PORT || "3001", 10),

  /**
   * Groq API key for the chat LLM provider.
   * Get yours free at https://console.groq.com
   */
  groqApiKey: process.env.GROQ_API_KEY || "",

  /**
   * Gemini API key — used by the existing dish generation service (unchanged).
   */
  geminiApiKey: process.env.GEMINI_API_KEY || "",

  /**
   * MongoDB connection string — used by the existing DB service (unchanged).
   */
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/grubtogo",

  /**
   * JWT secret — used by the existing DCT security service (unchanged).
   */
  jwtSecret: process.env.JWT_SECRET || "grubtogo-super-secret-key-12345",

  /**
   * The Groq model to use for chat completions.
   * llama-3.3-70b-versatile: fast, highly capable, great for agentic reasoning.
   * Easy to swap to "mixtral-8x7b-32768" or "gemma2-9b-it" here.
   */
  groqModel: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",

  /**
   * Node environment
   */
  nodeEnv: process.env.NODE_ENV || "development",
} as const;

/**
 * Validate that critical config is present.
 * Called once at startup from index.ts.
 */
export function validateConfig(): void {
  const warnings: string[] = [];

  if (!config.groqApiKey) {
    warnings.push(
      "⚠️  GROQ_API_KEY is not set. The /api/chat endpoint will not work. " +
      "Get a free key at https://console.groq.com and add GROQ_API_KEY=gsk_... to backend/.env"
    );
  }

  warnings.forEach((w) => console.warn(w));
}
