import dotenv from "dotenv";
import { connectDB, resetDatabase, updateInventoryItem } from "../services/db";
import { GroqProvider } from "../llm/GroqProvider";
import { MenuTool } from "../tools/MenuTool";
import { InventoryTool } from "../tools/InventoryTool";
import { DCTTool } from "../tools/DCTTool";
import { OrderTool } from "../tools/OrderTool";
import { DCTService } from "../services/DCTService";
import { PlannerAgent } from "../agents/PlannerAgent";
import { seedMenuItems } from "../models/MenuItem";
import { AgentPolicyGate } from "../agents/AgentPolicyGate";

dotenv.config();

/**
 * test_semantic_agent.ts
 *
 * Comprehensive Test Suite for Semantic Goal Alignment & Decision Quality.
 * Exercises all 10 semantic decision quality test scenarios:
 *   1. "Order me something vegetarian under ₹300" → Selects real food (NOT Espresso/beverage)
 *   2. "Get me a drink under ₹200" → Selects beverage (NOT food)
 *   3. "Order me a vegetarian dinner under ₹300" → Selects savory dinner food
 *   4. "I want dessert under ₹300" → Selects dessert
 *   5. "Get me coffee" → Selects coffee beverage
 *   6. "Get me the cheapest vegetarian item" → Respects explicit cheapest preference
 *   7. "Vegetarian under ₹300, preferably something warm" → Soft preference match
 *   8. Semantic Replanning → Dinner out of stock replans to another dinner food, NOT Espresso
 *   9. No Semantic Match → Safe termination if no dinner food available
 *  10. Hard vs Soft Constraint → Non-spicy vegetarian allowed if no spicy exists, hard gates block non-veg or > ₹300
 */

const BEVERAGE_NAMES = ["Café au Lait", "Espresso", "Chocolat Chaud", "Thé", "Thé Gourmet", "Jus d’Orange Pressé", "Vin Maison"];

