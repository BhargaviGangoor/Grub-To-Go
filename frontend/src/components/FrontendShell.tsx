"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  ChefHat,
  Home,
  LayoutDashboard,
  LogIn,
  MenuSquare,
  Sparkles,
  ShieldCheck,
  UserPlus,
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
  {
    title: "Spicy Cream Paneer Udon",
    ingredients: ["Paneer", "Udon Noodles", "Heavy Cream"],
    cost: 230,
    prepTime: "15 mins",
    calories: 640,
    description:
      "A rich, bowl-first comfort dish built for users who want heat, protein, and a fast turnaround.",
    backdropImage: "/download.jpg",
    tags: ["spicy", "vegetarian", "high protein"],
  },
  {
    title: "Saffron Vegetable Biryani",
    ingredients: ["Basmati Rice", "Saffron", "Sage"],
    cost: 180,
    prepTime: "22 mins",
    calories: 510,
    description:
      "A lighter, aromatic option that fits vegetarian and vegan preferences with a strong Indian profile.",
    backdropImage: "/download4.jpg",
    tags: ["vegetarian", "vegan", "indian"],
  },
  {
    title: "Wild Mushroom Cream Bowl",
    ingredients: ["Mushrooms", "Heavy Cream", "Sage"],
    cost: 150,
    prepTime: "12 mins",
    calories: 430,
    description:
      "The default comfort recommendation when the user wants something warm, clean, and quick.",
    backdropImage: "/download3.jpg",
    tags: ["comfort", "vegetarian", "fast"],
  },
  {
    title: "Ginger Garlic Rice Bowl",
    ingredients: ["Basmati Rice", "Mushrooms", "Sage"],
    cost: 140,
    prepTime: "14 mins",
    calories: 390,
    description:
      "A budget-friendly fallback option tuned for people who want a low-friction menu item.",
    backdropImage: "/download2.jpg",
    tags: ["budget", "vegetarian", "simple"],
  },
];

function AppHeader({
  screen,
  authMode,
  onNavigate,
}: {
  screen: Screen;
  authMode: AuthMode;
  onNavigate: (screen: Screen) => void;
}) {
  const navItems: Array<{ label: string; screen: Screen; icon: typeof Home }> =
    [
      { label: "Home", screen: "home", icon: Home },
      { label: "Assistant", screen: "assistant", icon: ChefHat },
      { label: "Menu", screen: "menu", icon: MenuSquare },
      { label: "Dashboard", screen: "dashboard", icon: LayoutDashboard },
      { label: "Research", screen: "research", icon: BookOpen },
    ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#274629] bg-[#2c4a2f]/96 text-[#f4f1ea] shadow-[0_10px_35px_rgba(21,39,24,0.14)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e59b27] text-[#2c4a2f] shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold tracking-tight text-[#f4f1ea]">
              GrubToGo
            </div>
            <div className="text-xs font-mono text-[#f4f1ea]/75">
              Family-style dining assistant
            </div>
          </div>
        </div>

        <nav className="flex flex-wrap gap-2 lg:justify-center">
          {navItems.map((item) => {
            const active = screen === item.screen;
            const Icon = item.icon;
            return (
              <button
                key={item.screen}
                type="button"
                onClick={() => onNavigate(item.screen)}
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
                  active
                    ? "border-[#e59b27] bg-[#e59b27] text-[#2c4a2f] shadow-sm"
                    : "border-white/10 bg-white/5 text-[#f4f1ea] hover:border-[#e59b27]/30 hover:bg-white/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onNavigate("login")}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
              screen === "login"
                ? "border-[#e59b27] bg-[#e59b27] text-[#2c4a2f] shadow-sm"
                : "border-white/10 bg-white/5 text-[#f4f1ea] hover:border-[#e59b27]/40 hover:bg-white/10"
            }`}
          >
            <LogIn className="h-4 w-4" />
            <span>{authMode === "login" ? "Login" : "Continue"}</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate("register")}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
              screen === "register"
                ? "border-[#e59b27] bg-white text-[#2c4a2f]"
                : "border-white/10 bg-white/5 text-[#f4f1ea] hover:border-[#e59b27]/40 hover:bg-white/10"
            }`}
          >
            <UserPlus className="h-4 w-4" />
            <span>Register</span>
          </button>
        </div>
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
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1d3a2b]">
            Menu Explorer
          </h1>
          <p className="text-sm text-[#1d3a2b]/65">
            A browsable menu page with quick comparisons and recommendation
            cards.
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

      <div className="grid gap-6 lg:grid-cols-2">
        {menuCatalog.map((dish) => (
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
