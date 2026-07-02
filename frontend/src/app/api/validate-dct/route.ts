import { NextResponse } from "next/server";
import { getToken } from "@/lib/db";
import { createDCT } from "@/lib/security";

const JWT_SECRET = process.env.JWT_SECRET || "grubtogo-super-secret-key-12345";

export async function POST(request: Request) {
  try {
    const { tokenId } = await request.json();

    const token = await getToken(tokenId);
    if (!token) {
      return NextResponse.json({ valid: false, error: "Token not found" }, { status: 404 });
    }

    const recomputedSignature = createDCT(token.hashes.generationRoot, "redeem_dish:" + token.dish.id, JWT_SECRET);
    const valid = recomputedSignature === token.hashes.signature;

    return NextResponse.json({
      valid,
      details: {
        tokenId,
        generationRoot: token.hashes.generationRoot,
        expectedSignature: token.hashes.signature,
        computedSignature: recomputedSignature
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
