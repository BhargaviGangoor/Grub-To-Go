"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Message } from "@/components/AIAssistant/types";
import { sendChatMessage } from "@/components/AIAssistant/api";
import { triggerAgentAutomation } from "@/components/AgentGhostOverlay";

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: "Bonjour! Tell me what you want to eat, and I’ll narrow down our 28 authentic French Bistro dishes to a concrete recommendation.",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessage = useCallback(async (content: string): Promise<void> => {
    if (!content.trim() || isLoading) return;

    const userMsgText = content.trim();
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: userMsgText,
      timestamp: new Date(),
    };

    const runId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Trigger live SSE stream listener on AgentGhostOverlay
    triggerAgentAutomation({
      runId,
    });

    try {
      const res = await sendChatMessage(userMsgText, runId);

      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: res.reply,
        timestamp: new Date(),
        agentSteps: res.agentSteps,
        dish: res.dish,
        dctTokenId: res.dctTokenId,
        orderId: res.orderId,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorBubble: Message = {
        id: generateId(),
        role: "assistant",
        content: "Sorry, I encountered an issue fulfilling your request. Please try again. 🙏",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorBubble]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return (
    <ChatContext.Provider value={{ messages, isLoading, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useSharedChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useSharedChat must be used within a ChatProvider");
  }
  return context;
}
