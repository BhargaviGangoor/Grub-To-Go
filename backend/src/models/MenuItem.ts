import mongoose, { Schema, Document } from "mongoose";
import { MenuItemData } from "../types/agent.types";

/**
 * MenuItem Model
 *
 * Persistent dish catalog stored in MongoDB.
 * This is the source of truth for MenuTool — the LLM never invents dishes.
 * Seeded from the existing mock dish data in services/ai.ts.
 */

export interface MenuItemDocument extends Document, Omit<MenuItemData, "id"> {}

const MenuItemSchema = new Schema<MenuItemDocument>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  cuisine: { type: String, required: true },
  spiceLevel: {
    type: String,
    enum: ["Mild", "Medium", "Spicy"],
    required: true,
  },
  dietary: [{ type: String }],
  estimatedCost: { type: Number, required: true },
  ingredients: [{ type: String }],
  description: { type: String, required: true },
  imageUrl: { type: String, default: "/download.jpg" },
});

export const MenuItemModel = mongoose.model<MenuItemDocument>(
  "MenuItem",
  MenuItemSchema
);

/**
 * Seed data — derived from the existing mock dish catalog in services/ai.ts.
 * Prices are consistent with the default pantry pricing.
 */
export const menuItemSeedData: MenuItemData[] = [
  {
    id: "dish-001",
    name: "Wild Forest Mushroom Soup",
    cuisine: "Any",
    spiceLevel: "Mild",
    dietary: ["Vegetarian", "Gluten-Free", "Gluten Free"],
    estimatedCost: 150,
    ingredients: ["Mushrooms", "Heavy Cream", "Sage"],
    description:
      "A velvety blend of simmered forest mushrooms, garden sage, and double heavy cream.",
    imageUrl: "/download3.jpg",
  },
  {
    id: "dish-002",
    name: "Aromatic Saffron Vegetable Biryani",
    cuisine: "Indian",
    spiceLevel: "Mild",
    dietary: ["Vegetarian", "Vegan", "Jain", "Gluten-Free", "Gluten Free"],
    estimatedCost: 180,
    ingredients: ["Basmati Rice", "Saffron", "Sage"],
    description:
      "Fragrant long-grain basmati rice steamed with real saffron threads and aromatic garden herbs.",
    imageUrl: "/download4.jpg",
  },
  {
    id: "dish-003",
    name: "Spicy Cream Paneer Saffron Bowl",
    cuisine: "Indian",
    spiceLevel: "Spicy",
    dietary: ["Vegetarian", "Gluten-Free", "Gluten Free"],
    estimatedCost: 260,
    ingredients: ["Paneer", "Basmati Rice", "Saffron", "Heavy Cream"],
    description:
      "Saffron infused basmati grains topped with golden paneer cubes in a cardamom cream glaze.",
    imageUrl: "/download4.jpg",
  },
  {
    id: "dish-004",
    name: "Gluten-Free Ginger Garlic Mushrooms",
    cuisine: "Chinese",
    spiceLevel: "Mild",
    dietary: ["Vegetarian", "Vegan", "Gluten-Free", "Gluten Free"],
    estimatedCost: 140,
    ingredients: ["Mushrooms", "Sage", "Basmati Rice"],
    description:
      "Stir-fried wild mushrooms tossed in light tamari and served over steamed basmati rice.",
    imageUrl: "/download3.jpg",
  },
  {
    id: "dish-005",
    name: "Chili Cream Udon Ribbons",
    cuisine: "Chinese",
    spiceLevel: "Spicy",
    dietary: ["Vegetarian"],
    estimatedCost: 210,
    ingredients: ["Udon Noodles", "Paneer", "Heavy Cream"],
    description:
      "Thick, hand-pulled wheat udon noodles tossed in a spicy cream paste with tossed paneer cubes.",
    imageUrl: "/download.jpg",
  },
  {
    id: "dish-006",
    name: "Tuscan Garlic Mushroom Pasta",
    cuisine: "Italian",
    spiceLevel: "Mild",
    dietary: ["Vegetarian"],
    estimatedCost: 190,
    ingredients: ["Ramen Noodles", "Mushrooms", "Sage", "Heavy Cream"],
    description:
      "Creamy forest mushroom skillet sauce tossed with thin noodles and fresh chopped sage.",
    imageUrl: "/download2.jpg",
  },
  {
    id: "dish-007",
    name: "Spicy Cream Paneer Udon Bowl",
    cuisine: "Any",
    spiceLevel: "Spicy",
    dietary: ["Vegetarian"],
    estimatedCost: 230,
    ingredients: ["Udon Noodles", "Paneer", "Heavy Cream"],
    description:
      "Hand-pulled wheat noodles tossed in a fire-red chili cream emulsion with cubes of soft paneer.",
    imageUrl: "/download.jpg",
  },
  {
    id: "dish-008",
    name: "Slow Simmered Saffron Rice & Sage",
    cuisine: "Any",
    spiceLevel: "Mild",
    dietary: ["Vegetarian", "Vegan", "Gluten-Free", "Gluten Free"],
    estimatedCost: 160,
    ingredients: ["Basmati Rice", "Saffron", "Sage", "Mushrooms"],
    description:
      "Earthy wild mushrooms and fragrant saffron basmati rice topped with sage leaves.",
    imageUrl: "/download4.jpg",
  },
];

/**
 * Seeds the MenuItem collection if it is empty (idempotent).
 */
export const seedMenuItems = async (): Promise<void> => {
  const count = await MenuItemModel.countDocuments();
  if (count === 0) {
    console.log("🍽️  Seeding menu catalog to MongoDB...");
    await MenuItemModel.insertMany(menuItemSeedData);
    console.log(`✓ Seeded ${menuItemSeedData.length} menu items.`);
  }
};
