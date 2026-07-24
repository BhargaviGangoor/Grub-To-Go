import mongoose, { Schema, Document } from "mongoose";

/**
 * Order Model
 *
 * Represents a simulated food order created by the PlannerAgent.
 * This is NOT a real payment or delivery order — it is a commitment record
 * tied to a GB-DCT token, demonstrating autonomous agentic ordering.
 */

export interface OrderDocument extends Document {
  dishId: string;
  dishName: string;
  price: number;
  status: "PENDING" | "CONFIRMED" | "FAILED";
  dctTokenId: string;
  agentGenerated: boolean;
  constraints: {
    maxBudget?: number;
    dietary?: string[];
    spiceLevel?: string;
    cuisine?: string;
  };
  replanned: boolean;       // true if agent had to replan (first choice drifted)
  createdAt: Date;
}

const OrderSchema = new Schema<OrderDocument>({
  dishId: { type: String, required: true },
  dishName: { type: String, required: true },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "FAILED"],
    default: "CONFIRMED",
    required: true,
  },
  dctTokenId: { type: String, required: true },
  agentGenerated: { type: Boolean, default: true },
  constraints: {
    maxBudget: { type: Number },
    dietary: [{ type: String }],
    spiceLevel: { type: String },
    cuisine: { type: String },
  },
  replanned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const OrderModel = mongoose.model<OrderDocument>("Order", OrderSchema);
