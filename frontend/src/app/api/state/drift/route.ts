import { NextResponse } from "next/server";
import { updateInventoryItem, updatePricingRule, updateDietaryRulesItem, getPantry, getPricing, getDietaryRules, getTelemetryLogs, getStats } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { driftType } = await request.json();

    switch (driftType) {
      case "stockout":
      case "remove_paneer":
        await updateInventoryItem("Paneer", 0);
        break;
      case "inflation":
      case "increase_paneer_cost":
        await updatePricingRule("Paneer", 280);
        break;
      case "allergen":
      case "change_dietary_rule":
        await updateDietaryRulesItem("Paneer", ["Jain", "Gluten Free", "Gluten-Free"]);
        break;
      case "expire_inventory":
        await updateInventoryItem("Udon Noodles", 0);
        await updateInventoryItem("Ramen Noodles", 0);
        break;
      case "inject_stale_inventory":
        await updateInventoryItem("Mushrooms", 1);
        break;
      case "inject_wrong_price":
        await updatePricingRule("Saffron", 450);
        break;
      default:
        break;
    }
    
    const inventory = await getPantry();
    const pricing = await getPricing();
    const dietaryRules = await getDietaryRules();
    const driftHistory = await getTelemetryLogs();
    const stats = await getStats();

    return NextResponse.json({
      success: true,
      state: {
        inventory,
        pricing,
        dietaryRules,
        driftHistory,
        stats
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