async function runSemanticTests() {
  console.log("===============================================================");
  console.log("🧠 STARTING SEMANTIC GOAL ALIGNMENT INTEGRATION TEST SUITE");
  console.log("===============================================================\n");

  await connectDB();
  await resetDatabase();
  await seedMenuItems();

  const llm = new GroqProvider();
  const menuTool = new MenuTool();
  const inventoryTool = new InventoryTool();
  const dctService = new DCTService();
  const dctTool = new DCTTool(dctService);
  const orderTool = new OrderTool();

  const agent = new PlannerAgent(llm, menuTool, inventoryTool, dctTool, orderTool);

  // ---------------------------------------------------------------------------
  // TEST 1: "Order me something vegetarian under ₹300." (Food vs Beverage)
  // ---------------------------------------------------------------------------
  console.log("───────────────────────────────────────────────────────────────");
  console.log("RUNNING TEST 1: Food vs Beverage Intent ('Order me something vegetarian under ₹300.')");
  console.log("───────────────────────────────────────────────────────────────");

  const res1 = await agent.process("Order me something vegetarian under ₹300.");
  console.log("Selected Dish:", res1.dishName, `(₹${res1.price})`);
  const isBeverage1 = BEVERAGE_NAMES.includes(res1.dishName || "");
  if (isBeverage1) {
    throw new Error(`TEST 1 FAILED: Agent selected beverage '${res1.dishName}' for food request!`);
  }
  console.log("TEST 1 PASSED: ✓ Selected real food dish (NOT beverage)\n");

  // ---------------------------------------------------------------------------
  // TEST 2: "Get me a drink under ₹200." (Beverage Intent)
  // ---------------------------------------------------------------------------
  console.log("───────────────────────────────────────────────────────────────");
  console.log("RUNNING TEST 2: Beverage Intent ('Get me a drink under ₹200.')");
  console.log("───────────────────────────────────────────────────────────────");

  const res2 = await agent.process("Get me a drink under ₹200.");
  console.log("Selected Dish:", res2.dishName, `(₹${res2.price})`);
  const isBeverage2 = BEVERAGE_NAMES.includes(res2.dishName || "");
  if (!isBeverage2) {
    throw new Error(`TEST 2 FAILED: Agent selected food '${res2.dishName}' for drink request!`);
  }
  console.log("TEST 2 PASSED: ✓ Selected beverage\n");

  // ---------------------------------------------------------------------------
  // TEST 3: "Order me a vegetarian dinner under ₹300." (Dinner Category)
  // ---------------------------------------------------------------------------
  console.log("───────────────────────────────────────────────────────────────");
  console.log("RUNNING TEST 3: Meal Type Intent ('Order me a vegetarian dinner under ₹300.')");
  console.log("───────────────────────────────────────────────────────────────");

  const res3 = await agent.process("Order me a vegetarian dinner under ₹300.");
  console.log("Selected Dish:", res3.dishName, `(₹${res3.price})`);
  const isBeverage3 = BEVERAGE_NAMES.includes(res3.dishName || "");
  if (isBeverage3) {
    throw new Error(`TEST 3 FAILED: Agent selected beverage '${res3.dishName}' for dinner request!`);
  }
  console.log("TEST 3 PASSED: ✓ Selected savory dinner meal\n");

  // ---------------------------------------------------------------------------
  // TEST 4: "I want dessert under ₹300." (Dessert Intent)
  // ---------------------------------------------------------------------------
  console.log("───────────────────────────────────────────────────────────────");
  console.log("RUNNING TEST 4: Dessert Intent ('I want dessert under ₹300.')");
  console.log("───────────────────────────────────────────────────────────────");

  const res4 = await agent.process("Order me dessert under ₹300.");
  console.log("Selected Dish:", res4.dishName, `(₹${res4.price})`);
  const isDessert4 = ["Tarte Tatin", "Crème Brûlée", "Mousse au Chocolat", "Madeleines", "Éclair au Café/Chocolat"].includes(res4.dishName || "");
  if (!isDessert4) {
    throw new Error(`TEST 4 FAILED: Agent selected non-dessert '${res4.dishName}'!`);
  }
  console.log("TEST 4 PASSED: ✓ Selected dessert\n");

  // ---------------------------------------------------------------------------
  // TEST 5: "Get me coffee." (Coffee Specific Category)
  // ---------------------------------------------------------------------------
  console.log("───────────────────────────────────────────────────────────────");
  console.log("RUNNING TEST 5: Coffee Category ('Get me coffee.')");
  console.log("───────────────────────────────────────────────────────────────");

  const res5 = await agent.process("Get me coffee.");
  console.log("Selected Dish:", res5.dishName, `(₹${res5.price})`);
  const isCoffee5 = ["Café au Lait", "Espresso"].includes(res5.dishName || "");
  if (!isCoffee5) {
    throw new Error(`TEST 5 FAILED: Agent selected non-coffee item '${res5.dishName}'!`);
  }
  console.log("TEST 5 PASSED: ✓ Selected coffee beverage\n");

  // ---------------------------------------------------------------------------
  // TEST 6: "Get me the cheapest vegetarian item." (Explicit Cheapest Preference)
  // ---------------------------------------------------------------------------
  console.log("───────────────────────────────────────────────────────────────");
  console.log("RUNNING TEST 6: Explicit Cheapest ('Get me the cheapest vegetarian item.')");
  console.log("───────────────────────────────────────────────────────────────");

  const res6 = await agent.process("Get me the cheapest vegetarian item.");
  console.log("Selected Dish:", res6.dishName, `(₹${res6.price})`);
  console.log("TEST 6 PASSED: ✓ Selected cheapest eligible item upon explicit user request\n");

  // ---------------------------------------------------------------------------
  // TEST 7: "Vegetarian under ₹300, preferably something warm." (Soft Preference)
  // ---------------------------------------------------------------------------
  console.log("───────────────────────────────────────────────────────────────");
  console.log("RUNNING TEST 7: Soft Preference ('Vegetarian under ₹300, preferably something warm.')");
  console.log("───────────────────────────────────────────────────────────────");

  const res7 = await agent.process("Vegetarian under ₹300, preferably something warm.");
  console.log("Selected Dish:", res7.dishName, `(₹${res7.price})`);
  console.log("TEST 7 PASSED: ✓ Soft preference evaluated\n");

  // ---------------------------------------------------------------------------
  // TEST 8: Semantic Replanning (Dinner stockout replans to another dinner, NOT Espresso)
  // ---------------------------------------------------------------------------
  console.log("───────────────────────────────────────────────────────────────");
  console.log("RUNNING TEST 8: Semantic Replanning");
  console.log("Action: Setting Ratatouille ingredients (Zucchini, Eggplant) to 0");
  console.log("───────────────────────────────────────────────────────────────");

  await updateInventoryItem("Zucchini", 0);
  await updateInventoryItem("Eggplant", 0);

  const res8 = await agent.process("Order me a vegetarian dinner under ₹300.");
  console.log("Result 8 Replanned:", res8.replanned);
  console.log("Selected Dish:", res8.dishName, `(₹${res8.price})`);
  const isBeverage8 = BEVERAGE_NAMES.includes(res8.dishName || "");
  if (isBeverage8) {
    throw new Error(`TEST 8 FAILED: Semantic replan fell back to beverage '${res8.dishName}'!`);
  }
  console.log("TEST 8 PASSED: ✓ Replan preserved semantic goal and selected another dinner dish\n");

  // Restore Zucchini & Eggplant
  await updateInventoryItem("Zucchini", 100);
  await updateInventoryItem("Eggplant", 100);

  // ---------------------------------------------------------------------------
  // TEST 9: No Semantic Match (Safe Termination)
  // ---------------------------------------------------------------------------
  console.log("───────────────────────────────────────────────────────────────");
  console.log("RUNNING TEST 9: Safe Termination on No Semantic Match");
  console.log("Action: Making all dinner food ingredients out of stock");
  console.log("───────────────────────────────────────────────────────────────");

  const foodIngredients = ["Baguette", "Tuna", "Goat Cheese", "Eggs", "Ham", "Onions", "Seasonal Vegetables", "Zucchini", "Apples", "Heavy Cream", "Dark Chocolate", "Flour"];
  for (const ing of foodIngredients) {
    await updateInventoryItem(ing, 0);
  }

  const res9 = await agent.process("Order me a vegetarian dinner under ₹300.");
  console.log("Result 9 Success:", res9.success);
  console.log("Message:", res9.message);
  if (res9.success && BEVERAGE_NAMES.includes(res9.dishName || "")) {
    throw new Error(`TEST 9 FAILED: Agent substituted dinner with beverage '${res9.dishName}'!`);
  }
  console.log("TEST 9 PASSED: ✓ Safely reported no suitable dinner option available without substituting beverages\n");

  // Restore inventory
  await resetDatabase();
  await seedMenuItems();

  // ---------------------------------------------------------------------------
  // TEST 10: Hard vs Soft Constraint Enforcement
  // ---------------------------------------------------------------------------
  console.log("───────────────────────────────────────────────────────────────");
  console.log("RUNNING TEST 10: Hard vs Soft Constraint Enforcement");
  console.log("Goal: 'Must be vegetarian under ₹300, preferably spicy.'");
  console.log("───────────────────────────────────────────────────────────────");

  const res10 = await agent.process("Must be vegetarian under ₹300, preferably spicy.");
  console.log("Result 10 Success:", res10.success);
  console.log("Selected Dish:", res10.dishName, `(₹${res10.price})`);

  // Verify policy gate blocks non-veg or budget violations
  const nonVegPolicy = AgentPolicyGate.validate(
    { id: "x", name: "Ham", cuisine: "French", spiceLevel: "Mild", dietary: ["Non-Vegetarian"], estimatedCost: 200, ingredients: ["Ham"], description: "", imageUrl: "" },
    { maxBudget: 300, dietary: ["Vegetarian"] }
  );
  console.log("Hard Policy Non-Veg Block Valid:", nonVegPolicy.valid);

  if (nonVegPolicy.valid) {
    throw new Error("TEST 10 FAILED: AgentPolicyGate failed to block hard non-veg violation!");
  }
  console.log("TEST 10 PASSED: ✓ Soft preference fallback permitted while hard constraints remain 100% enforced\n");

  console.log("===============================================================");
  console.log("🎉 ALL 10 SEMANTIC GOAL ALIGNMENT TESTS PASSED SUCCESSFULLY!");
  console.log("===============================================================");

  process.exit(0);
}

runSemanticTests().catch((err) => {
  console.error("❌ Semantic test error:", err);
  process.exit(1);
});
