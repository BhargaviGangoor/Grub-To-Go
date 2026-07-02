import { NextResponse } from "next/server";
import { getPantry, getPricing, getDietaryRules, getTelemetryLogs, getStats, getTokens } from "@/lib/db";

export async function GET() {
  try {
    const inventory = await getPantry();
    const pricing = await getPricing();
    const dietaryRules = await getDietaryRules();
    const driftHistory = await getTelemetryLogs();
    const stats = await getStats();
    const tokens = await getTokens();

    return NextResponse.json({
      state: {
        inventory,
        pricing,
        dietaryRules,
        driftHistory,
        stats
      },
      tokens
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
