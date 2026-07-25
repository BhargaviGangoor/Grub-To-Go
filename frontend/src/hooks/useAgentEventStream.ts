"use client";

import { useEffect, useState, useRef } from "react";
import { AgentUIEvent } from "@/types/AgentUIEvent";

export function useAgentEventStream(runId: string | null) {
  const [events, setEvents] = useState<AgentUIEvent[]>([]);
  const eventQueueRef = useRef<AgentUIEvent[]>([]);

  useEffect(() => {
    if (!runId) return;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
    const eventSource = new EventSource(
      `${backendUrl}/api/agent/runs/${runId}/events`
    );

    eventSource.onmessage = (event) => {
      try {
        const parsed: AgentUIEvent = JSON.parse(event.data);
        if (parsed.type && parsed.type !== ("CONNECTED" as any)) {
          eventQueueRef.current.push(parsed);
          setEvents([...eventQueueRef.current]);
        }
      } catch (err) {
        console.error("Error parsing AgentUIEvent:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.warn("SSE eventSource connection error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [runId]);

  return { events, eventQueueRef };
}
