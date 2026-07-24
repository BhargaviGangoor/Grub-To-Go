import { PlannerAgent } from "../agents/PlannerAgent";
import { ChatResponse } from "../types/chat.types";

/**
 * ChatService.ts
 *
 * The Business Logic Layer for the AI chat feature.
 * Routes messages through PlannerAgent and returns structured ChatResponse.
 */
export class ChatService {
  private planner: PlannerAgent;

  constructor(planner: PlannerAgent) {
    this.planner = planner;
  }

  /**
   * Process a user's chat message and return the AI's reply and step trace.
   */
  async processMessage(userMessage: string): Promise<ChatResponse> {
    const cleanedMessage = userMessage.trim();

    if (!cleanedMessage) {
      return {
        reply: "I didn't quite catch that. Could you tell me what you're craving? 🍽️",
      };
    }

    const result = await this.planner.process(cleanedMessage);

    return {
      reply: result.message,
      agentSteps: result.agentSteps,
      dish: result.dish,
      dctTokenId: result.dctTokenId,
      orderId: result.orderId,
    };
  }
}

