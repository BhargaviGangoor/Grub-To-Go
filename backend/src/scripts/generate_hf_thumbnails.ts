import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const HF_MODEL = process.env.HF_MODEL || "black-forest-labs/FLUX.1-schnell";
const HF_TOKEN = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY || "";

const DISHES = [
  { id: "croissant", name: "Croissant", prompt: "High-end food photography of a golden flaky French croissant pastry on a marble bistro table, studio lighting, 4k detail" },
  { id: "pain_au_chocolat", name: "Pain au Chocolat", prompt: "Professional food photograph of French Pain au chocolat pastry filled with dark chocolate, flaky texture, gourmet plating" },
  { id: "pain_aux_raisins", name: "Pain aux Raisins", prompt: "Gourmet photograph of French spiral pain aux raisins pastry with vanilla custard and raisins" },
  { id: "brioche", name: "Brioche", prompt: "Freshly baked golden French brioche loaf slice on wooden board, warm lighting" },
  { id: "chausson_aux_pommes", name: "Chausson aux Pommes", prompt: "Golden French apple turnover puff pastry, flaky crust, caramelized apple filling, food photography" },
  { id: "tartine_beurre_confiture", name: "Tartine Beurre et Confiture", prompt: "French baguette slice topped with yellow farm butter and red strawberry jam, cozy Parisian breakfast scene" },
  { id: "tartine_au_fromage", name: "Tartine au Fromage", prompt: "Toasted French baguette slice topped with whipped herb cheese spread, garlic and herbs" },
  { id: "assiette_de_fromages", name: "Assiette de Fromages", prompt: "Artisanal French cheese board with Brie, Camembert, Roquefort and baguette slices" },
  { id: "assiette_de_charcuterie", name: "Assiette de Charcuterie", prompt: "French charcuterie board with cured meats, saucisson, pickles cornichons and sourdough bread" },
  { id: "salade_nicoise", name: "Salade Niçoise", prompt: "Fresh Salade Nicoise with seared tuna, black olives, hard boiled egg, green beans" },
  { id: "salade_chevre_chaud", name: "Salade de Chèvre Chaud", prompt: "Warm French goat cheese toasted on sourdough crostini over mixed green salad with honey" },
  { id: "quiche_lorraine", name: "Quiche Lorraine", prompt: "Slice of classic Quiche Lorraine egg tart baked with bacon and melted Gruyere cheese" },
  { id: "croque_monsieur", name: "Croque Monsieur", prompt: "Parisian Croque Monsieur sandwich with melted Gruyere cheese and ham, golden toasted" },
  { id: "croque_madame", name: "Croque Madame", prompt: "Croque Madame sandwich topped with a sunny side up fried egg with running yolk" },
  { id: "soupe_a_loignon", name: "Soupe à l’Oignon Gratinée", prompt: "French onion soup in traditional ceramic bowl topped with toasted baguette and melted Gruyere cheese" },
  { id: "potage_du_jour", name: "Potage du Jour", prompt: "Creamy seasonal French vegetable soup served in white bowl with fresh parsley" },
  { id: "ratatouille", name: "Ratatouille", prompt: "Provençal Ratatouille vegetable stew with sliced zucchini, eggplant, tomatoes in skillet" },
  { id: "tarte_tatin", name: "Tarte Tatin", prompt: "Slice of warm caramelized upside down apple Tarte Tatin with creme fraiche" },
  { id: "creme_brulee", name: "Crème Brûlée", prompt: "French Creme Brulee in ramekin with hard caramelized burnt sugar top, vanilla bean" },
  { id: "mousse_au_chocolat", name: "Mousse au Chocolat", prompt: "Rich dark chocolate mousse in glass dessert bowl topped with whipped cream and cocoa powder" },
  { id: "madeleines", name: "Madeleines", prompt: "Freshly baked shell-shaped French Madeleines dusted with powdered sugar" },
  { id: "eclair", name: "Éclair au Café/Chocolat", prompt: "French chocolate éclair pastry filled with cream and glossy chocolate glaze" },
  { id: "cafe_au_lait", name: "Café au Lait", prompt: "French Cafe au Lait coffee in ceramic cup with steamed milk foam" },
  { id: "espresso", name: "Espresso", prompt: "Single shot of dark French espresso in small white cup with rich crema" },
  { id: "chocolat_chaud", name: "Chocolat Chaud", prompt: "Thick Parisian dark hot chocolate drink in cup topped with whipped cream" },
  { id: "the", name: "Thé Gourmet", prompt: "Glass teapot with Earl Grey tea and cup on saucer" },
  { id: "jus_dorange", name: "Jus d’Orange Pressé", prompt: "Glass of freshly squeezed orange juice with orange slice garnish" },
  { id: "vin_maison", name: "Vin Maison", prompt: "Glass of red French Bordeaux wine on bistro table" },
];

async function generateAllThumbnails() {
  console.log(`🚀 Starting Hugging Face Image Generation for ${DISHES.length} French Bistro Dishes...`);
  console.log(`Model: ${HF_MODEL}`);
  console.log(`HF_TOKEN: ${HF_TOKEN ? "Configured ✓" : "Not configured (Using fallback generator API)"}`);

  const outputDir = path.join(__dirname, "../../../frontend/public/dishes");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const dish of DISHES) {
    const filename = `${dish.id}.png`;
    const filepath = path.join(outputDir, filename);

    console.log(`📸 Generating HF thumbnail for [${dish.name}]...`);

    try {
      if (HF_TOKEN) {
        const response = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
          headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: dish.prompt }),
        });

        if (response.ok) {
          const buffer = Buffer.from(await response.arrayBuffer());
          fs.writeFileSync(filepath, buffer);
          console.log(`✓ Saved HF generated image to public/dishes/${filename}`);
          continue;
        } else {
          console.warn(`HF API returned ${response.status}: ${response.statusText}`);
        }
      }
    } catch (err) {
      console.error(`Error generating HF image for ${dish.name}:`, err);
    }
  }

  console.log(`🎉 Finished processing all 28 dish thumbnails.`);
}

generateAllThumbnails();
