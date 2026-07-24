"use client";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import LandingView from "@/components/landing/LandingView";
import GenerateView from "@/components/GenerateView";
import ArtifactView from "@/components/ArtifactView";
import DCTDetailsView from "@/components/DCTDetailsView";
import RedemptionView from "@/components/RedemptionView";
import ResearchDashboardView from "@/components/ResearchDashboardView";
import PromptInput from "@/components/PromptInput";
import ImageUpload from "@/components/ImageUpload";
import BudgetInput from "@/components/BudgetInput";
import DietaryFilters from "@/components/DietaryFilters";
import DishCard from "@/components/DishCard";
import AppBackdrop from "@/components/AppBackdrop";
import { AgentGhostOverlay } from "@/components/AgentGhostOverlay";

type Screen =
  | "home"
  | "assistant"
  | "menu"
  | "dashboard"
  | "login"
  | "register"
  | "research"
  | "advanced"
  | "artifact"
  | "token"
  | "redemption";

type AuthMode = "login" | "register";

type MenuItem = {
  title: string;
  ingredients: string[];
  cost: number;
  prepTime: string;
  calories: number;
  description: string;
  backdropImage?: string;
  tags: string[];
};

const menuCatalog: MenuItem[] = [
  // 🥐 Viennoiseries
  {
    title: "Croissant",
    ingredients: ["Flour", "Butter", "Yeast"],
    cost: 120,
    prepTime: "5 mins",
    calories: 260,
    description: "Buttery, flaky classic French breakfast pastry freshly baked daily.",
    backdropImage: "/paris_croissant.png",
    tags: ["pastries", "breakfast", "vegetarian", "classic"],
  },
  {
    title: "Pain au Chocolat",
    ingredients: ["Flour", "Butter", "Chocolate"],
    cost: 150,
    prepTime: "5 mins",
    calories: 320,
    description: "Flaky puff pastry baked with two batons of rich dark French chocolate.",
    backdropImage: "/paris_croissant.png",
    tags: ["pastries", "chocolate", "vegetarian", "sweet"],
  },
  {
    title: "Pain aux Raisins",
    ingredients: ["Flour", "Butter", "Custard", "Raisins"],
    cost: 160,
    prepTime: "5 mins",
    calories: 310,
    description: "Golden spiral puff pastry filled with vanilla creme patissiere & raisins.",
    backdropImage: "/macarons.jpg",
    tags: ["pastries", "custard", "vegetarian"],
  },
  {
    title: "Brioche",
    ingredients: ["Flour", "Butter", "Eggs", "Sugar"],
    cost: 140,
    prepTime: "5 mins",
    calories: 280,
    description: "Soft, golden, sweet French brioche loaf slice baked with farm butter.",
    backdropImage: "/paris_croissant.png",
    tags: ["pastries", "sweet", "vegetarian"],
  },
  {
    title: "Chausson aux Pommes",
    ingredients: ["Flour", "Butter", "Apples"],
    cost: 170,
    prepTime: "6 mins",
    calories: 290,
    description: "Crispy turnover filled with slow-caramelized French apple compote.",
    backdropImage: "/download3.jpg",
    tags: ["pastries", "apple", "vegetarian", "vegan"],
  },

  // 🍞 Tartines & Light Plates
  {
    title: "Tartine Beurre et Confiture",
    ingredients: ["Baguette", "Butter", "Strawberry Jam"],
    cost: 130,
    prepTime: "8 mins",
    calories: 290,
    description: "Crusty French baguette slice with Beurre d'Isigny & artisan strawberry jam.",
    backdropImage: "/frenchme.jpg",
    tags: ["tartines", "breakfast", "vegetarian"],
  },
  {
    title: "Tartine au Fromage",
    ingredients: ["Baguette", "Cheese Spread", "Herbs"],
    cost: 180,
    prepTime: "8 mins",
    calories: 340,
    description: "Toasted baguette topped with garlic-herb whipped cream cheese spread.",
    backdropImage: "/frenchme.jpg",
    tags: ["tartines", "cheese", "vegetarian"],
  },
  {
    title: "Assiette de Fromages",
    ingredients: ["Brie", "Camembert", "Baguette"],
    cost: 320,
    prepTime: "10 mins",
    calories: 520,
    description: "Selection of aged Brie, Camembert & Roquefort served with baguette.",
    backdropImage: "/frenchme.jpg",
    tags: ["tartines", "cheese", "gluten-free"],
  },
  {
    title: "Assiette de Charcuterie",
    ingredients: ["Cold Cuts", "Cornichons", "Baguette"],
    cost: 350,
    prepTime: "10 mins",
    calories: 580,
    description: "Assorted cured meats, saucisson sec, cornichons pickles & rustic sourdough.",
    backdropImage: "/frenchme.jpg",
    tags: ["tartines", "charcuterie", "savory"],
  },

  // 🥗 Salads & Savory Dishes
  {
    title: "Salade Niçoise",
    ingredients: ["Tuna", "Olives", "Eggs", "Green Beans"],
    cost: 280,
    prepTime: "12 mins",
    calories: 410,
    description: "Provençal salad with seared tuna, Niçoise olives, soft egg & green beans.",
    backdropImage: "/good-food.jpg",
    tags: ["salads", "tuna", "gluten-free"],
  },
  {
    title: "Salade de Chèvre Chaud",
    ingredients: ["Goat Cheese", "Greens", "Sourdough", "Honey"],
    cost: 260,
    prepTime: "12 mins",
    calories: 420,
    description: "Warm goat cheese melted on crostini served over honey-dressed greens.",
    backdropImage: "/good-food.jpg",
    tags: ["salads", "goat cheese", "vegetarian"],
  },
  {
    title: "Quiche Lorraine",
    ingredients: ["Eggs", "Cream", "Bacon", "Gruyère Cheese"],
    cost: 240,
    prepTime: "15 mins",
    calories: 490,
    description: "Classic French egg tart baked with smoky bacon lardons & melted Gruyère.",
    backdropImage: "/good-food.jpg",
    tags: ["salads", "quiche", "savory"],
  },
  {
    title: "Croque Monsieur",
    ingredients: ["Bread", "Ham", "Gruyère Cheese", "Bechamel"],
    cost: 270,
    prepTime: "12 mins",
    calories: 560,
    description: "Classic Parisian grilled ham & melted Gruyère sandwich with rich Béchamel.",
    backdropImage: "/frenchme.jpg",
    tags: ["salads", "sandwich", "savory"],
  },
  {
    title: "Croque Madame",
    ingredients: ["Bread", "Ham", "Gruyère Cheese", "Egg"],
    cost: 290,
    prepTime: "14 mins",
    calories: 610,
    description: "Croque Monsieur topped with a sunny-side-up fried farm egg.",
    backdropImage: "/frenchme.jpg",
    tags: ["salads", "sandwich", "egg"],
  },

  // 🍲 Soups & Warm Plates
  {
    title: "Soupe à l’Oignon Gratinée",
    ingredients: ["Onions", "Broth", "Baguette", "Gruyère Cheese"],
    cost: 250,
    prepTime: "18 mins",
    calories: 480,
    description: "Caramelized French onion soup topped with toasted baguette & broiled Gruyère.",
    backdropImage: "/french_soup.png",
    tags: ["soups", "onion soup", "warm", "cheese"],
  },
  {
    title: "Potage du Jour",
    ingredients: ["Seasonal Vegetables", "Butter", "Herbs"],
    cost: 190,
    prepTime: "12 mins",
    calories: 230,
    description: "Chef's daily seasonal vegetable soup served with warm French bread.",
    backdropImage: "/french_soup.png",
    tags: ["soups", "vegetable", "vegan", "gluten-free"],
  },
  {
    title: "Ratatouille",
    ingredients: ["Zucchini", "Eggplant", "Tomatoes", "Bell Peppers"],
    cost: 230,
    prepTime: "20 mins",
    calories: 310,
    description: "Slow-simmered Provençal vegetable stew with fresh thyme, garlic & olive oil.",
    backdropImage: "/french_soup.png",
    tags: ["soups", "provençal", "vegan", "gluten-free"],
  },

  // 🍰 Desserts
  {
    title: "Tarte Tatin",
    ingredients: ["Apples", "Butter", "Sugar", "Pastry Crust"],
    cost: 220,
    prepTime: "10 mins",
    calories: 390,
    description: "Caramelized upside-down apple tart served warm with creme fraiche.",
    backdropImage: "/macarons.jpg",
    tags: ["desserts", "apple", "caramel", "sweet"],
  },
  {
    title: "Crème Brûlée",
    ingredients: ["Heavy Cream", "Egg Yolks", "Sugar", "Vanilla"],
    cost: 200,
    prepTime: "10 mins",
    calories: 380,
    description: "Rich Tahitian vanilla bean custard topped with hard burnt caramel crust.",
    backdropImage: "/macarons.jpg",
    tags: ["desserts", "custard", "vanilla", "gluten-free"],
  },
  {
    title: "Mousse au Chocolat",
    ingredients: ["Dark Chocolate", "Cream", "Eggs", "Sugar"],
    cost: 180,
    prepTime: "5 mins",
    calories: 340,
    description: "Decadent, airy dark Valrhona chocolate mousse with whipped cream.",
    backdropImage: "/macarons.jpg",
    tags: ["desserts", "chocolate", "mousse", "gluten-free"],
  },
  {
    title: "Madeleines",
    ingredients: ["Flour", "Butter", "Sugar", "Lemon Zest"],
    cost: 130,
    prepTime: "5 mins",
    calories: 220,
    description: "Freshly baked shell-shaped sponge cakes dusted with lemon zest & powder sugar.",
    backdropImage: "/macarons.jpg",
    tags: ["desserts", "lemon", "cake", "sweet"],
  },
  {
    title: "Éclair au Café/Chocolat",
    ingredients: ["Choux Pastry", "Cream", "Chocolate", "Coffee"],
    cost: 160,
    prepTime: "5 mins",
    calories: 310,
    description: "Choux pastry filled with silky coffee or chocolate cream & dark cocoa glaze.",
    backdropImage: "/paris_macarons.png",
    tags: ["desserts", "eclair", "pastry"],
  },

  // ☕ Beverages
  {
    title: "Café au Lait",
    ingredients: ["Espresso", "Steamed Milk"],
    cost: 110,
    prepTime: "4 mins",
    calories: 120,
    description: "Classic Parisian dark roast coffee served with rich steamed milk.",
    backdropImage: "/paris_coffee.png",
    tags: ["beverages", "coffee", "milk"],
  },
  {
    title: "Espresso",
    ingredients: ["Espresso Beans", "Water"],
    cost: 90,
    prepTime: "2 mins",
    calories: 5,
    description: "Short, intense shot of dark roasted arabica coffee with golden crema.",
    backdropImage: "/paris_coffee.png",
    tags: ["beverages", "coffee", "vegan", "gluten-free"],
  },
  {
    title: "Chocolat Chaud",
    ingredients: ["Dark Chocolate", "Milk", "Heavy Cream"],
    cost: 150,
    prepTime: "6 mins",
    calories: 290,
    description: "Thick Parisian melted dark chocolate drink topped with Chantilly cream.",
    backdropImage: "/paris_coffee.png",
    tags: ["beverages", "hot chocolate", "sweet"],
  },
  {
    title: "Thé",
    ingredients: ["Tea Leaves", "Hot Water"],
    cost: 100,
    prepTime: "3 mins",
    calories: 0,
    description: "Selection of loose-leaf Earl Grey, Chamomile, or Jasmine teas.",
    backdropImage: "/paris_coffee.png",
    tags: ["beverages", "tea", "vegan", "gluten-free"],
  },
  {
    title: "Jus d’Orange Pressé",
    ingredients: ["Fresh Oranges"],
    cost: 120,
    prepTime: "4 mins",
    calories: 110,
    description: "100% freshly squeezed Valencia orange juice served chilled.",
    backdropImage: "/paris_coffee.png",
    tags: ["beverages", "juice", "vegan", "fresh"],
  },
  {
    title: "Vin Maison",
    ingredients: ["French Wine Grapes"],
    cost: 300,
    prepTime: "2 mins",
    calories: 125,
    description: "Glass of house French wine (Bordeaux Red or Chardonnay White).",
    backdropImage: "/paris_coffee.png",
    tags: ["beverages", "wine", "alcohol", "vegan"],
  },
];

