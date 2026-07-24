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

// Default visual map for French Bistro dishes to public assets
const DISH_IMAGE_MAP: Record<string, string> = {
  // Viennoiseries
  "Croissant": "/paris_croissant.png",
  "Pain au Chocolat": "/paris_croissant.png",
  "Pain aux Raisins": "/macarons.jpg",
  "Brioche": "/paris_croissant.png",
  "Chausson aux Pommes": "/download3.jpg",

  // Tartines & Light Plates
  "Tartine Beurre et Confiture": "/frenchme.jpg",
  "Tartine au Fromage": "/frenchme.jpg",
  "Assiette de Fromages": "/frenchme.jpg",
  "Assiette de Charcuterie": "/frenchme.jpg",

  // Salads & Savory
  "Salade Niçoise": "/good-food.jpg",
  "Salade de Chèvre Chaud": "/good-food.jpg",
  "Quiche Lorraine": "/good-food.jpg",
  "Croque Monsieur": "/frenchme.jpg",
  "Croque Madame": "/frenchme.jpg",

  // Soups & Warm Plates
  "Soupe à l’Oignon Gratinée": "/french_soup.png",
  "Potage du Jour": "/french_soup.png",
  "Ratatouille": "/french_soup.png",

  // Desserts
  "Tarte Tatin": "/macarons.jpg",
  "Crème Brûlée": "/macarons.jpg",
  "Mousse au Chocolat": "/macarons.jpg",
  "Madeleines": "/macarons.jpg",
  "Éclair au Café/Chocolat": "/paris_macarons.png",

  // Beverages
  "Café au Lait": "/paris_coffee.png",
  "Espresso": "/paris_coffee.png",
  "Chocolat Chaud": "/paris_coffee.png",
  "Thé": "/paris_coffee.png",
  "Jus d’Orange Pressé": "/paris_coffee.png",
  "Vin Maison": "/paris_coffee.png",
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
