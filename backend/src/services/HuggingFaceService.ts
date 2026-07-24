import fs from "fs";
import path from "path";
import { config } from "../config";

/**
 * HuggingFaceService.ts
 *
 * Integrates Hugging Face Inference API to generate realistic, high-quality
 * food thumbnails for dishes in the French Bistro Menu using models like
 * FLUX.1-schnell or Stable Diffusion.
 *
 * Includes fallback to pre-rendered high-quality French bistro images
 * to ensure zero downtime and ultra-fast loading.
 */

const HF_MODEL = process.env.HF_MODEL || "black-forest-labs/FLUX.1-schnell";
const HF_TOKEN = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY || "";

// Default visual map for French Bistro dishes to verified high-definition dish assets
const DISH_IMAGE_MAP: Record<string, string> = {
  // Viennoiseries
  "Croissant": "/dishes/croissant.png",
  "Pain au Chocolat": "/dishes/pain_au_chocolat.png",
  "Pain aux Raisins": "/dishes/pain_aux_raisins.png",
  "Brioche": "/dishes/brioche.png",
  "Chausson aux Pommes": "/dishes/chausson_aux_pommes.png",

  // Tartines & Light Plates
  "Tartine Beurre et Confiture": "/dishes/tartine_beurre_confiture.png",
  "Tartine au Fromage": "/dishes/tartine_au_fromage.png",
  "Assiette de Fromages": "/dishes/assiette_de_fromages.png",
  "Assiette de Charcuterie": "/dishes/assiette_de_charcuterie.png",

  // Salads & Savory
  "Salade Niçoise": "/dishes/salade_nicoise.png",
  "Salade de Chèvre Chaud": "/dishes/salade_chevre_chaud.png",
  "Quiche Lorraine": "/dishes/quiche_lorraine.png",
  "Croque Monsieur": "/dishes/croque_monsieur.png",
  "Croque Madame": "/dishes/croque_madame.png",

  // Soups & Warm Plates
  "Soupe à l’Oignon Gratinée": "/dishes/soupe_a_loignon.png",
  "Potage du Jour": "/dishes/potage_du_jour.png",
  "Ratatouille": "/dishes/ratatouille.png",

  // Desserts
  "Tarte Tatin": "/dishes/tarte_tatin.png",
  "Crème Brûlée": "/dishes/creme_brulee.png",
  "Mousse au Chocolat": "/dishes/mousse_au_chocolat.png",
  "Madeleines": "/dishes/madeleines.png",
  "Éclair au Café/Chocolat": "/dishes/eclair.png",

  // Beverages
  "Café au Lait": "/dishes/cafe_au_lait.png",
  "Espresso": "/dishes/espresso.png",
  "Chocolat Chaud": "/dishes/chocolat_chaud.png",
  "Thé": "/dishes/the.png",
  "Jus d’Orange Pressé": "/dishes/jus_dorange.png",
  "Vin Maison": "/dishes/vin_maison.png",
};

export class HuggingFaceService {
  /**
   * Generates a food thumbnail image via Hugging Face Inference API.
   * If HF_TOKEN is configured, calls HF model API.
   * Otherwise returns mapped local asset URL.
   */
  static async generateFoodThumbnail(dishName: string, promptText?: string): Promise<string> {
    const prompt = promptText || `High-end professional food photography of authentic French bistro ${dishName}, gourmet plating, soft warm bistro lighting, 4k studio detail, shallow depth of field`;

    if (!HF_TOKEN) {
      console.log(`[HuggingFace] HF_TOKEN not provided. Using fallback image for: ${dishName}`);
      return DISH_IMAGE_MAP[dishName] || "/download.jpg";
    }

    try {
      console.log(`[HuggingFace] Generating image via HF model (${HF_MODEL}) for: ${dishName}...`);

      const response = await fetch(
        `https://api-inference.huggingface.co/models/${HF_MODEL}`,
        {
          headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: prompt }),
        }
      );

      if (!response.ok) {
        console.warn(`[HuggingFace] API warning (${response.status}): ${response.statusText}. Using mapped asset.`);
        return DISH_IMAGE_MAP[dishName] || "/download.jpg";
      }

      // Read image array buffer
      const buffer = await response.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString("base64");
      const mimeType = response.headers.get("content-type") || "image/jpeg";

      console.log(`[HuggingFace] Image generated successfully for: ${dishName}`);
      return `data:${mimeType};base64,${base64Image}`;
    } catch (error) {
      console.error(`[HuggingFace] Generation error:`, error);
      return DISH_IMAGE_MAP[dishName] || "/download.jpg";
    }
  }

  /**
   * Get default image URL for a French Bistro dish
   */
  static getDefaultImage(dishName: string): string {
    return DISH_IMAGE_MAP[dishName] || "/download.jpg";
  }
}
