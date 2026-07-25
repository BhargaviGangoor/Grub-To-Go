import { PlannerAgent } from "../agents/PlannerAgent";
import { ChatResponse } from "../types/chat.types";

/**
 * ChatService.ts
 *
 * Business Logic Layer for AI chat.
 * Routes user messages through PlannerAgent and returns structured ChatResponse.
 */
export class ChatService {
  constructor(private readonly planner: PlannerAgent) {}

  /**
   * Process a user's chat message and return structured AI reply, steps, and order ticket data.
   */
  async processMessage(userMessage: string, runId?: string): Promise<ChatResponse> {
    const cleanedMessage = userMessage.trim();

    if (!cleanedMessage) {
      return {
        reply: "I didn't quite catch that. Could you tell me what French dish you're craving? 🍽️",
      };
    }

    const activeRunId = runId || `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const result = await this.planner.process(cleanedMessage, activeRunId);

    // If an order was successfully placed by PlannerAgent, bundle order ticket metadata
    let orderTicket: any = undefined;
    if (result.success && result.dish && result.orderId && result.dctTokenId) {
      orderTicket = {
        orderId: result.orderId,
        dctTokenId: result.dctTokenId,
        status: "CONFIRMED",
        totalAmount: result.price ?? result.dish.estimatedCost,
        items: [
          {
            dishId: result.dish.id,
            dishName: result.dish.name,
            quantity: 1,
            price: result.dish.estimatedCost,
            imageUrl: result.dish.imageUrl,
          },
        ],
      };
    }

    return {
      runId: activeRunId,
      reply: result.message,
      agentSteps: result.agentSteps,
      dish: result.dish,
      dctTokenId: result.dctTokenId,
      orderId: result.orderId,
      orderTicket,
    };
  }
}
