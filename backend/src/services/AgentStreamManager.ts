import { EventEmitter } from "events";
import { AgentUIEvent } from "../types/AgentUIEvent";

class AgentStreamManager extends EventEmitter {
  private activeStreams: Map<string, Array<(event: AgentUIEvent) => void>> = new Map();
  private eventBuffers: Map<string, AgentUIEvent[]> = new Map();

  subscribe(runId: string, listener: (event: AgentUIEvent) => void): () => void {
    if (!this.activeStreams.has(runId)) {
      this.activeStreams.set(runId, []);
    }
    this.activeStreams.get(runId)!.push(listener);

    // Immediately replay all past buffered events for this runId
    const history = this.eventBuffers.get(runId);
    if (history && history.length > 0) {
      history.forEach((event) => {
        try {
          listener(event);
        } catch (err) {
          console.error("[AgentStreamManager] Replay error:", err);
        }
      });
    }

    return () => {
      const listeners = this.activeStreams.get(runId);
      if (listeners) {
        this.activeStreams.set(
          runId,
          listeners.filter((l) => l !== listener)
        );
      }
    };
  }

  emitEvent(event: AgentUIEvent): void {
    const { runId } = event;
    if (!runId) return;

    if (!this.eventBuffers.has(runId)) {
      this.eventBuffers.set(runId, []);
      // Auto-cleanup buffer after 5 minutes
      setTimeout(() => {
        this.eventBuffers.delete(runId);
        this.activeStreams.delete(runId);
      }, 300000);
    }
    this.eventBuffers.get(runId)!.push(event);

    const listeners = this.activeStreams.get(runId);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(event);
        } catch (err) {
          console.error("[AgentStreamManager] Listener error:", err);
        }
      });
    }
  }

  cleanup(runId: string): void {
    this.activeStreams.delete(runId);
    this.eventBuffers.delete(runId);
  }
}

export const agentStreamManager = new AgentStreamManager();
