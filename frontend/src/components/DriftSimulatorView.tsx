"use client";

import { useState } from "react";
import { useAppState } from "@/context/StateContext";
import { Database, AlertTriangle, Play, RefreshCcw, Trash2, Coins, Ban } from "lucide-react";
import { BenThanhMarketDrawing } from "@/components/BackgroundDrawings";

export default function DriftSimulatorView() {
  const { systemState, updateInventory, updatePricing, injectDrift, resetSystemState, driftHistory } = useAppState();

  // Selected ingredient to edit directly
  const [selectedIngredient, setSelectedIngredient] = useState<string>("Paneer");
  const [newQty, setNewQty] = useState<number>(5);
  const [newPrice, setNewPrice] = useState<number>(200);

  const ingredientsList = Object.keys(systemState.inventory);

  const handleUpdateDirect = () => {
    updateInventory(selectedIngredient, newQty);
    updatePricing(selectedIngredient, newPrice);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 relative overflow-hidden">
      <BenThanhMarketDrawing className="opacity-[0.06] stroke-[#1d3a2b] -top-10" />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e9e5da] pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-[#1d3a2b] tracking-tight">World State Database & Drift Simulator</h2>
          <p className="text-[#1d3a2b]/70 text-sm mt-1">
            Simulate supplier and market events to test self-invalidation algorithms under Commitment Amplification risks.
          </p>
        </div>

        <button
          onClick={resetSystemState}
          className="flex items-center gap-1.5 px-4 py-2 border border-[#e9e5da] bg-white hover:bg-[#fffdf9] text-xs font-mono font-bold text-[#1d3a2b] rounded-xl shadow-sm transition-all"
        >
          <RefreshCcw className="w-3.5 h-3.5 text-[#e59b27]" />
          <span>Reset Database</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Database Monitor (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#e9e5da] rounded-2xl p-6 space-y-6 shadow-sm">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#1d3a2b]/60 border-b border-[#f4f1ea] pb-3 font-bold">
            Live Kitchen Database Tables
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs text-left">
              <thead>
                <tr className="text-[#1d3a2b]/40 border-b border-[#f4f1ea]">
                  <th className="pb-3 font-bold uppercase tracking-wider">Ingredient</th>
                  <th className="pb-3 font-bold uppercase tracking-wider">Quantity</th>
                  <th className="pb-3 font-bold uppercase tracking-wider">Price (₹)</th>
                  <th className="pb-3 font-bold uppercase tracking-wider">Dietary Flags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f1ea] text-[#1d3a2b]/95 font-semibold">
                {ingredientsList.map((ing) => {
                  const qty = systemState.inventory[ing];
                  const price = systemState.pricing[ing];
                  const rules = systemState.dietaryRules[ing] || [];
                  const isOut = qty <= 0;

                  return (
                    <tr
                      key={ing}
                      onClick={() => {
                        setSelectedIngredient(ing);
                        setNewQty(qty);
                        setNewPrice(price);
                      }}
                      className={`hover:bg-[#f4f1ea]/30 cursor-pointer transition-colors ${
                        selectedIngredient === ing ? "bg-[#f4f1ea]/50 font-bold" : ""
                      }`}
                    >
                      <td className="py-3.5 flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${isOut ? "bg-rose-500 animate-pulse" : "bg-[#1d3a2b]"}`} />
                        <span>{ing}</span>
                      </td>
                      <td className={`py-3.5 ${isOut ? "text-rose-600 font-bold" : "text-[#1d3a2b]"}`}>{qty} units</td>
                      <td className="py-3.5">₹{price}</td>
                      <td className="py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {rules.map((r) => (
                            <span key={r} className="px-1.5 py-0.5 bg-[#e59b27]/10 text-[#e59b27] border border-[#e59b27]/15 text-[9px] rounded font-bold">
                              {r}
                            </span>
                          ))}
                          {rules.length === 0 && <span className="text-[#1d3a2b]/40">-</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Direct Editor Drawer */}
          {selectedIngredient && (
            <div className="border-t border-[#f4f1ea] pt-5 space-y-4">
              <h4 className="text-xs font-mono uppercase text-[#e59b27] font-bold">Direct State Editor: {selectedIngredient}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#1d3a2b]/50 block">Quantity</label>
                  <input
                    type="number"
                    value={newQty}
                    onChange={(e) => setNewQty(Number(e.target.value))}
                    className="w-full bg-[#fffdf9] border border-[#e9e5da] focus:border-[#e59b27] rounded-lg p-2 font-mono text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#1d3a2b]/50 block">Price (₹)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-[#fffdf9] border border-[#e9e5da] focus:border-[#e59b27] rounded-lg p-2 font-mono text-xs focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleUpdateDirect}
                  className="py-2 px-3 bg-[#1d3a2b] hover:bg-[#14281e] text-[#f4f1ea] font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 text-[#e59b27]" />
                  <span>Push Changes</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Drift Controllers & Logs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Inject Drift Scenarios Card */}
          <div className="bg-white border border-[#e9e5da] rounded-2xl p-6 space-y-5 shadow-sm">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#e59b27] font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#e59b27]" />
              Inject Drift Scenarios
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {/* Scenario 1 */}
              <button
                onClick={() => injectDrift("stockout")}
                className="w-full text-left p-3.5 rounded-xl border border-[#e9e5da] hover:border-[#1d3a2b]/30 bg-[#fffdf9] transition-all flex items-center justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <div className="text-xs font-bold font-mono text-[#1d3a2b] flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Deplete Paneer Stocks (Outage)</span>
                  </div>
                  <p className="text-[10px] text-[#1d3a2b]/65 font-medium leading-relaxed">
                    Set Paneer quantity to 0. Invalidates any active paneer udon lease.
                  </p>
                </div>
                <Play className="w-4 h-4 text-[#1d3a2b]/40 group-hover:text-[#e59b27] transition-colors flex-shrink-0" />
              </button>

              {/* Scenario 2 */}
              <button
                onClick={() => injectDrift("inflation")}
                className="w-full text-left p-3.5 rounded-xl border border-[#e9e5da] hover:border-[#1d3a2b]/30 bg-[#fffdf9] transition-all flex items-center justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <div className="text-xs font-bold font-mono text-[#1d3a2b] flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-500" />
                    <span>Inflate Saffron Costs (+300%)</span>
                  </div>
                  <p className="text-[10px] text-[#1d3a2b]/65 font-medium leading-relaxed">
                    Increases Saffron price to ₹400. Breaks budget validation policies.
                  </p>
                </div>
                <Play className="w-4 h-4 text-[#1d3a2b]/40 group-hover:text-[#e59b27] transition-colors flex-shrink-0" />
              </button>

              {/* Scenario 3 */}
              <button
                onClick={() => injectDrift("allergen")}
                className="w-full text-left p-3.5 rounded-xl border border-[#e9e5da] hover:border-[#1d3a2b]/30 bg-[#fffdf9] transition-all flex items-center justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <div className="text-xs font-bold font-mono text-[#1d3a2b] flex items-center gap-1.5">
                    <Ban className="w-3.5 h-3.5 text-orange-500" />
                    <span>Allergen Rules Shift (Heavy Cream)</span>
                  </div>
                  <p className="text-[10px] text-[#1d3a2b]/65 font-medium leading-relaxed">
                    De-classify Heavy Cream from Vegetarian. Triggers policy violation.
                  </p>
                </div>
                <Play className="w-4 h-4 text-[#1d3a2b]/40 group-hover:text-[#e59b27] transition-colors flex-shrink-0" />
              </button>
            </div>
          </div>

          {/* Database Log Console */}
          <div className="bg-[#14281e] border border-[#1d3a2b]/30 rounded-2xl p-5 font-mono text-xs text-[#f4f1ea]/80 space-y-3">
            <div className="text-[10px] text-[#f4f1ea]/50 border-b border-[#1d3a2b] pb-2 flex justify-between font-bold">
              <span>DATABASE MUTATION LOGS</span>
              <span>LIVE FEED</span>
            </div>
            <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
              {driftHistory.map((history, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-[#f4f1ea]/40">[{history.timestamp}]</span>
                  <span className={history.action.includes("DRIFT") ? "text-[#e59b27]" : "text-emerald-500/80"}>
                    {history.action}
                  </span>
                </div>
              ))}
              {driftHistory.length === 0 && (
                <div className="text-[#f4f1ea]/40 text-center py-4">
                  No DB mutations recorded yet. Trigger a drift to view feeds.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
