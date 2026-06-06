import { useState } from "react";

interface DriftEmulatorProps {
  originalCost: number;
  originalIngredients: string[];
  budgetLimit: number;
  onRedeem: (params: {
    simulatedPrice: number;
    simulatedInventory: string[];
    simulatedDietary: string[];
    securityMode: "standard" | "gb-dct";
  }) => void;
  isRedeeming: boolean;
}

export default function DriftEmulator({
  originalCost,
  originalIngredients,
  budgetLimit,
  onRedeem,
  isRedeeming,
}: DriftEmulatorProps) {
  const [securityMode, setSecurityMode] = useState<"standard" | "gb-dct">("gb-dct");
  const [priceDrift, setPriceDrift] = useState(false);
  const [inventoryShortage, setInventoryShortage] = useState(false);
  const [dietaryViolation, setDietaryViolation] = useState(false);

  const simulatedPrice = priceDrift ? Math.max(originalCost + 120, budgetLimit > 0 ? budgetLimit + 50 : 380) : originalCost;
  const simulatedInventory = inventoryShortage
    ? originalIngredients.filter((_, idx) => idx !== 1)
    : originalIngredients;
  const simulatedDietary = dietaryViolation
    ? [...originalIngredients, "Beef Fat Stabilizer"]
    : originalIngredients;

  const handleRedemptionClick = () => {
    onRedeem({
      simulatedPrice,
      simulatedInventory,
      simulatedDietary,
      securityMode,
    });
  };

  return (
    <div className="w-full mt-6 animate-slide-up">
      <h2 className="text-xs font-bold text-brand/80 uppercase tracking-wider mb-3 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-brand-orange"></span>
        VI. Temporal Drift Simulation Sandbox
      </h2>

      <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm">
        <p className="text-xs text-zinc-500 italic mb-5 leading-relaxed">
          Simulate environmental changes that occur during the <strong>Temporal Gap</strong> between token generation and final kitchen redemption. Inject state drifts to test the validation engine.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Drifts & Security Mode */}
          <div className="flex flex-col gap-5">
            {/* Security Mode Selector */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                1. Select Verification Model
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSecurityMode("standard")}
                  className={`flex-1 text-xs border py-3 px-3 rounded-xl transition-all font-bold ${
                    securityMode === "standard"
                      ? "bg-rose-50 border-rose-300 text-rose-700 shadow-sm"
                      : "bg-white border-zinc-200 hover:border-brand/40 text-brand/85"
                  }`}
                >
                  Standard Token
                  <span className="text-[10px] opacity-75 block font-medium mt-0.5">(Vulnerable to Drift)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSecurityMode("gb-dct")}
                  className={`flex-1 text-xs border py-3 px-3 rounded-xl transition-all font-bold ${
                    securityMode === "gb-dct"
                      ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm"
                      : "bg-white border-zinc-200 hover:border-brand/40 text-brand/85"
                  }`}
                >
                  Generation-Bound Token
                  <span className="text-[10px] opacity-75 block font-medium mt-0.5">(Self-Invalidating)</span>
                </button>
              </div>
            </div>

            {/* Drift Injections */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2.5">
                2. Inject Temporal State Drift
              </label>
              <div className="flex flex-col gap-2.5">
                {/* Price Drift */}
                <label className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100/50 transition-all cursor-pointer select-none">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-brand">Price Inflation Drift</span>
                    <span className="text-[10px] text-zinc-500 italic">Price rises from ₹{originalCost} to ₹{simulatedPrice}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={priceDrift}
                    onChange={(e) => setPriceDrift(e.target.checked)}
                    className="accent-brand h-4 w-4 rounded border-zinc-300"
                  />
                </label>

                {/* Inventory Drift */}
                <label className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100/50 transition-all cursor-pointer select-none">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-brand">Kitchen Ingredient Shortage</span>
                    <span className="text-[10px] text-zinc-500 italic">Key ingredient went out of stock</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={inventoryShortage}
                    onChange={(e) => setInventoryShortage(e.target.checked)}
                    className="accent-brand h-4 w-4 rounded border-zinc-300"
                  />
                </label>

                {/* Dietary Drift */}
                <label className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100/50 transition-all cursor-pointer select-none">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-brand">Allergen / Supplier Impurity</span>
                    <span className="text-[10px] text-zinc-500 italic">Animal fat stabilizer added by supplier</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={dietaryViolation}
                    onChange={(e) => setDietaryViolation(e.target.checked)}
                    className="accent-brand h-4 w-4 rounded border-zinc-300"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Column 2: Live Ground Truth */}
          <div className="flex flex-col justify-between bg-zinc-50 border border-zinc-200 rounded-2xl p-5">
            <div>
              <h4 className="text-xs font-bold text-brand uppercase tracking-wider mb-3.5 border-b border-zinc-150 pb-2">
                Live Kitchen State
              </h4>
              <div className="flex flex-col gap-3.5 text-xs">
                <div className="flex justify-between items-center py-1">
                  <span className="text-zinc-500 font-bold">Simulated Recipe Cost:</span>
                  <span className={`font-bold ${priceDrift ? "text-rose-600" : "text-brand"}`}>
                    ₹{simulatedPrice} {priceDrift && <span className="text-[10px] font-semibold">(Over Budget! ⚠️)</span>}
                  </span>
                </div>
                <div className="flex justify-between items-start py-1 border-t border-zinc-150 pt-2.5">
                  <span className="text-zinc-500 font-bold">Inventory Check:</span>
                  <div className="text-right flex flex-col items-end gap-1">
                    {inventoryShortage ? (
                      <>
                        <span className="text-rose-600 font-bold">Shortage Detected ⚠️</span>
                        <span className="text-[9px] text-zinc-400 font-semibold">Missing key item</span>
                      </>
                    ) : (
                      <span className="text-emerald-700 font-bold">In Stock ✓</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-start py-1 border-t border-zinc-150 pt-2.5">
                  <span className="text-zinc-500 font-bold">Dietary Status:</span>
                  <div className="text-right flex flex-col items-end">
                    {dietaryViolation ? (
                      <span className="text-rose-600 font-bold">Impurity Detected! ⚠️</span>
                    ) : (
                      <span className="text-emerald-700 font-bold">Preferences Honored ✓</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-150">
              <button
                type="button"
                onClick={handleRedemptionClick}
                disabled={isRedeeming}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand text-white hover:bg-brand-light transition-all font-bold text-sm shadow-sm disabled:opacity-50"
              >
                <span>Execute Token Redemption Verification</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
