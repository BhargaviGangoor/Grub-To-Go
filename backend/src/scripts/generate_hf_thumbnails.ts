import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const HF_MODEL = process.env.HF_MODEL || "black-forest-labs/FLUX.1-schnell";
const HF_TOKEN = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY || "";

const DISHES = [
  { id: "croissant", name: "Croissant", prompt: "A golden flaky fresh French croissant pastry on a rustic marble table, soft studio light, 4k food photography" },
  { id: "pain_au_chocolat", name: "Pain au Chocolat", prompt: "Authentic French Pain au Chocolat puff pastry with dark chocolate sticks inside, flaky layers" },
  { id: "pain_aux_raisins", name: "Pain aux Raisins", prompt: "French spiral pain aux raisins pastry with vanilla custard cream and raisins, golden baked" },
  { id: "brioche", name: "Brioche", prompt: "Golden tender French brioche loaf slice on wooden cutting board with butter" },
  { id: "chausson_aux_pommes", name: "Chausson aux Pommes", prompt: "French apple turnover puff pastry with caramelized apple compote, golden crust" },
  { id: "tartine_beurre_confiture", name: "Tartine Beurre et Confiture", prompt: "French baguette slice topped with yellow butter and strawberry jam on rustic table" },
  { id: "tartine_au_fromage", name: "Tartine au Fromage", prompt: "Toasted French baguette slice topped with whipped herb cream cheese spread" },
  { id: "assiette_de_fromages", name: "Assiette de Fromages", prompt: "Artisanal French cheese plate with Brie, Camembert, grapes and baguette slices" },
  { id: "assiette_de_charcuterie", name: "Assiette de Charcuterie", prompt: "French charcuterie platter with cured ham, saucisson, pickles cornichons and sourdough bread" },
  { id: "salade_nicoise", name: "Salade Niçoise", prompt: "Fresh Salade Nicoise with seared tuna steak, black olives, hard boiled egg, green beans" },
  { id: "salade_chevre_chaud", name: "Salade de Chèvre Chaud", prompt: "Warm French goat cheese melted on sourdough toast served over honey dressed salad" },
  { id: "quiche_lorraine", name: "Quiche Lorraine", prompt: "Slice of savory French Quiche Lorraine baked with bacon lardons and melted Gruyere cheese" },
  { id: "croque_monsieur", name: "Croque Monsieur", prompt: "Parisian Croque Monsieur sandwich with melted Gruyere cheese and ham, golden toasted" },
  { id: "croque_madame", name: "Croque Madame", prompt: "Croque Madame sandwich topped with a fried sunny side up egg with runny yolk" },
  { id: "soupe_a_loignon", name: "Soupe à l’Oignon Gratinée", prompt: "French onion soup in ceramic bowl topped with toasted baguette and melted Gruyere cheese" },
  { id: "potage_du_jour", name: "Potage du Jour", prompt: "Creamy seasonal French vegetable soup served in white ceramic bowl with fresh herbs" },
  { id: "ratatouille", name: "Ratatouille", prompt: "Provençal Ratatouille vegetable stew with sliced zucchini, eggplant, tomatoes in skillet" },
  { id: "tarte_tatin", name: "Tarte Tatin", prompt: "Caramelized upside down apple Tarte Tatin slice with vanilla creme fraiche" },
  { id: "creme_brulee", name: "Crème Brûlée", prompt: "French Creme Brulee in ramekin with hard burnt caramel top crust, vanilla bean" },
  { id: "mousse_au_chocolat", name: "Mousse au Chocolat", prompt: "Rich dark chocolate mousse in glass bowl topped with whipped cream and cocoa powder" },
  { id: "madeleines", name: "Madeleines", prompt: "Freshly baked shell shaped French Madeleines dusted with powdered sugar" },
  { id: "eclair", name: "Éclair au Café/Chocolat", prompt: "French chocolate eclair pastry filled with cream and glossy chocolate glaze" },
  { id: "cafe_au_lait", name: "Café au Lait", prompt: "French Cafe au Lait coffee in white ceramic cup with warm steamed milk foam" },
  { id: "espresso", name: "Espresso", prompt: "Single shot of dark French espresso coffee in cup with golden crema" },
  { id: "chocolat_chaud", name: "Chocolat Chaud", prompt: "Thick Parisian dark hot chocolate drink in porcelain cup topped with Chantilly cream" },
  { id: "the", name: "Thé Gourmet", prompt: "Glass teapot with Earl Grey tea and cup on saucer" },
  { id: "jus_dorange", name: "Jus d’Orange Pressé", prompt: "Glass of freshly squeezed Valencia orange juice with fresh orange slice" },
  { id: "vin_maison", name: "Vin Maison", prompt: "Glass of red French Bordeaux wine on Parisian bistro table" },
];

async function generateAllThumbnails() {
  console.log(`🚀 Generating AI Image Thumbnails for all ${DISHES.length} French Bistro Dishes...`);

  const outputDir = path.join(__dirname, "../../../frontend/public/dishes");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let successCount = 0;

  for (const dish of DISHES) {
    const filename = `${dish.id}.png`;
    const filepath = path.join(outputDir, filename);

    console.log(`📸 Generating AI image for [${dish.name}]...`);

    let imageBuffer: Buffer | null = null;

    // 1. Try Hugging Face Inference API if HF_TOKEN is configured
    if (HF_TOKEN) {
      try {
        const endpoints = [
          `https://router.huggingface.co/hf-inference/v1/models/${HF_MODEL}`,
          `https://api-inference.huggingface.co/models/${HF_MODEL}`
        ];

        for (const url of endpoints) {
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({ inputs: dish.prompt }),
          });

          if (res.ok) {
            imageBuffer = Buffer.from(await res.arrayBuffer());
            console.log(`  ✓ Generated via Hugging Face (${dish.name})`);
            break;
          }
        }
      } catch (err) {
        // Fallback to AI image service
      }
    }

    // 2. Pollinations AI high-speed fallback if HF endpoint unavailable
    if (!imageBuffer) {
      try {
        const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(dish.prompt)}?width=600&height=400&nologo=true`;
        const res = await fetch(pollUrl);
        if (res.ok) {
          imageBuffer = Buffer.from(await res.arrayBuffer());
          console.log(`  ✓ Generated via AI Image Engine (${dish.name})`);
        }
      } catch (err) {
        console.error(`  ⚠️ Failed generating image for ${dish.name}:`, err);
      }
    }

    if (imageBuffer) {
      fs.writeFileSync(filepath, imageBuffer);
      successCount++;
    }
  }

  console.log(`\n🎉 Successfully generated ${successCount}/${DISHES.length} AI dish thumbnails in frontend/public/dishes/`);
}

generateAllThumbnails();
