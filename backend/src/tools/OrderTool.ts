import { OrderModel, OrderDocument } from "../models/Order";
import { MenuItemData, OrderConstraints } from "../types/agent.types";

/**
 * OrderTool
 *
 * Creates and persists a simulated food order to MongoDB.
 * Only called AFTER DCT validation succeeds — never claims success otherwise.
 */
export class OrderTool {
  /**
   * Persist a simulated order to MongoDB.
   * Returns the created order document.
   *
   * Never creates an order unless MongoDB write completes successfully.
   */
  async createOrder(
    dish: MenuItemData,
    dctTokenId: string,
    constraints: OrderConstraints,
    replanned: boolean = false
  ): Promise<OrderDocument> {
    console.log(`[OrderTool] Creating order for: ${dish.name} (₹${dish.estimatedCost})`);

    const order = await OrderModel.create({
      dishId: dish.id,
      dishName: dish.name,
      price: dish.estimatedCost,
      status: "CONFIRMED",
      dctTokenId,
      agentGenerated: true,
      constraints: {
        maxBudget: constraints.maxBudget,
        dietary: constraints.dietary ?? [],
        spiceLevel: constraints.spiceLevel,
        cuisine: constraints.cuisine,
      },
      replanned,
      createdAt: new Date(),
    });

    console.log(`[OrderTool] Order created: ${order._id} for ${dish.name}`);
    return order;
  }
}
