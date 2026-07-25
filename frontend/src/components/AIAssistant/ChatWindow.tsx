"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Message } from "./types";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { GripHorizontal } from "lucide-react";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSend: (message: string) => void;
  onClose: () => void;
}

export function ChatWindow({
  messages,
  isLoading,
  onSend,
  onClose,
}: ChatWindowProps) {
  // Resizable state (default 380px width x 540px height)
  const [dimensions, setDimensions] = useState({ width: 380, height: 540 });
  const isResizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0, w: 380, h: 540 });

  const handleStartResize = (clientX: number, clientY: number) => {
    isResizing.current = true;
    startPos.current = {
      x: clientX,
      y: clientY,
      w: dimensions.width,
      h: dimensions.height,
    };
    document.body.style.userSelect = "none";
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStartResize(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleStartResize(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isResizing.current) return;
    const deltaX = startPos.current.x - clientX; // Drag left increases width
    const deltaY = startPos.current.y - clientY; // Drag up increases height

    const newW = Math.min(Math.max(startPos.current.w + deltaX, 320), 750);
    const newH = Math.min(Math.max(startPos.current.h + deltaY, 400), 800);

    setDimensions({ width: newW, height: newH });
  }, []);

  const handleStopResize = useCallback(() => {
    isResizing.current = false;
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onMouseUp = () => handleStopResize();
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => handleStopResize();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [handleMove, handleStopResize]);

  return (
    <div
      style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
      className="
        relative flex flex-col
        bg-[#faf8f3] rounded-3xl
        shadow-[0_20px_50px_rgba(0,0,0,0.3)]
        border border-stone-300
        overflow-hidden transition-all duration-75
      "
      role="dialog"
      aria-label="GrubBot AI Assistant"
    >
      {/* ── Drag Resize Handle (Top-Left Corner for mouse & touch) ───── */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        title="Drag to resize chatbot"
        className="
          absolute top-2 left-2 z-50
          flex items-center gap-1 px-2 py-1
          bg-stone-800/80 text-emerald-400 hover:text-white
          rounded-lg cursor-nwse-resize active:cursor-grabbing
          shadow-md text-[10px] font-mono select-none backdrop-blur-sm
        "
      >
        <GripHorizontal className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Drag to Resize</span>
      </div>

      {/* Header */}
      <ChatHeader onClose={onClose} />

      {/* Message list — takes remaining height */}
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        onSuggestionSelect={onSend}
      />

      {/* Input area */}
      <ChatInput onSend={onSend} isLoading={isLoading} />
    </div>
  );
}
