import dotenv from "dotenv";
import { GroqProvider } from "../llm/GroqProvider";
import { MenuTool } from "../tools/MenuTool";
import { InventoryTool } from "../tools/InventoryTool";
import { DCTTool } from "../tools/DCTTool";
import { OrderTool } from "../tools/OrderTool";
import { DCTService } from "../services/DCTService";
import { PlannerAgent } from "../agents/PlannerAgent";
import { ChatService } from "../services/ChatService";

dotenv.config();

async function testAgentFlow() {
  console.log("🤖 Running Agent Order Test...");
  const llm = new GroqProvider();
  const menuTool = new MenuTool();
  const inventoryTool = new InventoryTool();
  const dctService = new DCTService();
  const dctTool = new DCTTool(dctService);
  const orderTool = new OrderTool();

  const planner = new PlannerAgent(llm, menuTool, inventoryTool, dctTool, orderTool);
  const chatService = new ChatService(planner);

  const userMessage = "I would like to order 1 Croissant and 1 Mousse au Chocolat please!";
  console.log(`User Input: "${userMessage}"\n`);

  try {
    const response = await chatService.processMessage(userMessage);
    console.log("--- AGENT RESPONSE ---");
    console.log("Reply:\n", response.reply);
  } catch (err: any) {
    console.error("❌ Agent error:", err.message);
  }
}

testAgentFlow();
