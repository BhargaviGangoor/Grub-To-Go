import { NextResponse } from "next/server";
import { resetDatabase, getPantry, getPricing, getDietaryRules, getTelemetryLogs, getStats } from "@/lib/db";

export async function POST() {
  try {
    await resetDatabase();
    
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
