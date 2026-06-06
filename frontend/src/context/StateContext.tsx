"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Types
export interface Dish {
  id: string;
  name: string;
  cuisine: string;
  spiceLevel: "Mild" | "Medium" | "Spicy";
  dietary: string[];
  estimatedCost: number;
  ingredients: string[];
  prepTime: string;
  confidenceScore: number;
  imageUrl: string;
  description: string;
}

export interface GB_DCT_Token {
  id: string;
  timestamp: string;
  expiry: string;
  status: "ACTIVE" | "REDEEMED" | "INVALIDATED";
  dish: Dish;
  constraints: {
    budget: number;
    dietary: string[];
    cuisine: string;
    spiceLevel: string;
  };
  hashes: {
    inventorySnapshotHash: string;
    pricingSnapshotHash: string;
    dietaryHash: string;
    artifactRoot: string;
    generationRoot: string;
  };
  originalState: {
    inventory: Record<string, number>;
    pricing: Record<string, number>;
    dietaryRules: Record<string, string[]>;
  };
}

export interface SystemState {
  inventory: Record<string, number>;
  pricing: Record<string, number>;
  dietaryRules: Record<string, string[]>; // Ingredient name -> allowed categories
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  action: string;
  type: "info" | "warning" | "error" | "success";
}

interface StateContextType {
  tokens: GB_DCT_Token[];
  activeTokenId: string | null;
  setActiveTokenId: (id: string | null) => void;
  systemState: SystemState;
  driftHistory: TimelineEvent[];
  stats: {
    passed: number;
    failed: number;
    amplificationEvents: number;
    detectedDrifts: number;
    missedDrifts: number;
    totalGenerated: number;
  };
  addToken: (token: GB_DCT_Token) => void;
  redeemToken: (tokenId: string, securityMode: "standard" | "gb-dct") => {
    success: boolean;
    outcome: "success" | "blocked" | "amplified";
    logs: string[];
    driftsDetected: string[];
    beforeState: any;
    afterState: any;
  };
  updateInventory: (ingredient: string, amount: number) => void;
  updatePricing: (ingredient: string, price: number) => void;
  updateDietaryRules: (ingredient: string, rules: string[]) => void;
  resetSystemState: () => void;
  injectDrift: (driftType: string) => void;
}

const defaultInventory: Record<string, number> = {
  "Paneer": 15,
  "Udon Noodles": 25,
  "Chicken": 10,
  "Ramen Noodles": 20,
  "Mushrooms": 25,
  "Sage": 10,
  "Heavy Cream": 12,
  "Saffron": 8,
  "Basmati Rice": 30,
};

const defaultPricing: Record<string, number> = {
  "Paneer": 90,
  "Udon Noodles": 45,
  "Chicken": 120,
  "Ramen Noodles": 35,
  "Mushrooms": 60,
  "Sage": 20,
  "Heavy Cream": 30,
  "Saffron": 150,
  "Basmati Rice": 25,
};

// Map of ingredient -> permitted categories
const defaultDietaryRules: Record<string, string[]> = {
  "Paneer": ["Vegetarian", "Jain", "Gluten Free"],
  "Udon Noodles": ["Vegetarian", "Vegan"], // contains gluten
  "Chicken": [], // meat
  "Ramen Noodles": ["Vegetarian", "Vegan"], // contains gluten
  "Mushrooms": ["Vegetarian", "Vegan", "Gluten Free"],
  "Sage": ["Vegetarian", "Vegan", "Jain", "Gluten Free"],
  "Heavy Cream": ["Vegetarian", "Gluten Free"],
  "Saffron": ["Vegetarian", "Vegan", "Jain", "Gluten Free"],
  "Basmati Rice": ["Vegetarian", "Vegan", "Jain", "Gluten Free"],
};

const StateContext = createContext<StateContextType | undefined>(undefined);

