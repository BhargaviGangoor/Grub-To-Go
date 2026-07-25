/**
 * agent.types.ts
 *
 * TypeScript contracts for the autonomous PlannerAgent pipeline.
 * Defines the explicit agent state, immutable authorization constraints,
 * tool actions, observations, and result payloads.
 */

// ─── Intent Types ─────────────────────────────────────────────────────────────

export type IntentKind =
  | "ORDER_FOOD"      // User wants to place an order
  | "RECIPE_REQUEST"  // User wants a recipe idea
  | "GENERAL_CHAT"    // General food question
  | "RECOMMENDATION"  // Recommendation inquiry
  | "UNKNOWN";        // Could not determine intent

// ─── Immutable User Authorization ─────────────────────────────────────────────

export interface OrderAuthorization {
  maxBudget?: number;
  dietary?: string[];              // e.g. ["Vegetarian", "Gluten-Free"]
  excludedIngredients?: string[];  // e.g. ["peanuts", "mushrooms"]
  spiceLevel?: "Mild" | "Medium" | "Spicy";
  cuisine?: string;
  dishNameQuery?: string;          // e.g. "croissant"
  softPreferences?: string[];      // e.g. ["warm", "crispy"]
}

export interface OrderConstraints extends OrderAuthorization {}

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
  outOfStock: string[];  // Ingredient names with qty === 0 or dietary rule drift
}

// ─── DCT Generation + Validation Result ──────────────────────────────────────

export interface DCTGenerateResult {
  tokenId: string;
  tokenObj: any;            // Full token object as stored in DB
  generationLineage?: {     // Lineage tracking for replanning
    generation: number;
    previousTokenHash?: string;
  };
}

export interface DCTValidateResult {
  success: boolean;          // true = no drift, order can proceed
  outcome: "success" | "blocked" | "amplified";
  driftsDetected: string[];
  logs: string[];
}

// ─── Agent Step Execution Trace ──────────────────────────────────────────────

export interface AgentStep {
  title: string;
  detail: string;
  status: "success" | "warning" | "info" | "error";
  timestamp?: string;
}

// ─── Structured Agent Actions & Observations ─────────────────────────────────

export type AgentActionType =
  | "SEARCH_MENU"
  | "SELECT_DISH"
  | "CHECK_INVENTORY"
  | "GENERATE_DCT"
  | "VALIDATE_DCT"
  | "CREATE_ORDER"
  | "REPLAN"
  | "FINISH";

export type AgentAction =
  | { type: "SEARCH_MENU" }
  | { type: "SELECT_DISH"; dishId: string }
  | { type: "CHECK_INVENTORY"; dishId: string }
  | { type: "GENERATE_DCT"; dishId: string }
  | { type: "VALIDATE_DCT"; tokenId: string }
  | { type: "CREATE_ORDER"; dishId: string; tokenId: string }
  | { type: "REPLAN"; reason: string }
  | { type: "FINISH"; reason: string };

export interface AgentObservation {
  action: AgentActionType;
  timestamp: string;
  success: boolean;
  message: string;
  data?: any;
}

// ─── Explicit Agent State ─────────────────────────────────────────────────────

export type AgentStatus =
  | "PLANNING"
  | "SEARCHING"
  | "SELECTING"
  | "AUDITING_INVENTORY"
  | "AUTHORIZING_DCT"
  | "VALIDATING_DCT"
  | "REPLANNING"
  | "EXECUTING_ORDER"
  | "COMPLETED"
  | "FAILED";

export interface AgentState {
  originalRequest: string;
  intent: IntentKind;
  authorization: OrderAuthorization;   // Frozen immutable constraints
  candidates: MenuItemData[];
  selectedDish?: MenuItemData;
  attemptedDishIds: string[];
  observations: AgentObservation[];
  replanCount: number;
  stepCount: number;
  dctTokenId?: string;
  previousTokenHash?: string;          // For GB-DCT replan commitment lineage
  status: AgentStatus;
  orderId?: string;
}

// ─── Planner Result ───────────────────────────────────────────────────────────

export interface PlannerResult {
  success: boolean;
  dishName?: string;
  price?: number;
  orderId?: string;
  dctTokenId?: string;
  replanned?: boolean;       // true if a previous candidate was rejected/replanned
  rejectedCandidates?: string[];
  message: string;           // Natural language summary for the user
  agentSteps?: AgentStep[];  // Step-by-step execution trace
  dish?: MenuItemData;       // Selected dish details
}
