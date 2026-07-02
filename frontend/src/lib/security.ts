import crypto from "crypto";

/**
 * Generates a SHA-256 hash of a string input
 */
export function generateHash(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

/**
 * Generates an HMAC-SHA256 signature of a string input using a secret key
 */
export function generateHmac(input: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(input).digest("hex");
}

/**
 * Computes the Generation Root from individual component hashes
 */
export function createGenerationRoot(
  inventoryHash: string,
  pricingHash: string,
  dietaryHash: string,
  artifactRoot: string
): string {
  const data = `${inventoryHash}||${pricingHash}||${dietaryHash}||${artifactRoot}`;
  return generateHash(data);
}

/**
 * Computes the GB-DCT HMAC signature
 */
export function createDCT(generationRoot: string, action: string, secret: string): string {
  const data = `${generationRoot}||${action}`;
  return generateHmac(data, secret);
}
