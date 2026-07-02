"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHash = generateHash;
exports.generateHmac = generateHmac;
exports.createGenerationRoot = createGenerationRoot;
exports.createDCT = createDCT;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Generates a SHA-256 hash of a string input
 */
function generateHash(input) {
    return crypto_1.default.createHash("sha256").update(input).digest("hex");
}
/**
 * Generates an HMAC-SHA256 signature of a string input using a secret key
 */
function generateHmac(input, secret) {
    return crypto_1.default.createHmac("sha256", secret).update(input).digest("hex");
}
/**
 * Computes the Generation Root from individual component hashes
 */
function createGenerationRoot(inventoryHash, pricingHash, dietaryHash, artifactRoot) {
    const data = `${inventoryHash}||${pricingHash}||${dietaryHash}||${artifactRoot}`;
    return generateHash(data);
}
/**
 * Computes the GB-DCT HMAC signature
 */
function createDCT(generationRoot, action, secret) {
    const data = `${generationRoot}||${action}`;
    return generateHmac(data, secret);
}
