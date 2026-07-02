import { NextResponse } from "next/server";
import { updateInventoryItem, updatePricingRule, updateDietaryRulesItem, getPantry, getPricing, getDietaryRules, getTelemetryLogs, getStats } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { ingredient, quantity, price, rules } = await request.json();

    if (quantity !== undefined) {
      await updateInventoryItem(ingredient, quantity);
    }
    if (price !== undefined) {
      await updatePricingRule(ingredient, price);
    }
    if (rules !== undefined) {
      await updateDietaryRulesItem(ingredient, rules);
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