export function StateProvider({ children }: { children: React.ReactNode }) {
  const [tokens, setTokens] = useState<GB_DCT_Token[]>([]);
  const [activeTokenId, setActiveTokenId] = useState<string | null>(null);
  const [systemState, setSystemState] = useState<SystemState>({
    inventory: { ...defaultInventory },
    pricing: { ...defaultPricing },
    dietaryRules: { ...defaultDietaryRules },
  });
  const [driftHistory, setDriftHistory] = useState<TimelineEvent[]>([
    {
      id: "init",
      timestamp: new Date().toLocaleTimeString(),
      action: "System initialized with baseline World State.",
      type: "info",
    },
  ]);

  const [stats, setStats] = useState({
    passed: 32,
    failed: 14,
    amplificationEvents: 3,
    detectedDrifts: 14,
    missedDrifts: 0,
    totalGenerated: 49,
  });

  const addToken = (token: GB_DCT_Token) => {
    setTokens((prev) => [token, ...prev]);
    setActiveTokenId(token.id);
    setStats((prev) => ({
      ...prev,
      totalGenerated: prev.totalGenerated + 1,
    }));
    logEvent(`New GB-DCT Generated: ${token.id} for dish: "${token.dish.name}"`, "success");
  };

  const logEvent = (action: string, type: TimelineEvent["type"]) => {
    setDriftHistory((prev) => [
      {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toLocaleTimeString(),
        action,
        type,
      },
      ...prev,
    ]);
  };

  const updateInventory = (ingredient: string, amount: number) => {
    setSystemState((prev) => {
      const nextInv = { ...prev.inventory, [ingredient]: amount };
      return { ...prev, inventory: nextInv };
    });
    logEvent(`Inventory modified: ${ingredient} set to ${amount} units.`, amount === 0 ? "error" : "warning");
  };

  const updatePricing = (ingredient: string, price: number) => {
    setSystemState((prev) => {
      const nextPricing = { ...prev.pricing, [ingredient]: price };
      return { ...prev, pricing: nextPricing };
    });
    logEvent(`Pricing modified: ${ingredient} set to ₹${price}.`, "warning");
  };

  const updateDietaryRules = (ingredient: string, rules: string[]) => {
    setSystemState((prev) => {
      const nextRules = { ...prev.dietaryRules, [ingredient]: rules };
      return { ...prev, dietaryRules: nextRules };
    });
    logEvent(`Dietary rules modified: ${ingredient} now supports: [${rules.join(", ")}]`, "warning");
  };

  const resetSystemState = () => {
    setSystemState({
      inventory: { ...defaultInventory },
      pricing: { ...defaultPricing },
      dietaryRules: { ...defaultDietaryRules },
    });
    logEvent("World State restored to original baselines.", "info");
  };

  const injectDrift = (driftType: string) => {
    switch (driftType) {
      case "remove_paneer":
        updateInventory("Paneer", 0);
        break;
      case "increase_paneer_cost":
        updatePricing("Paneer", 280); // original is 90
        break;
      case "change_dietary_rule":
        // Paneer is no longer vegetarian (simulating allergen / lard oil contamination)
        updateDietaryRules("Paneer", ["Jain", "Gluten Free"]); // Removed "Vegetarian"
        break;
      case "expire_inventory":
        updateInventory("Udon Noodles", 0);
        updateInventory("Ramen Noodles", 0);
        break;
      case "inject_stale_inventory":
        updateInventory("Mushrooms", 1); // Almost empty
        break;
      case "inject_wrong_price":
        updatePricing("Saffron", 450); // original is 150
        break;
      default:
        break;
    }
  };

  const redeemToken = (tokenId: string, securityMode: "standard" | "gb-dct") => {
    const token = tokens.find((t) => t.id === tokenId);
    if (!token) {
      return {
        success: false,
        outcome: "blocked" as const,
        logs: ["Token ID search failed.", "Redemption aborted."],
        driftsDetected: ["Token not found"],
        beforeState: {},
        afterState: {},
      };
    }

    const logs: string[] = [];
    const driftsDetected: string[] = [];
    let success = true;

    logs.push(`Initiating cryptographical attestation for lease: ${tokenId}`);
    logs.push(`Comparing token Generation state against live World State...`);

    // Compare state details
    const beforeState: any = {
      cost: token.dish.estimatedCost,
      inventory: {},
      dietary: [...token.dish.dietary],
    };

    const afterState: any = {
      cost: 0,
      inventory: {},
      dietary: [],
    };

    // 1. Inventory checks
    token.dish.ingredients.forEach((ing) => {
      const origQty = token.originalState.inventory[ing] ?? 0;
      const liveQty = systemState.inventory[ing] ?? 0;
      beforeState.inventory[ing] = `Available (${origQty} units)`;
      afterState.inventory[ing] = `Available (${liveQty} units)`;

      if (liveQty <= 0) {
        success = false;
        driftsDetected.push(`Inventory Shortage: ${ing} is out of stock (Available: ${liveQty})`);
        logs.push(`⚠️ DRIFT DETECTED: [Pantry] ${ing} quantity is 0 (Token signature required positive balance)`);
      }
    });

    // 2. Budget / pricing checks
    let currentRecipeCost = 0;
    token.dish.ingredients.forEach((ing) => {
      const basePrice = token.originalState.pricing[ing] ?? 0;
      const livePrice = systemState.pricing[ing] ?? 0;
      currentRecipeCost += livePrice;
    });

    // Adjust recipe cost to be scaled, similar to generation logic
    const costMultiplier = currentRecipeCost / Object.keys(token.originalState.pricing).reduce((acc, k) => acc + (token.originalState.pricing[k] ?? 0), 0);
    const scaledLiveCost = Math.round(token.dish.estimatedCost * costMultiplier);

    beforeState.cost = token.dish.estimatedCost;
    afterState.cost = scaledLiveCost;

    if (scaledLiveCost > token.constraints.budget) {
      success = false;
      driftsDetected.push(`Budget Violations: Estimated cost ₹${scaledLiveCost} exceeds budget ₹${token.constraints.budget}`);
      logs.push(`⚠️ DRIFT DETECTED: [Pricing] Real-time cost ₹${scaledLiveCost} exceeds signed constraint budget ₹${token.constraints.budget}`);
    } else if (scaledLiveCost !== token.dish.estimatedCost) {
      logs.push(`ℹ️ STATE DRIFT: [Pricing] Raw costs fluctuated. Original: ₹${token.dish.estimatedCost}, Current: ₹${scaledLiveCost}`);
    }

    // 3. Dietary checks
    token.constraints.dietary.forEach((pref) => {
      token.dish.ingredients.forEach((ing) => {
        const permitted = systemState.dietaryRules[ing] ?? [];
        const isPermitted = permitted.includes(pref);
        if (!isPermitted) {
          success = false;
          driftsDetected.push(`Dietary Violation: ${ing} is not allowed for diet ${pref}`);
          logs.push(`⚠️ DRIFT DETECTED: [Dietary] ${ing} fails constraint "${pref}" in current rules`);
        }
      });
    });

    let outcome: "success" | "blocked" | "amplified" = "success";

    if (!success) {
      if (securityMode === "gb-dct") {
        outcome = "blocked";
        logs.push(`🛑 GB-DCT SECURITY BLOCK: Token invalidated due to world state drift.`);
        logs.push(`Redemption failed. Kitchen operations halted. System protected.`);
        // Mark token as invalidated
        setTokens((prev) =>
          prev.map((t) => (t.id === tokenId ? { ...t, status: "INVALIDATED" } : t))
        );
        setStats((prev) => ({
          ...prev,
          failed: prev.failed + 1,
          detectedDrifts: prev.detectedDrifts + 1,
        }));
        logEvent(`GB-DCT Blocked Stale Redemption: ${tokenId} (Drift detected)`, "error");
      } else {
        outcome = "amplified";
        logs.push(`⚠️ STANDARD BYPASS: State drift ignored. Cryptographic payload is structurally sound.`);
        logs.push(`🚨 COMMITMENT AMPLIFIED: Token executed on stale state. Fired kitchen resources!`);
        // Mark token as redeemed
        setTokens((prev) =>
          prev.map((t) => (t.id === tokenId ? { ...t, status: "REDEEMED" } : t))
        );
        setStats((prev) => ({
          ...prev,
          passed: prev.passed + 1,
          amplificationEvents: prev.amplificationEvents + 1,
        }));
        logEvent(`Commitment Amplified: ${tokenId} executed with outdated state parameters!`, "error");
      }
    } else {
      outcome = "success";
      logs.push(`✓ ATTESTATION PASSED: Live state matches all commitments.`);
      logs.push(`🎟️ Token lease redeemed. Kitchen slot locked and ingredients fired.`);
      // Mark token as redeemed
      setTokens((prev) =>
        prev.map((t) => (t.id === tokenId ? { ...t, status: "REDEEMED" } : t))
      );
      setStats((prev) => ({
        ...prev,
        passed: prev.passed + 1,
      }));
      logEvent(`Token Redeemed Successfully: ${tokenId}`, "success");
    }

    return {
      success: outcome === "success",
      outcome,
      logs,
      driftsDetected,
      beforeState,
      afterState,
    };
  };

  return (
    <StateContext.Provider
      value={{
        tokens,
        activeTokenId,
        setActiveTokenId,
        systemState,
        driftHistory,
        stats,
        addToken,
        redeemToken,
        updateInventory,
        updatePricing,
        updateDietaryRules,
        resetSystemState,
        injectDrift,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within a StateProvider");
  }
  return context;
}
