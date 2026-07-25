import dotenv from "dotenv";
import { OpenRouterProvider } from "../llm/OpenRouterProvider";

dotenv.config();

async function testOpenRouter() {
  console.log("===============================================================");
  console.log("🧪 TESTING OPENROUTER LLM PROVIDER");
  console.log("===============================================================");

  const openrouter = new OpenRouterProvider();

  try {
    const reply = await openrouter.chat("Hello! Suggest one classic French dish for dinner.");
    console.log("✅ OpenRouter Response:", reply);
    console.log("===============================================================");
    console.log("🎉 OpenRouter Integration Test Succeeded!");
    console.log("===============================================================");
  } catch (err: any) {
    console.error("❌ OpenRouter Test Error:", err.message);
  }
}

testOpenRouter();
