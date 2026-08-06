"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { AgentUIEvent } from "@/types/AgentUIEvent";

export function useAgentEventStream(runId: string | null) {
  const [events, setEvents] = useState<AgentUIEvent[]>([]);
  const eventQueueRef = useRef<AgentUIEvent[]>([]);

  const appendEvent = useCallback((parsed: AgentUIEvent) => {
    if (!parsed.type || parsed.type === ("CONNECTED" as AgentUIEvent["type"])) return;
    eventQueueRef.current.push(parsed);
    setEvents([...eventQueueRef.current]);
  }, []);

  useEffect(() => {
    if (!runId) {
      eventQueueRef.current = [];
      setEvents([]);
      return;
    }

    eventQueueRef.current = [];
    setEvents([]);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
    const eventSource = new EventSource(
      `${backendUrl}/api/agent/runs/${runId}/events`
    );

    eventSource.onmessage = (event) => {
      try {
        const parsed: AgentUIEvent = JSON.parse(event.data);
        appendEvent(parsed);
      } catch (err) {
        console.error("Error parsing AgentUIEvent:", err);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [runId, appendEvent]);

  return { events, eventQueueRef };
}
