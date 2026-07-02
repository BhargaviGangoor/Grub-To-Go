import { NextResponse } from "next/server";
import { getPantry, getPricing, getDietaryRules, saveToken } from "@/lib/db";
import { generateHash, createGenerationRoot, createDCT } from "@/lib/security";

const JWT_SECRET = process.env.JWT_SECRET || "grubtogo-super-secret-key-12345";

export async function POST(request: Request) {
  try {
    const { dish, constraints } = await request.json();

    const pantry = await getPantry();
    const pricing = await getPricing();
    const dietaryRules = await getDietaryRules();

    const ingredients: string[] = dish.ingredients;

    const invSnap = ingredients.map((ing) => ({ name: ing, qty: pantry[ing] ?? 0 }));
    const priceSnap = ingredients.map((ing) => ({ name: ing, price: pricing[ing] ?? 0 }));
    const dietarySnap = ingredients.map((ing) => ({ name: ing, rules: dietaryRules[ing] ?? [] }));

    const inventoryHash = generateHash(JSON.stringify(invSnap));
    const pricingHash = generateHash(JSON.stringify(priceSnap));
    const dietaryHash = generateHash(JSON.stringify(dietarySnap));
    const artifactRoot = generateHash(dish.id + JSON.stringify(ingredients) + constraints.budget);
    const generationRoot = createGenerationRoot(inventoryHash, pricingHash, dietaryHash, artifactRoot);

    const randTokenId = "GB-DCT-2026-" + Math.random().toString(36).substring(2, 6).toUpperCase();
    const expiryTime = new Date(Date.now() + 20 * 60 * 1000).toLocaleTimeString();

    const signature = createDCT(generationRoot, "redeem_dish:" + dish.id, JWT_SECRET);

    const tokenObj = {
      id: randTokenId,
      timestamp: new Date().toLocaleTimeString(),
      expiry: expiryTime,
      status: "ACTIVE",
      dish: dish,
      constraints: constraints,
      hashes: {
        inventorySnapshotHash: inventoryHash,
        pricingSnapshotHash: pricingHash,
        dietaryHash,
        artifactRoot,
        generationRoot,
        signature
      },
      originalState: {
        inventory: pantry,
        pricing: pricing,
        dietaryRules: dietaryRules
      }
    };

    await saveToken(tokenObj);

    return NextResponse.json({ token: tokenObj });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
