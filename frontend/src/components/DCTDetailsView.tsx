"use client";

import { useState } from "react";
import { useAppState, GB_DCT_Token } from "@/context/StateContext";
import { Shield, Key, Clock, Copy, Check, ChevronDown, ChevronUp, AlertCircle, Database, Coins, BookOpen } from "lucide-react";
import { DripCoffeeSketch } from "@/components/BackgroundDrawings";

export default function DCTDetailsView() {
  const { tokens, activeTokenId, setActiveTokenId } = useAppState();

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("root");

  // Selected Token
  const activeToken = tokens.find((t) => t.id === activeTokenId) || tokens[0] || null;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const getStatusBadge = (status: GB_DCT_Token["status"]) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#1d3a2b]/10 text-[#1d3a2b] border border-[#1d3a2b]/25">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1d3a2b] animate-pulse" />
            ACTIVE / SECURED
          </span>
        );
      case "REDEEMED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            REDEEMED
          </span>
        );
      case "INVALIDATED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            INVALIDATED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 relative overflow-hidden">
      <DripCoffeeSketch className="opacity-[0.06] stroke-[#1d3a2b] -left-10" />

      {/* Page Title */}
      <div>
        <h2 className="text-3xl font-extrabold text-[#1d3a2b] tracking-tight">Security Token Explorer</h2>
        <p className="text-[#1d3a2b]/70 text-sm mt-1">
          Cryptographic details of active Generation-Bound Dynamic Commitment Tokens.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Panel: Token List (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#e9e5da] rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#1d3a2b]/60 border-b border-[#f4f1ea] pb-3 font-bold">
            Registry Index ({tokens.length})
          </h3>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {tokens.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <AlertCircle className="w-8 h-8 text-[#1d3a2b]/30 mx-auto" />
                <p className="text-xs text-[#1d3a2b]/50">No tokens generated in current session.</p>
              </div>
            ) : (
              tokens.map((token) => {
                const isActive = activeToken?.id === token.id;
                return (
                  <button
                    key={token.id}
                    onClick={() => setActiveTokenId(token.id)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs font-mono transition-all flex items-center justify-between gap-3 ${
                      isActive
                        ? "bg-[#f4f1ea] border-[#e59b27]/30 text-[#1d3a2b]"
                        : "bg-[#fffdf9]/40 border-[#e9e5da] text-[#1d3a2b]/70 hover:bg-white"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-[#1d3a2b]/40" />
                        <span>{token.id}</span>
                      </div>
                      <div className="text-[10px] text-[#1d3a2b]/50 truncate max-w-[150px] font-sans font-bold">{token.dish.name}</div>
                    </div>
                    <div>
                      {token.status === "ACTIVE" && <span className="w-2 h-2 rounded-full bg-[#1d3a2b]" />}
                      {token.status === "REDEEMED" && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                      {token.status === "INVALIDATED" && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel: Token Inspector (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {activeToken ? (
            <div className="bg-white border border-[#e9e5da] rounded-2xl p-6 space-y-6 relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(229,155,39,0.02),transparent)] pointer-events-none" />

              {/* Inspector Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#f4f1ea] pb-5">
                <div className="space-y-1">
                  <div className="text-xs font-mono text-[#1d3a2b]/40">Token ID</div>
                  <h3 className="text-xl font-bold font-mono text-[#1d3a2b] flex items-center gap-2">
                    {activeToken.id}
                    <button
                      onClick={() => copyToClipboard(activeToken.id, "id")}
                      className="text-[#1d3a2b]/40 hover:text-[#1d3a2b] p-1 rounded"
                    >
                      {copiedField === "id" ? <Check className="w-4 h-4 text-[#1d3a2b]" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </h3>
                </div>
                <div>{getStatusBadge(activeToken.status)}</div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3.5 bg-[#fffdf9] border border-[#e6dfd3] rounded-xl space-y-1">
                  <span className="text-[#1d3a2b]/50 block">Compiled Timestamp</span>
                  <span className="text-[#1d3a2b] font-bold block">{activeToken.timestamp}</span>
                </div>
                <div className="p-3.5 bg-[#fffdf9] border border-[#e6dfd3] rounded-xl space-y-1">
                  <span className="text-[#1d3a2b]/50 block">Lease Expiry Duration</span>
                  <span className="text-[#1d3a2b] font-bold block">{activeToken.expiry}</span>
                </div>
              </div>

              {/* Cryptographic Roots Tree */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#1d3a2b]/60 font-bold">Lease Commitment Roots</h4>

                <div className="space-y-2">
                  {/* Generation Root Card */}
                  <div className="border border-[#e9e5da] bg-[#fffdf9]/60 rounded-xl overflow-hidden shadow-sm">
                    <button
                      onClick={() => toggleSection("root")}
                      className="w-full flex items-center justify-between p-4 text-left font-mono text-xs hover:bg-[#f4f1ea]/40"
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#e59b27]" />
                        <span className="font-bold text-[#1d3a2b]">Generation Signature Root</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[#1d3a2b] font-bold">{activeToken.hashes.generationRoot.substring(0, 16)}...</span>
                        {expandedSection === "root" ? <ChevronUp className="w-4 h-4 text-[#1d3a2b]/60" /> : <ChevronDown className="w-4 h-4 text-[#1d3a2b]/60" />}
                      </div>
                    </button>

                    {expandedSection === "root" && (
                      <div className="p-4 border-t border-[#e9e5da] bg-[#fffdf9]/30 text-xs font-mono space-y-3">
                        <div className="text-[#1d3a2b]/70 leading-relaxed text-[11px] font-semibold">
                          This signature represents a SHA-256 equivalent HMAC hash binding the active state snapshot. If any leaf variable drifts, the computed signature changes, rendering the token mathematically invalid at redemption.
                        </div>
                        <div className="bg-[#f4f1ea] p-2.5 rounded border border-[#e9e5da] flex justify-between items-center break-all font-bold text-[#1d3a2b]">
                          <span>{activeToken.hashes.generationRoot}</span>
                          <button
                            onClick={() => copyToClipboard(activeToken.hashes.generationRoot, "genRoot")}
                            className="text-[#1d3a2b]/40 hover:text-[#1d3a2b] ml-2"
                          >
                            {copiedField === "genRoot" ? <Check className="w-3.5 h-3.5 text-[#1d3a2b]" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Leaf Hashes List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Pantry Hash */}
                    <div className="border border-[#e9e5da] bg-[#fffdf9]/30 p-4 rounded-xl space-y-3 text-xs font-mono shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[#1d3a2b] font-bold flex items-center gap-1.5">
                          <Database className="w-3.5 h-3.5 text-[#1d3a2b]/40" />
                          Inventory Snapshot
                        </span>
                        <span className="text-[10px] text-[#1d3a2b]/50 font-bold">{activeToken.hashes.inventorySnapshotHash}</span>
                      </div>
                      <div className="text-[11px] text-[#1d3a2b]/60 leading-relaxed font-semibold">
                        Locks Pantry reserves: {activeToken.dish.ingredients.join(", ")}.
                      </div>
                    </div>

                    {/* Pricing Hash */}
                    <div className="border border-[#e9e5da] bg-[#fffdf9]/30 p-4 rounded-xl space-y-3 text-xs font-mono shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[#1d3a2b] font-bold flex items-center gap-1.5">
                          <Coins className="w-3.5 h-3.5 text-[#1d3a2b]/40" />
                          Pricing Snapshot
                        </span>
                        <span className="text-[10px] text-[#1d3a2b]/50 font-bold">{activeToken.hashes.pricingSnapshotHash}</span>
                      </div>
                      <div className="text-[11px] text-[#1d3a2b]/60 leading-relaxed font-semibold">
                        Locks ingredient prices at signing: total cost ₹{activeToken.dish.estimatedCost}.
                      </div>
                    </div>

                    {/* Dietary Hash */}
                    <div className="border border-[#e9e5da] bg-[#fffdf9]/30 p-4 rounded-xl space-y-3 text-xs font-mono shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[#1d3a2b] font-bold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#1d3a2b]/40" />
                          Dietary Snapshot
                        </span>
                        <span className="text-[10px] text-[#1d3a2b]/50 font-bold">{activeToken.hashes.dietaryHash}</span>
                      </div>
                      <div className="text-[11px] text-[#1d3a2b]/60 leading-relaxed font-semibold">
                        Locks dietary classifications: {activeToken.constraints.dietary.join(", ") || "None"}.
                      </div>
                    </div>

                    {/* AI Artifact Root */}
                    <div className="border border-[#e9e5da] bg-[#fffdf9]/30 p-4 rounded-xl space-y-3 text-xs font-mono shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[#1d3a2b] font-bold flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-[#1d3a2b]/40" />
                          AI Artifact Root
                        </span>
                        <span className="text-[10px] text-[#1d3a2b]/50 font-bold">{activeToken.hashes.artifactRoot}</span>
                      </div>
                      <div className="text-[11px] text-[#1d3a2b]/60 leading-relaxed font-semibold">
                        Decision tree binding: user parameters matched to synthesis model.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#e9e5da] rounded-2xl p-12 text-center space-y-4 shadow-sm">
              <Shield className="w-12 h-12 text-[#1d3a2b]/30 mx-auto" />
              <div className="space-y-1.5">
                <h4 className="font-bold text-[#1d3a2b]/70">No Security Lease Inspected</h4>
                <p className="text-xs text-[#1d3a2b]/50 max-w-sm mx-auto leading-relaxed font-semibold">
                  First create a secure token lease on the <strong>Generate Dish</strong> portal to populate and audit cryptographic records.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
