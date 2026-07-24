"use client";

import { useState } from "react";
import { Message, AgentStep } from "./types";
import { ChevronDown, ChevronUp, CheckCircle, AlertTriangle, Info, ShieldCheck, Ticket } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [showSteps, setShowSteps] = useState(true);

  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(date));
  };

  const getStatusIcon = (status: AgentStep["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />;
      case "warning":
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />;
      case "error":
        return <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />;
      default:
        return <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />;
    }
  };

  return (
    <div className={`flex items-start gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center shadow-sm mt-0.5">
          <span className="text-xs">🤖</span>
        </div>
      )}

      <div className={`flex flex-col gap-2.5 max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
        {/* Main message bubble */}
        <div
          className={`
            px-4 py-3 text-sm leading-relaxed shadow-sm
            ${
              isUser
                ? "bg-gradient-to-br from-emerald-800 to-emerald-900 text-white rounded-2xl rounded-br-sm"
                : "bg-white text-stone-800 rounded-2xl rounded-tl-sm border border-stone-200"
            }
          `}
          style={{ wordBreak: "break-word" }}
        >
          {message.content}
        </div>

        {/* Rich Dish & Order Confirmation Ticket */}
        {message.dish && (
          <div className="w-full bg-gradient-to-br from-stone-900 to-emerald-950 text-white rounded-xl p-3.5 border border-emerald-800/50 shadow-md">
            <div className="flex items-center justify-between border-b border-emerald-800/40 pb-2 mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                <Ticket className="w-4 h-4" />
                <span>Simulated Order Ticket</span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-mono border border-emerald-500/30">
                CONFIRMED
              </span>
            </div>

            <div className="flex items-start gap-3">
              {message.dish.imageUrl && (
                <img
                  src={message.dish.imageUrl}
                  alt={message.dish.name}
                  className="w-14 h-14 rounded-lg object-cover border border-stone-700 flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-stone-100 truncate">
                  {message.dish.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-emerald-400 font-bold text-sm">
                    ₹{message.dish.estimatedCost}
                  </span>
                  {message.dish.spiceLevel && (
                    <span className="text-[10px] bg-red-900/60 text-red-200 px-1.5 py-0.5 rounded">
                      🌶️ {message.dish.spiceLevel}
                    </span>
                  )}
                  {message.dish.dietary && message.dish.dietary.length > 0 && (
                    <span className="text-[10px] bg-emerald-900/60 text-emerald-200 px-1.5 py-0.5 rounded truncate">
                      🌱 {message.dish.dietary.filter((d: string) => !d.includes("Gluten")).join(", ")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* GB-DCT & Order Badges */}
            <div className="mt-3 pt-2 border-t border-emerald-900/60 flex flex-wrap items-center justify-between gap-1.5 text-[11px] font-mono text-stone-300">
              {message.dctTokenId && (
                <div className="flex items-center gap-1 text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>{message.dctTokenId}</span>
                </div>
              )}
              {message.orderId && (
                <div className="text-stone-400 text-[10px]">
                  Order #{message.orderId.substring(0, 10)}...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Collapsible Agent Execution Trace */}
        {!isUser && message.agentSteps && message.agentSteps.length > 0 && (
          <div className="w-full bg-stone-50 border border-stone-200 rounded-xl overflow-hidden shadow-xs text-xs">
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="w-full flex items-center justify-between px-3 py-2 bg-stone-100/80 hover:bg-stone-100 text-stone-700 font-medium transition-colors border-b border-stone-200/60"
            >
              <div className="flex items-center gap-1.5 font-semibold text-[11px] text-stone-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>⚡ Agent Reasoning & Execution Trace ({message.agentSteps.length} steps)</span>
              </div>
              {showSteps ? (
                <ChevronUp className="w-3.5 h-3.5 text-stone-500" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
              )}
            </button>

            {showSteps && (
              <div className="p-2.5 flex flex-col gap-2 bg-white">
                {message.agentSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-stone-700 bg-stone-50/70 p-2 rounded-lg border border-stone-100">
                    <div className="mt-0.5">{getStatusIcon(step.status)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[11px] text-stone-900">
                        {step.title}
                      </div>
                      <div className="text-[11px] text-stone-600 font-mono leading-tight mt-0.5 break-words">
                        {step.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[10px] text-stone-400 px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
