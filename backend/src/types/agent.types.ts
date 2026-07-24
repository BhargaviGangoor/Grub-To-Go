/**
 * agent.types.ts
 *
 * TypeScript contracts for the PlannerAgent pipeline.
 * These types define the data flowing between:
 *   LLM (intent extraction) → PlannerAgent → Tools → Response
 */

// ─── Intent ──────────────────────────────────────────────────────────────────

export type IntentKind =
  | "ORDER_FOOD"      // User wants to place an order
  | "RECIPE_REQUEST"  // User wants a recipe idea
  | "GENERAL_CHAT"    // General food question
  | "UNKNOWN";        // Could not determine intent

// ─── Order Constraints ────────────────────────────────────────────────────────

export interface OrderConstraints {
  maxBudget?: number;
  dietary?: string[];           // e.g. ["vegetarian", "gluten-free"]
  spiceLevel?: "Mild" | "Medium" | "Spicy";
  cuisine?: string;
}

// ─── Extracted User Intent ───────────────────────────────────────────────────

export interface UserIntent {
  intent: IntentKind;
  constraints: OrderConstraints;
  rawMessage: string;
}

// ─── Menu Item (matches MenuItem Mongoose model) ──────────────────────────────

export interface MenuItemData {
  id: string;
  name: string;
  cuisine: string;
  spiceLevel: "Mild" | "Medium" | "Spicy";
  dietary: string[];
  estimatedCost: number;
  ingredients: string[];
  description: string;
  imageUrl: string;
}

// ─── Inventory Check Result ───────────────────────────────────────────────────

export interface InventoryCheckResult {
  available: boolean;
  outOfStock: string[];  // Ingredient names with qty === 0
}

// ─── DCT Generation + Validation Result ──────────────────────────────────────

export interface DCTGenerateResult {
  tokenId: string;
  tokenObj: any;  // Full token object as stored in DB
}

export interface DCTValidateResult {
  success: boolean;          // true = no drift, order can proceed
  outcome: "success" | "blocked" | "amplified";
  driftsDetected: string[];
  logs: string[];
}

// ─── Planner Result ───────────────────────────────────────────────────────────

export interface PlannerResult {
  success: boolean;
  dishName?: string;
  price?: number;
  orderId?: string;
  dctTokenId?: string;
  replanned?: boolean;       // true if the first candidate was rejected
  rejectedCandidates?: string[];
  message: string;           // Natural language summary for the user
}
