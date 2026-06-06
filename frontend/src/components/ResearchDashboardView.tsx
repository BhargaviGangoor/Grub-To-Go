"use client";

import { useAppState } from "@/context/StateContext";
import { BarChart2, Shield, AlertTriangle, Activity, CheckCircle2, TrendingUp, Key } from "lucide-react";
import { BotanicalSprigDrawing } from "@/components/BackgroundDrawings";

export default function ResearchDashboardView() {
  const { systemState, tokens, stats } = useAppState();

  const activeLeases = tokens.filter((t) => t.status === "ACTIVE").length;
  const redeemedLeases = tokens.filter((t) => t.status === "REDEEMED").length;
  const invalidatedLeases = tokens.filter((t) => t.status === "INVALIDATED").length;

  // Static stats baseline merged with live metrics
  const totalLeaseRequests = stats.totalGenerated;
  const stateDriftsBlocked = stats.detectedDrifts;
  const legacyExploitsAllowed = stats.amplificationEvents;

  // Accuracy Rate computation
  const baseValid = totalLeaseRequests - legacyExploitsAllowed;
  const accuracyRate = totalLeaseRequests > 0 ? Math.round((baseValid / totalLeaseRequests) * 100) : 98;

  // Chart data: Line chart coordinate helpers (X, Y)
  const linePoints = [
    { x: 30, y: 120 },
    { x: 70, y: 110 },
    { x: 110, y: 130 },
    { x: 150, y: 70 },
    { x: 190, y: 85 },
    { x: 230, y: 45 },
    { x: 270, y: 35 }
  ];
  const linePath = linePoints.map(p => `${p.x},${p.y}`).join(" L ");
  const lineAreaPath = `${linePath} L 270,140 L 30,140 Z`;

  // Chart data: Bar chart heights
  const barData = [
    { label: "Mushrooms", val: systemState.inventory["Mushrooms"] ?? 8 },
    { label: "Cream", val: systemState.inventory["Heavy Cream"] ?? 10 },
    { label: "Saffron", val: systemState.inventory["Saffron"] ?? 4 },
    { label: "Paneer", val: systemState.inventory["Paneer"] ?? 5 },
    { label: "Rice", val: systemState.inventory["Basmati Rice"] ?? 12 }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 relative overflow-hidden">
      <BotanicalSprigDrawing className="absolute opacity-[0.06] stroke-[#1d3a2b] right-10 top-10 w-28 h-28" />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e9e5da] pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-[#1d3a2b] tracking-tight">Research Telemetry & Metrics</h2>
          <p className="text-[#1d3a2b]/70 text-sm mt-1">
            Real-time tracking of lease validations, cryptographic block rates, and Commitment Amplification incidents.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-white border border-[#e9e5da] px-3.5 py-2 rounded-xl shadow-sm">
          <Activity className="w-4 h-4 text-[#e59b27] animate-pulse" />
          <span className="text-[#1d3a2b] font-bold">Node Telemetry: ONLINE</span>
        </div>
      </div>

      {/* Grid: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="bg-white border border-[#e9e5da] rounded-2xl p-5 space-y-3 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center text-[#1d3a2b]/50">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Validation Accuracy</span>
            <TrendingUp className="w-4 h-4 text-[#e59b27]" />
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-extrabold font-mono text-[#1d3a2b]">{accuracyRate}%</div>
            <div className="text-[10px] text-[#1d3a2b]/50 font-medium">Acceptable drift containment index</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-[#e9e5da] rounded-2xl p-5 space-y-3 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center text-[#1d3a2b]/50">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Leases Registered</span>
            <Key className="w-4 h-4 text-[#e59b27]" />
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-extrabold font-mono text-[#1d3a2b]">{totalLeaseRequests}</div>
            <div className="text-[10px] text-[#1d3a2b]/50 font-medium">{activeLeases} active leases in local pool</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-[#e9e5da] rounded-2xl p-5 space-y-3 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center text-[#1d3a2b]/50">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">State Drifts Blocked</span>
            <Shield className="w-4 h-4 text-[#1d3a2b]" />
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-extrabold font-mono text-[#1d3a2b]">{stateDriftsBlocked}</div>
            <div className="text-[10px] text-[#1d3a2b]/50 font-medium">Prevented economic & physical errors</div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-[#e9e5da] rounded-2xl p-5 space-y-3 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center text-[#1d3a2b]/50">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Amplification Events</span>
            <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-extrabold font-mono text-[#1d3a2b]">{legacyExploitsAllowed}</div>
            <div className="text-[10px] text-[#1d3a2b]/50 font-medium">Vulnerable standard bypass executions</div>
          </div>
        </div>
      </div>

      {/* Grid: SVG Charts (3 items) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Validation History (Line) */}
        <div className="bg-white border border-[#e9e5da] rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1d3a2b] flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#e59b27]" />
            Validation Rate Timeline
          </h3>

          <div className="w-full aspect-[4/3] flex items-center justify-center">
            <svg viewBox="0 0 300 160" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="line-grad-warm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1d3a2b" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#1d3a2b" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="30" y1="20" x2="270" y2="20" stroke="#e9e5da" strokeWidth="0.8" />
              <line x1="30" y1="60" x2="270" y2="60" stroke="#e9e5da" strokeWidth="0.8" />
              <line x1="30" y1="100" x2="270" y2="100" stroke="#e9e5da" strokeWidth="0.8" />
              <line x1="30" y1="140" x2="270" y2="140" stroke="#1d3a2b" strokeWidth="1.2" />

              {/* Chart Line Area */}
              <path d={`M ${lineAreaPath}`} fill="url(#line-grad-warm)" />

              {/* Chart Line path */}
              <path d={`M ${linePath}`} fill="none" stroke="#1d3a2b" strokeWidth="2" strokeLinecap="round" />

              {/* Data Dots */}
              {linePoints.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3" fill="#e59b27" stroke="#ffffff" strokeWidth="1" />
              ))}

              {/* X Axis Labels */}
              <text x="30" y="152" fill="#1d3a2b" opacity="0.6" fontSize="8" textAnchor="middle" fontFamily="monospace">10:00</text>
              <text x="110" y="152" fill="#1d3a2b" opacity="0.6" fontSize="8" textAnchor="middle" fontFamily="monospace">12:00</text>
              <text x="190" y="152" fill="#1d3a2b" opacity="0.6" fontSize="8" textAnchor="middle" fontFamily="monospace">14:00</text>
              <text x="270" y="152" fill="#1d3a2b" opacity="0.6" fontSize="8" textAnchor="middle" fontFamily="monospace">16:00</text>
            </svg>
          </div>
        </div>

        {/* Chart 2: Inventory Status (Bar) */}
        <div className="bg-white border border-[#e9e5da] rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1d3a2b] flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-[#e59b27]" />
            Live Pantry Levels
          </h3>

          <div className="w-full aspect-[4/3] flex items-center justify-center">
            <svg viewBox="0 0 300 160" className="w-full h-full overflow-visible">
              <line x1="35" y1="20" x2="35" y2="135" stroke="#1d3a2b" strokeWidth="1" />
              <line x1="35" y1="135" x2="280" y2="135" stroke="#1d3a2b" strokeWidth="1" />

              {/* Grid Lines */}
              <line x1="35" y1="50" x2="280" y2="50" stroke="#e9e5da" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="35" y1="90" x2="280" y2="90" stroke="#e9e5da" strokeWidth="0.8" strokeDasharray="2 2" />

              {/* Draw Bars */}
              {barData.map((d, i) => {
                const xOffset = 50 + i * 45;
                const maxVal = 15;
                const barHeight = (d.val / maxVal) * 100;
                const yOffset = 135 - barHeight;

                return (
                  <g key={i}>
                    {/* Bar */}
                    <rect
                      x={xOffset}
                      y={yOffset}
                      width="24"
                      height={barHeight}
                      fill={d.val <= 0 ? "#fca5a5" : i % 2 === 0 ? "#1d3a2b" : "#e59b27"}
                      rx="3"
                    />
                    {/* Label */}
                    <text
                      x={xOffset + 12}
                      y="146"
                      fill="#1d3a2b"
                      opacity="0.6"
                      fontSize="7.5"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      {d.label}
                    </text>
                    {/* Value */}
                    <text
                      x={xOffset + 12}
                      y={yOffset - 5}
                      fill="#1d3a2b"
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {d.val}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Chart 3: Drifts Containment (Donut) */}
        <div className="bg-white border border-[#e9e5da] rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1d3a2b] flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#e59b27]" />
            Lease Outcome Containment
          </h3>

          <div className="w-full aspect-[4/3] flex items-center justify-center">
            <svg viewBox="0 0 160 160" className="w-[150px] h-[150px] overflow-visible">
              <defs>
                {/* Patterns or Gradients */}
              </defs>
              {/* Outer circle */}
              <circle cx="80" cy="80" r="50" fill="transparent" stroke="#1d3a2b" strokeWidth="18" strokeDasharray="314" strokeDashoffset="80" />
              <circle cx="80" cy="80" r="50" fill="transparent" stroke="#e59b27" strokeWidth="18" strokeDasharray="314" strokeDashoffset="180" />
              <circle cx="80" cy="80" r="50" fill="transparent" stroke="#ef4444" strokeWidth="18" strokeDasharray="314" strokeDashoffset="280" />

              {/* Inner ring */}
              <circle cx="80" cy="80" r="41" fill="#ffffff" />

              {/* Inner Label */}
              <text x="80" y="76" fill="#1d3a2b" fontSize="8" textAnchor="middle" fontWeight="bold" fontFamily="monospace">SECURITY</text>
              <text x="80" y="88" fill="#1d3a2b" fontSize="11" textAnchor="middle" fontWeight="extrabold" fontFamily="sans-serif">ENFORCED</text>
            </svg>
          </div>
          
          <div className="text-[10px] font-mono text-[#1d3a2b]/60 space-y-1.5 pt-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#1d3a2b]" /> Secure Block (GB-DCT)</span>
              <span className="font-bold">{stateDriftsBlocked}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#e59b27]" /> Completed Redemptions</span>
              <span className="font-bold">{redeemedLeases}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#ef4444]" /> Exploit Amplifications</span>
              <span className="font-bold">{legacyExploitsAllowed}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Laboratory Event Logs */}
      <div className="bg-white border border-[#e9e5da] rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1d3a2b] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#1d3a2b]/70" />
          Laboratory Execution Log
        </h3>

        <div className="font-mono text-xs divide-y divide-[#f4f1ea]">
          {tokens.map((token, idx) => (
            <div key={token.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[#1d3a2b]/70 font-semibold">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#1d3a2b]/40">[0{idx + 1}]</span>
                <span className="font-bold text-[#1d3a2b]">{token.id}</span>
                <span className="text-[11px] truncate max-w-[180px]">{token.dish.name}</span>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span>Budget: ₹{token.constraints.budget}</span>
                <span>Spice: {token.constraints.spiceLevel}</span>
                {token.status === "ACTIVE" && (
                  <span className="text-[#1d3a2b] bg-[#1d3a2b]/10 border border-[#1d3a2b]/20 px-2 py-0.5 rounded text-[10px] font-bold">
                    Sealed
                  </span>
                )}
                {token.status === "REDEEMED" && (
                  <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-bold">
                    Executed
                  </span>
                )}
                {token.status === "INVALIDATED" && (
                  <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">
                    Self-Invalidated
                  </span>
                )}
              </div>
            </div>
          ))}
          {tokens.length === 0 && (
            <div className="py-8 text-center text-xs text-[#1d3a2b]/40">
              No recent leases recorded in execution logs.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
