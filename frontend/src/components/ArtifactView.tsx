"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, RotateCcw, AlertTriangle, ShieldCheck, Cpu, Key, HelpCircle } from "lucide-react";
import { useAppState } from "@/context/StateContext";
import { OnePillarPagodaDrawing } from "@/components/BackgroundDrawings";

export default function ArtifactView() {
  const { tokens, activeTokenId } = useAppState();

  // Find active token or fallback to a dummy if none generated yet
  const activeToken = tokens.find((t) => t.id === activeTokenId) || tokens[0] || null;

  // Zoom & Pan states
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Selected node details state
  const [selectedNode, setSelectedNode] = useState<string | null>("Final Dish");

  // Interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 0.05;
    const direction = e.deltaY > 0 ? -1 : 1;
    const nextScale = Math.min(Math.max(scale + direction * zoomFactor, 0.4), 2.5);
    setScale(nextScale);
  };

  const resetZoomPan = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  // Node specifications
  const nodes = [
    {
      id: "User Preferences",
      label: "User Preferences",
      x: 100,
      y: 80,
      type: "input",
      description: "User restrictions: budget cap, dietary choices, cuisine style, and flavor preference.",
      data: activeToken ? {
        Budget: `₹${activeToken.constraints.budget}`,
        Dietary: activeToken.constraints.dietary.join(", ") || "None",
        Theme: activeToken.constraints.cuisine,
      } : { Budget: "₹300", Dietary: "Vegetarian", Theme: "Indian" }
    },
    {
      id: "Inventory Snapshot",
      label: "Inventory Snapshot",
      x: 350,
      y: 80,
      type: "state",
      description: "Real-time pantry stock check. Locked at the time of token compilation.",
      data: activeToken ? {
        Locked: `${activeToken.dish.ingredients.length} items reserved`,
        Items: activeToken.dish.ingredients.join(", "),
        Hash: activeToken.hashes.inventorySnapshotHash
      } : { Locked: "3 items reserved", Items: "Paneer, Udon, Cream", Hash: "f1a2c3d4" }
    },
    {
      id: "Budget Constraints",
      label: "Budget Constraints",
      x: 220,
      y: 200,
      type: "rule",
      description: "Validator matching current supplier prices against maximum budget.",
      data: activeToken ? {
        DishCost: `₹${activeToken.dish.estimatedCost}`,
        BudgetLimit: `₹${activeToken.constraints.budget}`,
        Status: "Passed",
      } : { DishCost: "₹230", BudgetLimit: "₹300", Status: "Passed" }
    },
    {
      id: "Dietary Rules",
      label: "Dietary Rules",
      x: 480,
      y: 200,
      type: "rule",
      description: "Attestation enforcing supplier food integrity checks and allergen filters.",
      data: activeToken ? {
        Prefs: activeToken.constraints.dietary.join(", ") || "None",
        Allergens: "None detected",
        Hash: activeToken.hashes.dietaryHash
      } : { Prefs: "Vegetarian", Allergens: "None detected", Hash: "e4d3c2b1" }
    },
    {
      id: "Recipe Generation",
      label: "Recipe Generation",
      x: 350,
      y: 320,
      type: "agent",
      description: "Agentic model synthesizing specific measurements and prep workflow.",
      data: activeToken ? {
        Name: activeToken.dish.name,
        Prep: activeToken.dish.prepTime,
        Confidence: `${activeToken.dish.confidenceScore}%`,
      } : { Name: "Spicy Cream Paneer Udon", Prep: "15 mins", Confidence: "96%" }
    },
    {
      id: "Final Dish",
      label: "Final Dish",
      x: 350,
      y: 440,
      type: "output",
      description: "The signed physical lease output, cryptographically committed.",
      data: activeToken ? {
        Dish: activeToken.dish.name,
        Cost: `₹${activeToken.dish.estimatedCost}`,
        Token: activeToken.id,
      } : { Dish: "Spicy Cream Paneer Udon", Cost: "₹230", Token: "GB-DCT-2026-MOCK" }
    }
  ];

  // Connection definitions (SVG paths)
  const connections = [
    { from: "User Preferences", to: "Budget Constraints" },
    { from: "Inventory Snapshot", to: "Budget Constraints" },
    { from: "Inventory Snapshot", to: "Dietary Rules" },
    { from: "Budget Constraints", to: "Recipe Generation" },
    { from: "Dietary Rules", to: "Recipe Generation" },
    { from: "Recipe Generation", to: "Final Dish" }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 relative overflow-hidden">
      <OnePillarPagodaDrawing className="opacity-[0.06] stroke-[#1d3a2b] -bottom-20" />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e9e5da] pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-[#1d3a2b] tracking-tight">AI Artifact Viewer</h2>
          <p className="text-[#1d3a2b]/70 text-sm mt-1">
            Audit the agentic decision graph. Drag to pan, scroll to zoom, click nodes for cryptographic variables.
          </p>
        </div>

        {activeToken ? (
          <div className="bg-white border border-[#e9e5da] rounded-xl p-3 flex items-center gap-3 text-xs font-mono shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-[#e59b27] animate-pulse-slow" />
            <div className="space-y-0.5">
              <span className="text-[#e59b27] block font-bold">AI Artifact Binding Active</span>
              <span className="text-[#1d3a2b]/50 block text-[10px]">Root: {activeToken.hashes.artifactRoot}</span>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-[#e9e5da] rounded-xl p-3 flex items-center gap-3 text-xs font-mono shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1d3a2b]/40" />
            <div className="space-y-0.5">
              <span className="text-[#1d3a2b]/60 block font-bold">No Active Lease Loaded</span>
              <span className="text-[#1d3a2b]/40 block text-[10px]">Displaying baseline static graph</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Interactive Graph Area (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#e9e5da] rounded-2xl relative overflow-hidden h-[520px] flex flex-col justify-between select-none shadow-sm">
          {/* Controls Overlay */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <button
              onClick={() => setScale((s) => Math.min(s + 0.1, 2.5))}
              className="p-2 bg-[#fffdf9] border border-[#e9e5da] hover:border-[#1d3a2b]/30 rounded-lg text-[#1d3a2b]/70 hover:text-[#1d3a2b] transition-colors shadow-sm"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-[#e59b27]" />
            </button>
            <button
              onClick={() => setScale((s) => Math.max(s - 0.1, 0.4))}
              className="p-2 bg-[#fffdf9] border border-[#e9e5da] hover:border-[#1d3a2b]/30 rounded-lg text-[#1d3a2b]/70 hover:text-[#1d3a2b] transition-colors shadow-sm"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-[#e59b27]" />
            </button>
            <button
              onClick={resetZoomPan}
              className="p-2 bg-[#fffdf9] border border-[#e9e5da] hover:border-[#1d3a2b]/30 rounded-lg text-[#1d3a2b]/70 hover:text-[#1d3a2b] transition-colors shadow-sm"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4 text-[#e59b27]" />
            </button>
          </div>

          <div className="absolute top-4 right-4 z-10 text-[10px] font-mono text-[#1d3a2b]/50 bg-[#fffdf9]/70 px-2.5 py-1 rounded-md border border-[#e9e5da]/80 shadow-sm">
            Zoom: {Math.round(scale * 100)}% | Pan: {offset.x}, {offset.y}
          </div>

          {/* Interactive SVG Canvas */}
          <div
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            className="flex-1 w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden"
          >
            <div
              className="absolute w-full h-full transform-gpu origin-center"
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                transition: isDragging ? "none" : "transform 0.1s ease-out",
              }}
            >
              {/* Grid backdrop */}
              <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

              <svg className="absolute inset-0 w-[800px] h-[600px] pointer-events-none overflow-visible">
                {/* Arrow markers for connection paths */}
                <defs>
                  <marker
                    id="arrow"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#1d3a2b" opacity="0.25" />
                  </marker>
                  <marker
                    id="arrow-active"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#e59b27" />
                  </marker>
                </defs>

                {/* Draw connections */}
                {connections.map((conn, idx) => {
                  const fromNode = nodes.find((n) => n.id === conn.from);
                  const toNode = nodes.find((n) => n.id === conn.to);
                  if (!fromNode || !toNode) return null;

                  // Compute ports
                  const x1 = fromNode.x + 80;
                  const y1 = fromNode.y + 40;
                  const x2 = toNode.x + 80;
                  const y2 = toNode.y;

                  const isActive = selectedNode === conn.from || selectedNode === conn.to;

                  // Curved link path
                  const dx = x2 - x1;
                  const dy = y2 - y1;
                  const path = `M ${x1} ${y1} C ${x1} ${y1 + dy / 2}, ${x2} ${y2 - dy / 2}, ${x2} ${y2}`;

                  return (
                    <g key={idx}>
                      <path
                        d={path}
                        fill="none"
                        stroke={isActive ? "#e59b27" : "#1d3a2b"}
                        strokeOpacity={isActive ? 1.0 : 0.15}
                        strokeWidth={isActive ? 2 : 1.2}
                        markerEnd={`url(#${isActive ? "arrow-active" : "arrow"})`}
                        className="transition-all duration-300"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Draw Nodes */}
              {nodes.map((node) => {
                const isSelected = selectedNode === node.id;
                let typeColor = "border-[#e9e5da] bg-white text-[#1d3a2b]";
                if (node.type === "input") typeColor = "border-blue-200 bg-blue-50/40 text-blue-900";
                if (node.type === "state") typeColor = "border-purple-200 bg-purple-50/40 text-purple-900";
                if (node.type === "rule") typeColor = "border-amber-200 bg-amber-50/40 text-amber-900";
                if (node.type === "agent") typeColor = "border-indigo-200 bg-indigo-50/40 text-indigo-900";
                if (node.type === "output") typeColor = "border-emerald-250 bg-emerald-50/40 text-emerald-900";

                return (
                  <div
                    key={node.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNode(node.id);
                    }}
                    className={`absolute rounded-xl border p-3.5 w-40 text-center cursor-pointer transition-all duration-300 shadow-sm ${typeColor} ${
                      isSelected
                        ? "ring-2 ring-[#e59b27]/40 border-[#e59b27]/60 scale-105"
                        : "hover:border-[#1d3a2b]/30"
                    }`}
                    style={{ left: node.x, top: node.y }}
                  >
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#1d3a2b]/50 mb-1">{node.type}</div>
                    <div className="text-xs font-bold font-sans truncate">{node.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 border-t border-[#e9e5da] bg-[#fffdf9] text-[#1d3a2b]/50 text-[10px] font-mono flex items-center justify-between">
            <span>Graph Sandbox: zoom using wheel, pan using left click drag.</span>
            <span>Enforcement: ACTIVE</span>
          </div>
        </div>

        {/* Right Column: Node Details Inspector (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#e9e5da] rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-sm">
          {selectedNode ? (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#e59b27] bg-[#e59b27]/5 border border-[#e59b27]/10 px-2 py-0.5 rounded font-bold">
                  Artifact Node Details
                </span>
                <h4 className="text-lg font-bold text-[#1d3a2b] mt-2">{selectedNode}</h4>
                <p className="text-xs text-[#1d3a2b]/70 mt-1 leading-relaxed font-semibold">
                  {nodes.find((n) => n.id === selectedNode)?.description}
                </p>
              </div>

              <div className="border-t border-[#f4f1ea] pt-4 space-y-4">
                <h5 className="text-xs font-mono uppercase text-[#1d3a2b]/55 font-bold">Node Properties</h5>
                <div className="space-y-3 font-mono text-xs">
                  {Object.entries(nodes.find((n) => n.id === selectedNode)?.data || {}).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-start gap-4">
                      <span className="text-[#1d3a2b]/50 capitalize">{key}:</span>
                      <span className="text-[#1d3a2b] font-semibold text-right break-all">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <HelpCircle className="w-10 h-10 text-[#1d3a2b]/30 mb-2" />
              <p className="text-xs text-[#1d3a2b]/50">Select any node in the flow chart to inspect its parameters.</p>
            </div>
          )}

          {activeToken && (
            <div className="border-t border-[#f4f1ea] pt-4 space-y-2.5">
              <div className="flex justify-between text-xs font-mono text-[#1d3a2b]/60">
                <span>Lease Root Hash:</span>
                <span className="text-[#1d3a2b] font-semibold">{activeToken.hashes.generationRoot.substring(0, 8)}</span>
              </div>
              <div className="flex justify-between text-xs font-mono text-[#1d3a2b]/60">
                <span>Decision Binding:</span>
                <span className="text-[#e59b27] font-bold">Active 🛡️</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
