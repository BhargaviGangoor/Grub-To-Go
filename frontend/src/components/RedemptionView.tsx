"use client";

import { useState, useEffect } from "react";
import { useAppState } from "@/context/StateContext";
import { CheckCircle2, AlertTriangle, Key, Terminal, ArrowRight, ShieldCheck, RefreshCw, Cpu } from "lucide-react";
import { PaddlingBoatDrawing } from "@/components/BackgroundDrawings";

export default function RedemptionView() {
  const { tokens, activeTokenId, redeemToken } = useAppState();

  const [tokenIdInput, setTokenIdInput] = useState("");
  const [securityMode, setSecurityMode] = useState<"gb-dct" | "standard">("gb-dct");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationOutcome, setVerificationOutcome] = useState<any | null>(null);

  // Sync token ID input with active token
  useEffect(() => {
    if (activeTokenId) {
      setTokenIdInput(activeTokenId);
    } else if (tokens.length > 0) {
      setTokenIdInput(tokens[0].id);
    }
  }, [activeTokenId, tokens]);

  const handleRedeem = async () => {
    if (!tokenIdInput.trim()) {
      alert("Please enter a valid Token ID.");
      return;
    }

    setIsVerifying(true);
    setVerificationOutcome(null);

    // Simulate cryptographic validation latency
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const result = await redeemToken(tokenIdInput.trim(), securityMode);
    setVerificationOutcome(result);
    setIsVerifying(false);
  };

  const getActiveTokenInfo = () => {
    return tokens.find((t) => t.id === tokenIdInput.trim());
  };

  const selectedToken = getActiveTokenInfo();

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 relative overflow-hidden">
      <PaddlingBoatDrawing className="opacity-[0.06] stroke-[#1d3a2b] -bottom-10" />

      {/* Page Title */}
      <div>
        <h2 className="text-3xl font-extrabold text-[#1d3a2b] tracking-tight">Redemption Attestation Terminal</h2>
        <p className="text-[#1d3a2b]/70 text-sm mt-1">
          Verify and execute signed tokens against real-time kitchen resource and pricing layers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Control Panel: (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#e9e5da] rounded-2xl p-6 space-y-6 shadow-sm">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#e59b27] font-bold">Validation Protocol</h3>

          {/* Token Selection */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-[#1d3a2b]/70 block">Active Token ID</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#1d3a2b]/50">
                <Key className="w-4 h-4" />
              </span>
              <input
                type="text"
                className="w-full bg-[#fffdf9] border border-[#e9e5da] focus:border-[#e59b27] rounded-lg py-2.5 pl-9 pr-4 text-[#1d3a2b] placeholder-[#1d3a2b]/40 font-mono text-xs focus:outline-none"
                value={tokenIdInput}
                onChange={(e) => setTokenIdInput(e.target.value)}
                placeholder="GB-DCT-2026-XXXX"
              />
            </div>
            {tokens.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tokens.slice(0, 3).map((token) => (
                  <button
                    key={token.id}
                    onClick={() => setTokenIdInput(token.id)}
                    className="px-2 py-0.5 border border-[#e9e5da] hover:border-[#1d3a2b]/40 bg-[#fffdf9] text-[10px] font-mono text-[#1d3a2b]/60 rounded hover:text-[#1d3a2b]"
                  >
                    {token.id}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Verification Protocol selection */}
          <div className="space-y-3">
            <label className="text-xs font-mono text-[#1d3a2b]/70 block">Verification Protocol Mode</label>
            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={() => setSecurityMode("gb-dct")}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  securityMode === "gb-dct"
                    ? "bg-[#1d3a2b]/5 border-[#1d3a2b]/40 text-[#1d3a2b]"
                    : "bg-[#fffdf9] border-[#e9e5da] text-[#1d3a2b]/70 hover:border-[#1d3a2b]"
                }`}
              >
                <div className="text-xs font-bold font-mono flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#e59b27]" />
                  <span>Generation-Bound DCT (GB-DCT)</span>
                </div>
                <div className="text-[10px] text-[#1d3a2b]/60 mt-1 font-sans font-medium">
                  Enforces strict World State alignment. Self-invalidates on any state drift.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSecurityMode("standard")}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  securityMode === "standard"
                    ? "bg-[#e59b27]/5 border-[#e59b27]/40 text-[#e59b27]"
                    : "bg-[#fffdf9] border-[#e9e5da] text-[#1d3a2b]/70 hover:border-[#1d3a2b]"
                }`}
              >
                <div className="text-xs font-bold font-mono flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-[#1d3a2b]/60" />
                  <span>Standard DCT (Vulnerable Legacy)</span>
                </div>
                <div className="text-[10px] text-[#1d3a2b]/60 mt-1 font-sans font-medium">
                  Validates signature payload only. Ignores state fluctuations (Vulnerable to drift).
                </div>
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleRedeem}
            disabled={isVerifying}
            className="w-full py-3 bg-[#1d3a2b] hover:bg-[#14281e] disabled:bg-[#1d3a2b]/50 text-[#f4f1ea] font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#e59b27]" />
                <span>Running Attestation Audit...</span>
              </>
            ) : (
              <>
                <Terminal className="w-4 h-4 text-[#e59b27]" />
                <span>Redeem Lease Token</span>
              </>
            )}
          </button>
        </div>

        {/* Right Verification Logs and States: (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {verificationOutcome ? (
            <div className="space-y-6">
              {/* SUCCESS STATE */}
              {verificationOutcome.outcome === "success" && (
                <div className="bg-[#1d3a2b]/10 border border-[#1d3a2b]/35 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-[#1d3a2b]" />
                    <div>
                      <h4 className="text-base font-bold text-[#1d3a2b]">Token Redeemed Successfully</h4>
                      <p className="text-xs text-[#1d3a2b]/70 mt-0.5 font-semibold">Physical lease verified. Kitchen order fired.</p>
                    </div>
                  </div>

                  <div className="border-t border-[#1d3a2b]/15 pt-4 space-y-2 text-xs font-mono text-[#1d3a2b]/95 font-bold">
                    <div className="flex justify-between">
                      <span>✓ Validation Passed:</span>
                      <span>100% Cryptographic Match</span>
                    </div>
                    <div className="flex justify-between">
                      <span>✓ Inventory Consistent:</span>
                      <span>Reservations Locked</span>
                    </div>
                    <div className="flex justify-between">
                      <span>✓ Pricing Consistent:</span>
                      <span>Cost Stable</span>
                    </div>
                    <div className="flex justify-between">
                      <span>✓ Artifact Verified:</span>
                      <span>Hash Sealed</span>
                    </div>
                  </div>
                </div>
              )}

              {/* BLOCKED STATE */}
              {verificationOutcome.outcome === "blocked" && (
                <div className="bg-[#e59b27]/10 border border-[#e59b27]/30 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-[#e59b27]" />
                    <div>
                      <h4 className="text-base font-bold text-[#e59b27]">State Drift Halted (Secure Block)</h4>
                      <p className="text-xs text-[#1d3a2b]/70 mt-0.5 font-semibold">GB-DCT detected drift and self-invalidated. Harm prevented.</p>
                    </div>
                  </div>

                  <div className="border-t border-[#e59b27]/15 pt-4 space-y-2 text-xs font-mono text-[#1d3a2b]/70">
                    <div className="flex justify-between text-[#1d3a2b]/90 font-bold">
                      <span>✓ Token Signature Integrity:</span>
                      <span>Structurally Authentic</span>
                    </div>
                    <div className="flex justify-between text-[#e59b27] font-bold">
                      <span>⚠ World State Drift Detected:</span>
                      <span>Invalidated</span>
                    </div>
                    <div className="flex justify-between text-[#e59b27] font-bold">
                      <span>⚠ Inventory Mismatch:</span>
                      <span>Outages found</span>
                    </div>
                  </div>
                </div>
              )}

              {/* AMPLIFIED STATE (FAILURE) */}
              {verificationOutcome.outcome === "amplified" && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-8 h-8 text-rose-600 animate-pulse" />
                    <div>
                      <h4 className="text-base font-bold text-rose-700">Commitment Amplification Event</h4>
                      <p className="text-xs text-rose-900 mt-0.5 font-semibold">Standard bypass forced transaction execution on drifted parameters!</p>
                    </div>
                  </div>

                  <div className="border-t border-rose-200 pt-4 space-y-2 text-xs font-mono text-rose-700 font-bold">
                    <div className="flex justify-between">
                      <span>✓ Signature Payload Validation:</span>
                      <span>Passed</span>
                    </div>
                    <div className="flex justify-between text-amber-700">
                      <span>⚠ Price Drift Executed:</span>
                      <span>Cost Inflated</span>
                    </div>
                    <div className="flex justify-between text-rose-700">
                      <span>⚠ Stock Discrepancy Fired:</span>
                      <span>Physical Shortage Mismatch</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Logs Console */}
              <div className="bg-[#14281e] border border-[#1d3a2b]/30 rounded-2xl p-5 font-mono text-xs text-[#f4f1ea]/80 space-y-2 max-h-[200px] overflow-y-auto">
                <div className="text-[10px] text-[#f4f1ea]/50 border-b border-[#1d3a2b] pb-2 mb-2 flex justify-between">
                  <span>ATTESTATION SYSTEM LOGS</span>
                  <span>MODE: {securityMode.toUpperCase()}</span>
                </div>
                {verificationOutcome.logs.map((log: string, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-[#f4f1ea]/40">[{idx}]</span>
                    <span className={log.includes("🛑") || log.includes("🚨") || log.includes("⚠️") ? "text-[#e59b27] font-bold" : ""}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>

              {/* State Comparison Detail */}
              {selectedToken && (
                <div className="border border-[#e9e5da] rounded-2xl overflow-hidden bg-white shadow-sm">
                  <div className="bg-[#fffdf9] px-4 py-2 text-[10px] font-mono text-[#1d3a2b]/60 border-b border-[#e9e5da] uppercase tracking-wider font-bold">
                    Before vs. After State Comparison
                  </div>

                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    {/* Left: Token generation snapshot */}
                    <div className="space-y-3.5">
                      <h5 className="font-bold text-[#1d3a2b]/60 border-b border-[#f4f1ea] pb-2 uppercase tracking-wide">
                        Original Commitment State
                      </h5>
                      <div className="space-y-2 text-[#1d3a2b]/70 font-semibold">
                        <div className="flex justify-between">
                          <span>Token Cost:</span>
                          <span className="text-[#1d3a2b]">₹{verificationOutcome.beforeState.cost}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="block text-[10px] text-[#1d3a2b]/50">Reserved Pantry:</span>
                          {Object.entries(verificationOutcome.beforeState.inventory).map(([ing, qty]: any) => (
                            <div key={ing} className="flex justify-between pl-2 text-[11px] text-[#1d3a2b]/80">
                              <span>{ing}:</span>
                              <span>{qty}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Live verification snapshot */}
                    <div className="space-y-3.5 border-t sm:border-t-0 sm:border-l border-[#f4f1ea] pt-4 sm:pt-0 sm:pl-4">
                      <h5 className="font-bold text-[#1d3a2b]/60 border-b border-[#f4f1ea] pb-2 uppercase tracking-wide">
                        Live Redemption State
                      </h5>
                      <div className="space-y-2 text-[#1d3a2b]/70 font-semibold">
                        <div className="flex justify-between">
                          <span>Live Cost:</span>
                          <span className={verificationOutcome.afterState.cost > selectedToken.constraints.budget ? "text-rose-600 font-bold" : "text-[#1d3a2b]"}>
                            ₹{verificationOutcome.afterState.cost}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="block text-[10px] text-[#1d3a2b]/50">Actual Pantry:</span>
                          {Object.entries(verificationOutcome.afterState.inventory).map(([ing, qty]: any) => {
                            const isOut = qty.includes("(0 units)");
                            return (
                              <div key={ing} className={`flex justify-between pl-2 text-[11px] ${isOut ? "text-rose-600 font-bold" : "text-[#1d3a2b]/80"}`}>
                                <span>{ing}:</span>
                                <span>{qty}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-[#e9e5da] border-dashed rounded-2xl p-12 text-center space-y-4 min-h-[350px] flex flex-col items-center justify-center shadow-sm">
              <Terminal className="w-10 h-10 text-[#1d3a2b]/30" />
              <div className="space-y-1.5">
                <h4 className="font-bold text-[#1d3a2b]/75">Waiting for Redemption Handshake</h4>
                <p className="text-xs text-[#1d3a2b]/50 max-w-xs mx-auto leading-relaxed font-semibold">
                  Provide a Token ID in the control panel and trigger execution. The cryptographic validation engine will audit alignments.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
