import { OrderModel, OrderDocument } from "../models/Order";
import { MenuItemData, OrderAuthorization } from "../types/agent.types";

/**
 * OrderTool
 *
 * Creates and persists a simulated food order to MongoDB.
 * Only called AFTER explicit GB-DCT validation succeeds — never claims success otherwise.
 */
export class OrderTool {
  /**
   * Persist a simulated order to MongoDB.
   */
  async createOrder(
    dish: MenuItemData,
    dctTokenId: string,
    auth: OrderAuthorization,
    replanCount: number = 0
  ): Promise<OrderDocument> {
    console.log(
      `[OrderTool] Creating order for: ${dish.name} (₹${dish.estimatedCost}) with token ${dctTokenId}`
    );

    const order = await OrderModel.create({
      dishId: dish.id,
      dishName: dish.name,
      price: dish.estimatedCost,
      status: "CONFIRMED",
      dctTokenId,
      agentGenerated: true,
      constraints: {
        maxBudget: auth.maxBudget,
        dietary: auth.dietary ?? [],
        excludedIngredients: auth.excludedIngredients ?? [],
        spiceLevel: auth.spiceLevel,
        cuisine: auth.cuisine,
      },
      replanned: replanCount > 0,
      replanCount,
      createdAt: new Date(),
    });

    console.log(`[OrderTool] Order successfully persisted to MongoDB: ${order._id}`);
    return order;
  }
}
