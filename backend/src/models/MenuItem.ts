import mongoose, { Schema, Document } from "mongoose";
import { MenuItemData } from "../types/agent.types";

/**
 * MenuItem Model
 *
 * Persistent dish catalog stored in MongoDB.
 * Source of truth for MenuTool — 100% grounded in authentic French Bistro Menu.
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
  imageUrl: { type: String, default: "/paris_croissant.png" },
});

export const MenuItemModel = mongoose.model<MenuItemDocument>(
  "MenuItem",
  MenuItemSchema
);

/**
 * Authentic French Bistro Menu Catalog
 */
export const menuItemSeedData: MenuItemData[] = [
  // 🥐 Viennoiseries (Breakfast Pastries)
  {
    id: "fr-001",
    name: "Croissant",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Vegetarian"],
    estimatedCost: 120,
    ingredients: ["Flour", "Butter", "Yeast"],
    description: "Buttery, flaky classic French breakfast pastry freshly baked daily.",
    imageUrl: "/paris_croissant.png",
  },
  {
    id: "fr-002",
    name: "Pain au Chocolat",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Vegetarian"],
    estimatedCost: 150,
    ingredients: ["Flour", "Butter", "Chocolate"],
    description: "Flaky puff pastry baked with two batons of rich dark French chocolate.",
    imageUrl: "/paris_croissant.png",
  },
  {
    id: "fr-003",
    name: "Pain aux Raisins",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Vegetarian"],
    estimatedCost: 160,
    ingredients: ["Flour", "Butter", "Custard", "Raisins"],
    description: "Golden spiral puff pastry filled with vanilla creme patissiere & juicy raisins.",
    imageUrl: "/macarons.jpg",
  },
  {
    id: "fr-004",
    name: "Brioche",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Vegetarian"],
    estimatedCost: 140,
    ingredients: ["Flour", "Butter", "Eggs", "Sugar"],
    description: "Soft, golden, sweet French brioche loaf slice baked with farm butter.",
    imageUrl: "/paris_croissant.png",
  },
  {
    id: "fr-005",
    name: "Chausson aux Pommes",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Vegetarian", "Vegan"],
    estimatedCost: 170,
    ingredients: ["Flour", "Butter", "Apples"],
    description: "Crispy turnover filled with slow-caramelized French apple compote.",
    imageUrl: "/download3.jpg",
  },

  // 🍞 Tartines & Light Plates
  {
    id: "fr-006",
    name: "Tartine Beurre et Confiture",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Vegetarian"],
    estimatedCost: 130,
    ingredients: ["Baguette", "Butter", "Strawberry Jam"],
    description: "Crusty French baguette slice with Beurre d'Isigny & artisan strawberry jam.",
    imageUrl: "/frenchme.jpg",
  },
  {
    id: "fr-007",
    name: "Tartine au Fromage",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Vegetarian"],
    estimatedCost: 180,
    ingredients: ["Baguette", "Cheese Spread", "Herbs"],
    description: "Toasted baguette topped with garlic-herb whipped cream cheese spread.",
    imageUrl: "/frenchme.jpg",
  },
  {
    id: "fr-008",
    name: "Assiette de Fromages",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Vegetarian", "Gluten-Free"],
    estimatedCost: 320,
    ingredients: ["Brie", "Camembert", "Baguette"],
    description: "Selection of aged Brie, Camembert & Roquefort served with baguette.",
    imageUrl: "/frenchme.jpg",
  },
  {
    id: "fr-009",
    name: "Assiette de Charcuterie",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Non-Vegetarian"],
    estimatedCost: 350,
    ingredients: ["Cold Cuts", "Cornichons", "Baguette"],
    description: "Assorted cured meats, saucisson sec, cornichons pickles & rustic sourdough.",
    imageUrl: "/frenchme.jpg",
  },

  // 🥗 Salads & Savory Dishes
  {
    id: "fr-010",
    name: "Salade Niçoise",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Non-Vegetarian", "Gluten-Free"],
    estimatedCost: 280,
    ingredients: ["Tuna", "Olives", "Eggs", "Green Beans"],
    description: "Provençal salad with seared tuna, Niçoise olives, soft egg & green beans.",
    imageUrl: "/good-food.jpg",
  },
  {
    id: "fr-011",
    name: "Salade de Chèvre Chaud",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Vegetarian"],
    estimatedCost: 260,
    ingredients: ["Goat Cheese", "Greens", "Sourdough", "Honey"],
    description: "Warm goat cheese melted on crostini served over honey-dressed greens.",
    imageUrl: "/good-food.jpg",
  },
  {
    id: "fr-012",
    name: "Quiche Lorraine",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Non-Vegetarian"],
    estimatedCost: 240,
    ingredients: ["Eggs", "Cream", "Bacon", "Gruyère Cheese"],
    description: "Classic French egg tart baked with smoky bacon lardons & melted Gruyère.",
    imageUrl: "/good-food.jpg",
  },
  {
    id: "fr-013",
    name: "Croque Monsieur",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Non-Vegetarian"],
    estimatedCost: 270,
    ingredients: ["Bread", "Ham", "Gruyère Cheese", "Bechamel"],
    description: "Classic Parisian grilled ham & melted Gruyère sandwich with rich Béchamel.",
    imageUrl: "/frenchme.jpg",
  },
  {
    id: "fr-014",
    name: "Croque Madame",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Non-Vegetarian"],
    estimatedCost: 290,
    ingredients: ["Bread", "Ham", "Gruyère Cheese", "Egg"],
    description: "Croque Monsieur topped with a sunny-side-up fried farm egg.",
    imageUrl: "/frenchme.jpg",
  },

  // 🍲 Soups & Warm Plates
  {
    id: "fr-015",
    name: "Soupe à l’Oignon Gratinée",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Vegetarian"],
    estimatedCost: 250,
    ingredients: ["Onions", "Broth", "Baguette", "Gruyère Cheese"],
    description: "Caramelized French onion soup topped with toasted baguette & broiled Gruyère.",
    imageUrl: "/french_soup.png",
  },
  {
    id: "fr-016",
    name: "Potage du Jour",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Vegetarian", "Vegan", "Gluten-Free"],
    estimatedCost: 190,
    ingredients: ["Seasonal Vegetables", "Butter", "Herbs"],
    description: "Chef's daily seasonal vegetable soup served with warm French bread.",
    imageUrl: "/french_soup.png",
  },
  {
    id: "fr-017",
    name: "Ratatouille",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Vegetarian", "Vegan", "Gluten-Free"],
    estimatedCost: 230,
    ingredients: ["Zucchini", "Eggplant", "Tomatoes", "Bell Peppers"],
    description: "Slow-simmered Provençal vegetable stew with fresh thyme, garlic & olive oil.",
    imageUrl: "/french_soup.png",
  },

  // 🍰 Desserts
  {
    id: "fr-018",
    name: "Tarte Tatin",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Vegetarian"],
    estimatedCost: 220,
    ingredients: ["Apples", "Butter", "Sugar", "Pastry Crust"],
    description: "Caramelized upside-down apple tart served warm with creme fraiche.",
    imageUrl: "/macarons.jpg",
  },
  {
    id: "fr-019",
    name: "Crème Brûlée",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Vegetarian", "Gluten-Free"],
    estimatedCost: 200,
    ingredients: ["Heavy Cream", "Egg Yolks", "Sugar", "Vanilla"],
    description: "Rich Tahitian vanilla bean custard topped with hard burnt caramel crust.",
    imageUrl: "/macarons.jpg",
  },
  {
    id: "fr-020",
    name: "Mousse au Chocolat",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Vegetarian", "Gluten-Free"],
    estimatedCost: 180,
    ingredients: ["Dark Chocolate", "Cream", "Eggs", "Sugar"],
    description: "Decadent, airy dark Valrhona chocolate mousse with whipped cream.",
    imageUrl: "/macarons.jpg",
  },
  {
    id: "fr-021",
    name: "Madeleines",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Vegetarian"],
    estimatedCost: 130,
    ingredients: ["Flour", "Butter", "Sugar", "Lemon Zest"],
    description: "Freshly baked shell-shaped sponge cakes dusted with lemon zest & powder sugar.",
    imageUrl: "/macarons.jpg",
  },
  {
    id: "fr-022",
    name: "Éclair au Café/Chocolat",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Vegetarian"],
    estimatedCost: 160,
    ingredients: ["Choux Pastry", "Cream", "Chocolate", "Coffee"],
    description: "Choux pastry filled with silky coffee or chocolate cream & dark cocoa glaze.",
    imageUrl: "/paris_macarons.png",
  },

  // ☕ Beverages
  {
    id: "fr-023",
    name: "Café au Lait",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Vegetarian", "Gluten-Free"],
    estimatedCost: 110,
    ingredients: ["Espresso", "Steamed Milk"],
    description: "Classic Parisian dark roast coffee served with rich steamed milk.",
    imageUrl: "/paris_coffee.png",
  },
  {
    id: "fr-024",
    name: "Espresso",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Vegetarian", "Vegan", "Gluten-Free"],
    estimatedCost: 90,
    ingredients: ["Espresso Beans", "Water"],
    description: "Short, intense shot of dark roasted arabica coffee with golden crema.",
    imageUrl: "/paris_coffee.png",
  },
  {
    id: "fr-025",
    name: "Chocolat Chaud",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Vegetarian", "Gluten-Free"],
    estimatedCost: 150,
    ingredients: ["Dark Chocolate", "Milk", "Heavy Cream"],
    description: "Thick Parisian melted dark chocolate drink topped with Chantilly cream.",
    imageUrl: "/paris_coffee.png",
  },
  {
    id: "fr-026",
    name: "Thé",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Vegetarian", "Vegan", "Gluten-Free"],
    estimatedCost: 100,
    ingredients: ["Tea Leaves", "Hot Water"],
    description: "Selection of loose-leaf Earl Grey, Chamomile, or Jasmine teas.",
    imageUrl: "/paris_coffee.png",
  },
  {
    id: "fr-027",
    name: "Jus d’Orange Pressé",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Vegetarian", "Vegan", "Gluten-Free"],
    estimatedCost: 120,
    ingredients: ["Fresh Oranges"],
    description: "100% freshly squeezed Valencia orange juice served chilled.",
    imageUrl: "/paris_coffee.png",
  },
  {
    id: "fr-028",
    name: "Vin Maison",
    cuisine: "French",
    spiceLevel: "Mild",
    dietary: ["Vegetarian", "Vegan", "Gluten-Free"],
    estimatedCost: 300,
    ingredients: ["French Wine Grapes"],
    description: "Glass of house French wine (Bordeaux Red or Chardonnay White).",
    imageUrl: "/paris_coffee.png",
  },
];

/**
 * Seeds the MenuItem collection — updates/re-seeds with French Bistro menu items.
 */
export const seedMenuItems = async (): Promise<void> => {
  console.log("🍽️  Seeding French Bistro Menu catalog to MongoDB...");
  await MenuItemModel.deleteMany({});
  await MenuItemModel.insertMany(menuItemSeedData);
  console.log(`✓ Seeded ${menuItemSeedData.length} French Bistro menu items to MongoDB.`);
};
