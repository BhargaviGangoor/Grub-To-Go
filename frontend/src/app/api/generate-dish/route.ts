import { NextResponse } from "next/server";
import { getPantry } from "@/lib/db";
import { generateDish } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const { budget, dietary, cuisine, spiceLevel, images } = await request.json();
    const pantry = await getPantry();
    const availableIngredients = Object.keys(pantry).filter((k) => pantry[k] > 0);

    const result = await generateDish(
      cuisine || "Any",
      dietary || [],
      spiceLevel || "Medium",
      budget || 300,
      availableIngredients,
      images || []
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
