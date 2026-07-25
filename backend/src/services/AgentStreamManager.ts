import { EventEmitter } from "events";
import { AgentUIEvent } from "../types/AgentUIEvent";

class AgentStreamManager extends EventEmitter {
  private activeStreams: Map<string, Array<(event: AgentUIEvent) => void>> = new Map();

  subscribe(runId: string, listener: (event: AgentUIEvent) => void): () => void {
    if (!this.activeStreams.has(runId)) {
      this.activeStreams.set(runId, []);
    }
    this.activeStreams.get(runId)!.push(listener);

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
    const listeners = this.activeStreams.get(event.runId);
    if (listeners) {
      listeners.forEach((listener) => listener(event));
    }
  }

  cleanup(runId: string): void {
    this.activeStreams.delete(runId);
  }
}

export const agentStreamManager = new AgentStreamManager();