function AppHeader({
  screen,
  onNavigate,
}: {
  screen: Screen;
  authMode: AuthMode;
  onNavigate: (screen: Screen) => void;
}) {
  const navItems: Array<{ label: string; screen: Screen }> = [
    { label: "HOME", screen: "home" },
    { label: "ASSISTANT", screen: "assistant" },
    { label: "MENU", screen: "menu" },
    { label: "DASHBOARD", screen: "dashboard" },
    { label: "RESEARCH", screen: "research" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#2c4a2f] text-[#f4f1ea] shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-0">
        {/* ── Logo ── */}
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2.5 py-3 transition-opacity hover:opacity-85"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e59b27]/20">
            <Sparkles className="h-4 w-4 text-[#e59b27]" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-[#f4f1ea]">
            GrubToGo
          </span>
        </button>

        {/* ── Navigation links ── */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = screen === item.screen;
            return (
              <button
                key={item.screen}
                type="button"
                onClick={() => onNavigate(item.screen)}
                className={`relative px-4 py-4 text-[13px] font-semibold tracking-[0.08em] transition-colors ${
                  active
                    ? "text-[#f4f1ea]"
                    : "text-[#f4f1ea]/65 hover:text-[#f4f1ea]"
                }`}
              >
                {item.label}
                {/* Active underline indicator */}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-[#e59b27]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* ── CTA Button (stamp/ticket style) ── */}
        <button
          type="button"
          onClick={() => onNavigate("assistant")}
          className="bg-[#e59b27] px-4 py-2 text-[13px] font-extrabold tracking-[0.06em] text-[#1d3a2b] border-2 border-dashed border-[#1d3a2b]/40 rounded-sm transition-all hover:bg-[#d9911f] active:scale-[0.97]"
        >
          ORDER NOW
        </button>
      </div>

      {/* ── Mobile nav (hamburger-free, scrollable row) ── */}
      <div className="flex items-center gap-2 overflow-x-auto border-t border-white/10 px-4 py-2 md:hidden">
        <button
          type="button"
          onClick={() => onNavigate("assistant")}
          className="shrink-0 bg-[#e59b27] px-3 py-1.5 text-[11px] font-extrabold tracking-[0.06em] text-[#1d3a2b] border-2 border-dashed border-[#1d3a2b]/40 rounded-sm transition-all hover:bg-[#d9911f] active:scale-[0.97]"
        >
          ORDER NOW
        </button>
        {navItems.map((item) => {
          const active = screen === item.screen;
          return (
            <button
              key={item.screen}
              type="button"
              onClick={() => onNavigate(item.screen)}
              className={`shrink-0 whitespace-nowrap px-3 py-2 text-[11px] font-semibold tracking-[0.08em] transition-colors ${
                active
                  ? "border-b-2 border-[#e59b27] text-[#f4f1ea]"
                  : "text-[#f4f1ea]/55 hover:text-[#f4f1ea]"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}

function ChatBubble({
  role,
  text,
}: {
  role: "user" | "assistant";
  text: string;
}) {
  return (
    <div
      className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          role === "user"
            ? "bg-[#1d3a2b] text-[#f4f1ea]"
            : "border border-[#e9e5da] bg-white text-[#1d3a2b]"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

function AssistantWorkspace({
  onNavigate,
}: {
  onNavigate: (screen: Screen) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [budget, setBudget] = useState(300);
  const [dietary, setDietary] = useState<string[]>([]);
  const [referenceImages, setReferenceImages] = useState<File[]>([]);
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; text: string }>
  >([
    {
      role: "assistant",
      text: "Tell me what you want to eat, and I’ll narrow the menu down to a concrete recommendation.",
    },
  ]);
  const [recommendation, setRecommendation] = useState<MenuItem>(
    menuCatalog[0],
  );

  const buildRecommendation = (text: string) => {
    const lower = text.toLowerCase();

    const pick = menuCatalog.find((item) => {
      const matchesBudget = item.cost <= budget;
      const matchesSpicy = lower.includes("spicy")
        ? item.tags.includes("spicy")
        : true;
      const matchesVegan =
        lower.includes("vegan") || dietary.includes("Vegan")
          ? item.tags.includes("vegan")
          : true;
      const matchesVegetarian =
        lower.includes("vegetarian") || dietary.includes("Vegetarian")
          ? item.tags.includes("vegetarian")
          : true;
      return matchesBudget && matchesSpicy && matchesVegan && matchesVegetarian;
    });

    const selected =
      pick || menuCatalog.find((item) => item.cost <= budget) || menuCatalog[0];
    const imageNote =
      referenceImages.length > 0
        ? ` I also considered ${referenceImages.length} reference image(s).`
        : "";
    const dietaryNote =
      dietary.length > 0
        ? ` Dietary filters applied: ${dietary.join(", ")}.`
        : "";

    return {
      dish: selected,
      reply: `I’d recommend ${selected.title} at ₹${selected.cost}. It fits your current budget and should land in about ${selected.prepTime}.${dietaryNote}${imageNote}`,
    };
  };

  const handleSubmit = (text: string) => {
    const userText = text.trim();
    if (!userText) return;

    const { dish, reply } = buildRecommendation(userText);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: userText },
      { role: "assistant", text: reply },
    ]);
    setRecommendation(dish);
    setPrompt("");
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 space-y-8">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-3xl border border-[#e9e5da] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-[#f4f1ea] pb-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#1d3a2b]">
                Dining Assistant
              </h1>
              <p className="text-sm text-[#1d3a2b]/65">
                Phase 1 chat interface for natural language ordering.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("advanced")}
              className="inline-flex items-center gap-2 rounded-full bg-[#1d3a2b] px-4 py-2 text-sm font-semibold text-[#f4f1ea] transition hover:bg-[#14281e]"
            >
              Open advanced generator
              <ArrowRight className="h-4 w-4 text-[#e59b27]" />
            </button>
          </div>

          <div className="mt-5 space-y-3 rounded-2xl bg-[#fffdf9] p-4">
            {messages.map((message, index) => (
              <ChatBubble
                key={`${message.role}-${index}`}
                role={message.role}
                text={message.text}
              />
            ))}
          </div>

          <PromptInput
            value={prompt}
            onChange={setPrompt}
            onSubmit={handleSubmit}
            isLoading={false}
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-[#e9e5da] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold text-[#1d3a2b]">
              <Sparkles className="h-4 w-4 text-[#e59b27]" />
              Recommendation Controls
            </div>
            <div className="mt-4 space-y-5">
              <ImageUpload
                onImagesChange={(files) => setReferenceImages(files)}
              />
              <BudgetInput onChange={setBudget} />
              <DietaryFilters onChange={setDietary} />
            </div>
          </div>

          <div className="rounded-3xl border border-[#e9e5da] bg-[#1d3a2b] p-5 text-[#f4f1ea] shadow-sm">
            <div className="text-xs font-mono uppercase tracking-wider text-[#e59b27]">
              Current Session
            </div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-[#f4f1ea]/70">Budget</span>
                <span className="font-semibold">₹{budget}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#f4f1ea]/70">Dietary filters</span>
                <span className="text-right font-semibold">
                  {dietary.length > 0 ? dietary.join(", ") : "None"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#f4f1ea]/70">Reference images</span>
                <span className="font-semibold">{referenceImages.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#1d3a2b]">
              Suggested dish
            </h2>
            <p className="text-sm text-[#1d3a2b]/65">
              A live recommendation card generated from the current session
              state.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("menu")}
            className="rounded-full border border-[#e9e5da] bg-white px-4 py-2 text-sm font-semibold text-[#1d3a2b] transition hover:border-[#1d3a2b]/30 hover:bg-[#fffdf9]"
          >
            Browse full menu
          </button>
        </div>

        <DishCard
          title={recommendation.title}
          ingredients={recommendation.ingredients}
          cost={recommendation.cost}
          prepTime={recommendation.prepTime}
          calories={recommendation.calories}
          description={recommendation.description}
          backdropImage={recommendation.backdropImage}
        />
      </div>
    </div>
  );
}

function MenuWorkspace({
  onNavigate,
}: {
  onNavigate: (screen: Screen) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Dishes (28)" },
    { id: "pastries", label: "🥐 Pastries (5)" },
    { id: "tartines", label: "🍞 Tartines (4)" },
    { id: "salads", label: "🥗 Salads & Savory (5)" },
    { id: "soups", label: "🍲 Soups & Warm (3)" },
    { id: "desserts", label: "🍰 Desserts (5)" },
    { id: "beverages", label: "☕ Beverages (6)" },
  ];

  const filteredDishes =
    selectedCategory === "all"
      ? menuCatalog
      : menuCatalog.filter((dish) => dish.tags.includes(selectedCategory));

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1d3a2b]">
            French Bistro Menu Explorer
          </h1>
          <p className="text-sm text-[#1d3a2b]/65">
            Browse our full authentic 28-dish Parisian café menu with live stock & pricing.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("assistant")}
          className="inline-flex items-center gap-2 rounded-full bg-[#1d3a2b] px-4 py-2 text-sm font-semibold text-[#f4f1ea] transition hover:bg-[#14281e]"
        >
          Ask the assistant
          <ArrowRight className="h-4 w-4 text-[#e59b27]" />
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#e9e5da]">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat.id
                ? "bg-[#1d3a2b] text-[#f4f1ea] shadow-xs"
                : "bg-white text-[#1d3a2b] border border-[#e9e5da] hover:bg-[#fffdf9]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {filteredDishes.map((dish) => (
          <DishCard key={dish.title} {...dish} />
        ))}
      </div>
    </div>
  );
}

function DashboardWorkspace({
  onNavigate,
}: {
  onNavigate: (screen: Screen) => void;
}) {
  const stats = [
    { label: "Saved preferences", value: "12" },
    { label: "Recent orders", value: "4" },
    { label: "Favorite cuisines", value: "Indian, Italian" },
    { label: "Active devices", value: "1" },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1d3a2b]">
            User Dashboard
          </h1>
          <p className="text-sm text-[#1d3a2b]/65">
            A lightweight customer dashboard for preferences, history, and next
            actions.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("login")}
          className="inline-flex items-center gap-2 rounded-full border border-[#e9e5da] bg-white px-4 py-2 text-sm font-semibold text-[#1d3a2b] transition hover:border-[#1d3a2b]/30 hover:bg-[#fffdf9]"
        >
          <ShieldCheck className="h-4 w-4 text-[#e59b27]" />
          Review account
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-3xl border border-[#e9e5da] bg-white p-5 shadow-sm"
          >
            <div className="text-xs font-mono uppercase tracking-wider text-[#1d3a2b]/55">
              {item.label}
            </div>
            <div className="mt-3 text-2xl font-extrabold text-[#1d3a2b]">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-3xl border border-[#e9e5da] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#1d3a2b]">Recent activity</h2>
          <div className="mt-4 space-y-3 text-sm text-[#1d3a2b]/75">
            <div className="rounded-2xl bg-[#fffdf9] p-4">
              Viewed the assistant and refined a spicy vegetarian dinner
              request.
            </div>
            <div className="rounded-2xl bg-[#fffdf9] p-4">
              Saved a saffron rice recommendation to the menu shortlist.
            </div>
            <div className="rounded-2xl bg-[#fffdf9] p-4">
              Opened the research lab for token and redemption traceability.
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[#e9e5da] bg-[#1d3a2b] p-6 text-[#f4f1ea] shadow-sm">
          <div className="text-xs font-mono uppercase tracking-wider text-[#e59b27]">
            Next Action
          </div>
          <h2 className="mt-2 text-2xl font-bold">Continue your order</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#f4f1ea]/75">
            Return to the assistant to refine constraints, compare menu options,
            or start an advanced generation flow.
          </p>
          <button
            type="button"
            onClick={() => onNavigate("assistant")}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#e59b27] px-4 py-2 text-sm font-semibold text-[#1d3a2b] transition hover:bg-[#d9911f]"
          >
            Open assistant
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AuthWorkspace({
  mode,
  onModeChange,
  onNavigate,
}: {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onNavigate: (screen: Screen) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onNavigate("dashboard");
  };

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-3xl border border-[#e9e5da] bg-[#1d3a2b] p-8 text-[#f4f1ea] shadow-sm">
        <div className="text-xs font-mono uppercase tracking-wider text-[#e59b27]">
          Authentication
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">
          Secure access for guests and returning diners
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[#f4f1ea]/75">
          The README calls for JWT authentication, user profiles, and protected
          routes. This is the first frontend layer for that flow.
        </p>

        <div className="mt-6 space-y-3 text-sm text-[#f4f1ea]/85">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            Register to save preferences, order history, and dietary rules.
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            Login to resume your current session and continue ordering.
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            Protected routes will later gate dashboard and checkout actions.
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-[#e9e5da] bg-white p-6 shadow-sm">
        <div className="flex gap-2 rounded-full bg-[#fffdf9] p-1">
          <button
            type="button"
            onClick={() => onModeChange("login")}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === "login"
                ? "bg-[#1d3a2b] text-[#f4f1ea]"
                : "text-[#1d3a2b]/70"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => onModeChange("register")}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === "register"
                ? "bg-[#1d3a2b] text-[#f4f1ea]"
                : "text-[#1d3a2b]/70"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "register" ? (
            <label className="block space-y-2 text-sm font-semibold text-[#1d3a2b]">
              Full name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-2xl border border-[#e9e5da] bg-[#fffdf9] px-4 py-3 text-[#1d3a2b] outline-none transition focus:border-[#1d3a2b]/30"
                placeholder="Your name"
              />
            </label>
          ) : null}

          <label className="block space-y-2 text-sm font-semibold text-[#1d3a2b]">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-[#e9e5da] bg-[#fffdf9] px-4 py-3 text-[#1d3a2b] outline-none transition focus:border-[#1d3a2b]/30"
              placeholder="you@example.com"
            />
          </label>

          <label className="block space-y-2 text-sm font-semibold text-[#1d3a2b]">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-[#e9e5da] bg-[#fffdf9] px-4 py-3 text-[#1d3a2b] outline-none transition focus:border-[#1d3a2b]/30"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1d3a2b] px-4 py-3 text-sm font-semibold text-[#f4f1ea] transition hover:bg-[#14281e]"
          >
            {mode === "login" ? "Login and continue" : "Create account"}
            <ArrowRight className="h-4 w-4 text-[#e59b27]" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function FrontendShell() {
  const [screen, setScreen] = useState<Screen>("home");
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const handleNavigate = (nextScreen: string) => {
    if (nextScreen === "login") {
      setAuthMode("login");
      setScreen("login");
      return;
    }

    if (nextScreen === "register") {
      setAuthMode("register");
      setScreen("register");
      return;
    }

    setScreen(nextScreen as Screen);
  };

  const renderScreen = () => {
    switch (screen) {
      case "home":
        return <LandingView onNavigate={handleNavigate} />;
      case "assistant":
        return <AssistantWorkspace onNavigate={handleNavigate} />;
      case "menu":
        return <MenuWorkspace onNavigate={handleNavigate} />;
      case "dashboard":
        return <DashboardWorkspace onNavigate={handleNavigate} />;
      case "login":
      case "register":
        return (
          <AuthWorkspace
            mode={authMode}
            onModeChange={setAuthMode}
            onNavigate={handleNavigate}
          />
        );
      case "research":
        return (
          <div className="mx-auto w-full max-w-7xl px-4 py-8 space-y-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-[#1d3a2b]">
                  Research Lab
                </h1>
                <p className="text-sm text-[#1d3a2b]/65">
                  Secondary security-focused surface for the commitment tooling.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleNavigate("advanced")}
                className="inline-flex items-center gap-2 rounded-full bg-[#1d3a2b] px-4 py-2 text-sm font-semibold text-[#f4f1ea] transition hover:bg-[#14281e]"
              >
                Open advanced generator
                <ArrowRight className="h-4 w-4 text-[#e59b27]" />
              </button>
            </div>
            <ResearchDashboardView />
          </div>
        );
      case "advanced":
        return (
          <div className="mx-auto w-full max-w-7xl px-4 py-8 space-y-4">
            <button
              type="button"
              onClick={() => setScreen("assistant")}
              className="rounded-full border border-[#e9e5da] bg-white/80 px-4 py-2 text-sm font-semibold text-[#1d3a2b] shadow-sm backdrop-blur transition hover:bg-white"
            >
              Back to assistant
            </button>
            <GenerateView onNavigate={handleNavigate} />
          </div>
        );
      case "artifact":
        return (
          <div className="mx-auto w-full max-w-7xl px-4 py-8 space-y-4">
            <button
              type="button"
              onClick={() => setScreen("advanced")}
              className="rounded-full border border-[#e9e5da] bg-white/80 px-4 py-2 text-sm font-semibold text-[#1d3a2b] shadow-sm backdrop-blur transition hover:bg-white"
            >
              Back to generator
            </button>
            <ArtifactView />
          </div>
        );
      case "token":
        return (
          <div className="mx-auto w-full max-w-7xl px-4 py-8 space-y-4">
            <button
              type="button"
              onClick={() => setScreen("advanced")}
              className="rounded-full border border-[#e9e5da] bg-white/80 px-4 py-2 text-sm font-semibold text-[#1d3a2b] shadow-sm backdrop-blur transition hover:bg-white"
            >
              Back to generator
            </button>
            <DCTDetailsView />
          </div>
        );
      case "redemption":
        return (
          <div className="mx-auto w-full max-w-7xl px-4 py-8 space-y-4">
            <button
              type="button"
              onClick={() => setScreen("advanced")}
              className="rounded-full border border-[#e9e5da] bg-white/80 px-4 py-2 text-sm font-semibold text-[#1d3a2b] shadow-sm backdrop-blur transition hover:bg-white"
            >
              Back to generator
            </button>
            <RedemptionView />
          </div>
        );
      default:
        return <LandingView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f4f1ea] text-[#1d3a2b]">
      <AgentGhostOverlay onNavigateScreen={handleNavigate} />
      <AppBackdrop screen={screen} />
      <div className="relative z-10">
        <AppHeader
          screen={screen}
          authMode={authMode}
          onNavigate={handleNavigate}
        />
        <motion.div
          key={screen}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {renderScreen()}
        </motion.div>
      </div>
    </div>
  );
}
