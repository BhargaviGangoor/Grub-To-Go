import { useState, useEffect, useRef } from "react";

interface RedemptionTerminalProps {
  token: string;
  securityMode: "standard" | "gb-dct";
  simulatedPrice: number;
  simulatedInventory: string[];
  simulatedDietary: string[];
  originalCost: number;
  originalIngredients: string[];
  budgetLimit: number;
  isRedeeming: boolean;
  onFinished: () => void;
}

interface LogEntry {
  text: string;
  status: "info" | "pending" | "success" | "warning" | "error";
  time: string;
}

export default function RedemptionTerminal({
  token,
  securityMode,
  simulatedPrice,
  simulatedInventory,
  simulatedDietary,
  originalCost,
  originalIngredients,
  budgetLimit,
  isRedeeming,
  onFinished,
}: RedemptionTerminalProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [verificationOutcome, setVerificationOutcome] = useState<"success" | "blocked" | "amplified" | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const getHash = (value: string, seed: string) => {
    let hash = 0;
    const str = value + seed;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(8, "0").substring(0, 8);
  };

  const origImageHash = "f7a2c18b";
  const origInventoryHash = getHash(JSON.stringify(originalIngredients), "pantry");
  const origBudgetHash = getHash(originalCost.toString(), "gold");
  const origDietaryHash = getHash(JSON.stringify(originalIngredients), "vows");

  const liveImageHash = origImageHash;
  const liveInventoryHash = getHash(JSON.stringify(simulatedInventory), "pantry");
  const liveBudgetHash = getHash(simulatedPrice.toString(), "gold");
  const liveDietaryHash = getHash(JSON.stringify(simulatedDietary), "vows");

  const hasPriceDrift = simulatedPrice !== originalCost;
  const hasInventoryDrift = simulatedInventory.length !== originalIngredients.length;
  const hasDietaryDrift = simulatedDietary.length !== originalIngredients.length;
  const hasAnyDrift = hasPriceDrift || hasInventoryDrift || hasDietaryDrift;

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    if (!isRedeeming) {
      setLogs([]);
      setVerificationOutcome(null);
      setCurrentStep(-1);
      return;
    }

    const runRedemptionVerification = async () => {
      setLogs([]);
      setVerificationOutcome(null);

      const addLog = (text: string, status: LogEntry["status"], delay = 500) => {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            const time = ((performance.now() % 10000) / 1000).toFixed(2) + "s";
            setLogs((prev) => [...prev, { text, status, time }]);
            resolve();
          }, delay);
        });
      };

      await addLog("Initiating redemption handshake with kitchen...", "info");
      await addLog(`Retrieving secure lease token: ${token.substring(0, 16)}...`, "info");
      await addLog("Verification Model: " + (securityMode === "gb-dct" ? "Generation-Bound DCT (GB-DCT)" : "Standard DCT (Legacy)"), "info");

      await addLog("Step 1: Reading immutable token payload elements...", "pending");
      await addLog(`✓ Verification signature decrypted successfully.`, "success");

      await addLog("Step 2: Checking for temporal state drift (Live vs. Generation Root)...", "pending", 800);

      await addLog(`[Image Check] Token root: ${origImageHash} | Live state: ${liveImageHash} ${origImageHash === liveImageHash ? "(MATCH)" : "(MISMATCH)"}`, origImageHash === liveImageHash ? "success" : "error", 400);
      await addLog(`[Pantry Check] Token root: ${origInventoryHash} | Live state: ${liveInventoryHash} ${origInventoryHash === liveInventoryHash ? "(MATCH)" : "(MISMATCH)"}`, origInventoryHash === liveInventoryHash ? "success" : "warning", 400);
      await addLog(`[Budget Check] Token root: ${origBudgetHash} | Live state: ${liveBudgetHash} ${origBudgetHash === liveBudgetHash ? "(MATCH)" : "(MISMATCH)"}`, origBudgetHash === liveBudgetHash ? "success" : "warning", 400);
      await addLog(`[Dietary Check] Token root: ${origDietaryHash} | Live state: ${liveDietaryHash} ${origDietaryHash === liveDietaryHash ? "(MATCH)" : "(MISMATCH)"}`, origDietaryHash === liveDietaryHash ? "success" : "warning", 400);

      if (hasAnyDrift) {
        await addLog("🚨 CRITICAL: Discrepancies detected between generation constraints and current kitchen state!", "warning", 600);
      } else {
        await addLog("✓ Perfect state alignment. No drift detected.", "success", 400);
      }

      await addLog("Step 3: Evaluating signature validity under selected lease protocol...", "pending", 800);

      if (securityMode === "gb-dct") {
        if (hasAnyDrift) {
          await addLog("🛑 GB-DCT VALIDATION FAILED: Generation root hashes do not match redemption parameters.", "error", 800);
          await addLog("🔐 Token self-invalidated. Rejecting resource allocations at kitchen.", "error", 400);
          setVerificationOutcome("blocked");
        } else {
          await addLog("✓ GB-DCT Signature validation succeeded. Root parameters verified.", "success", 800);
          await addLog("🎟️ Token lease redeemed. Kitchen slot locked and ingredients fired.", "success", 400);
          setVerificationOutcome("success");
        }
      } else {
        if (hasAnyDrift) {
          await addLog("⚠️ WARNING: State drift detected, but Standard DCT protocol ignores Generation Root parameters.", "warning", 600);
          await addLog("✓ Cryptographic signature matches payload (Standard Verification Bypass).", "success", 600);
          await addLog("🚨 COMMITMENT AMPLIFIED: Firing kitchen resources for outdated/invalid constraints!", "warning", 800);
          setVerificationOutcome("amplified");
        } else {
          await addLog("✓ Standard DCT Signature validation succeeded.", "success", 800);
          await addLog("🎟️ Token lease redeemed. Kitchen slot locked and ingredients fired.", "success", 400);
          setVerificationOutcome("success");
        }
      }

      onFinished();
    };

    runRedemptionVerification();
  }, [isRedeeming]);

  if (!isRedeeming && logs.length === 0) return null;

  return (
    <div className="w-full mt-6 animate-slide-up pb-8">
      <h2 className="text-xs font-bold text-brand/80 uppercase tracking-wider mb-3 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-brand-orange"></span>
        VII. Attestation & Receipt Validation Desk
      </h2>

      <div className="receipt-paper rounded-2xl p-6 font-mono text-[11px] text-[#2c1e15] leading-relaxed shadow-md min-h-[300px] flex flex-col justify-between">
        {/* Receipt Header */}
        <div className="text-center border-b border-dashed border-zinc-300 pb-4 mb-4">
          <h3 className="font-bold text-xs uppercase tracking-widest text-brand">
            *** KITCHEN ATTESTATION TICKET ***
          </h3>
          <p className="text-[10px] text-zinc-400 mt-1">
            Handshake validation protocol for state-aware dining leases
          </p>
          <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-3 px-2">
            <span>Ticket Ref: {token.substring(0, 16)}</span>
            <span>Protocol: {securityMode === "gb-dct" ? "GB-DCT" : "Standard"}</span>
          </div>
        </div>

        {/* Receipt Logs */}
        <div className="flex-1 flex flex-col gap-2.5 max-h-[250px] overflow-y-auto mb-4 pr-1">
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2 animate-fade-in font-medium">
              <span className="text-zinc-400 select-none">[{log.time}]</span>
              <span className={`flex-1 ${
                log.status === "success" ? "text-emerald-700 font-bold" :
                log.status === "warning" ? "text-amber-700 font-bold" :
                log.status === "error" ? "text-rose-600 font-bold" :
                "text-zinc-650"
              }`}>
                {log.text}
              </span>
              <span className={`text-[8px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border select-none ${
                log.status === "success" ? "bg-emerald-50 border-emerald-300 text-emerald-700" :
                log.status === "warning" ? "bg-amber-50 border-amber-300 text-amber-700" :
                log.status === "error" ? "bg-rose-50 border-rose-300 text-rose-600" :
                log.status === "pending" ? "bg-amber-100/30 border-amber-300 text-amber-600 animate-pulse" :
                "bg-zinc-100 border-zinc-200 text-zinc-400"
              }`}>
                {log.status === "success" ? "sealed" :
                 log.status === "warning" ? "drifted" :
                 log.status === "error" ? "halted" :
                 log.status === "pending" ? "working" :
                 "info"}
              </span>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Final Security Outcome Report */}
        {verificationOutcome && (
          <div className={`mt-2 p-4 rounded-xl border animate-scale-up text-xs font-sans ${
            verificationOutcome === "success"
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : verificationOutcome === "blocked"
              ? "bg-emerald-50 border-emerald-500/50 text-emerald-800"
              : "bg-rose-50 border-rose-300 text-rose-800"
          }`}>
            <h4 className="font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              {verificationOutcome === "success" && "🛡️ Attestation Passed: Order Fired Successfully"}
              {verificationOutcome === "blocked" && "🛡️ Attestation Blocked: Harm Blocked"}
              {verificationOutcome === "amplified" && "🚨 Attestation Failed: Commitment Amplification"}
            </h4>
            <p className="text-[11px] leading-relaxed mt-1 font-medium">
              {verificationOutcome === "success" &&
                "The dining covenant was executed. Live kitchen parameters matched original constraints. Safe redemption completed."}
              {verificationOutcome === "blocked" &&
                "The Generation-Bound DCT detected that the world state drifted during the temporal gap. The signature self-invalidated, blocking the kitchen from preparing outdated/incorrect food or charging wrong prices."}
              {verificationOutcome === "amplified" &&
                "CRITICAL SECURITY FAILURE. Standard DCT verified only identity/payload signature, bypassing the stale world state. The kitchen was forced to fire the order with mismatching ingredients/budget, magnifying a soft validation failure into an irreversible physical/economic harm."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
