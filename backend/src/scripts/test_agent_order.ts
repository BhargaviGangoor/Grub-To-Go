import dotenv from "dotenv";
import { ChatService } from "../services/ChatService";

dotenv.config();

async function testAgentFlow() {
  console.log("🤖 Running Agent Order Test...");
  const chatService = ChatService.getInstance();

  const userMessage = "I would like to order 1 Croissant and 1 Mousse au Chocolat please!";
  console.log(`User Input: "${userMessage}"\n`);

  try {
    const response = await chatService.processMessage(userMessage);

    console.log("--- AGENT RESPONSE ---");
    console.log("Message:\n", response.message);
    console.log("\n--- ORDER TICKET CREATED BY AGENT ---");
    console.dir(response.orderTicket, { depth: null });
    
    if (response.orderTicket && response.orderTicket.items) {
      console.log("\n--- VERIFYING THUMBNAILS IN ORDER TICKET ---");
      for (const item of response.orderTicket.items) {
        console.log(`Dish: [${item.dishName}] -> Image URL: ${item.imageUrl}`);
      }
    }
  } catch (err: any) {
    console.error("❌ Agent error:", err.message);
  }
}

testAgentFlow();
