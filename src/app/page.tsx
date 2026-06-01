"use client";

import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import PromptInput from "@/components/PromptInput";
import DietaryFilters from "@/components/DietaryFilters";
import BudgetInput from "@/components/BudgetInput";
import DishCard from "@/components/DishCard";
import DCTDisplay from "@/components/DCTDisplay";
import DriftEmulator from "@/components/DriftEmulator";
import RedemptionTerminal from "@/components/RedemptionTerminal";
import {
  SaigonCathedralDrawing,
  BenThanhMarketDrawing,
  OnePillarPagodaDrawing,
  PhoBowlSketch,
  DripCoffeeSketch,
  PaddlingBoatDrawing,
  BotanicalSprigDrawing
} from "@/components/BackgroundDrawings";

interface LogMessage {
  text: string;
  status: "pending" | "success" | "info";
  time: string;
}

export default function Home() {
  // ------------ Form States ------------
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>([]);
  const [budgetLimit, setBudgetLimit] = useState<number>(0);
  const [promptValue, setPromptValue] = useState("");
  
  // ------------ AI Generation States ------------
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [reasoningLogs, setReasoningLogs] = useState<LogMessage[]>([]);
  const [synthesizedDish, setSynthesizedDish] = useState<any>(null);
  const [commitmentToken, setCommitmentToken] = useState<string>("");

  // ------------ Redemption States ------------
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redemptionParams, setRedemptionParams] = useState<{
    simulatedPrice: number;
    simulatedInventory: string[];
    simulatedDietary: string[];
    securityMode: "standard" | "gb-dct";
  } | null>(null);

  // ------------ Preset Design Targets ------------
  const galleryItems = [
    {
      id: "udon",
      title: "Target I: Spicy Cream Paneer Udon",
      description: "Hand-pulled wheat noodles tossed in a fire-red chili cream emulsion with paneer.",
      image: "/download.jpg",
      prompt: "A rich, creamy stir-fried paneer Udon tossed in chili sauce with fresh chives"
    },
    {
      id: "ramen",
      title: "Target II: Signature Shoyu Ramen",
      description: "Soy-infused broth layered with chicken, soft egg, bok choy, and wheat noodles.",
      image: "/download2.jpg",
      prompt: "A hot, comforting bowl of Signature Shoyu Chicken Ramen with soft boiled egg"
    },
    {
      id: "mushroom",
      title: "Target III: Wild Forest Mushroom Soup",
      description: "Creamy soup of wild earthy mushrooms, fresh sage, sweet cream, and golden butter.",
      image: "/download3.jpg",
      prompt: "A rich velvet soup of wild forest brown-cap mushrooms and fresh herbs under 300 rupees"
    },
    {
      id: "saffron",
      title: "Target IV: Saffron Rice Bowl",
      description: "Fragrant basmati grains steamed with saffron and golden paneer cubes.",
      image: "/download4.jpg",
      prompt: "Fragrant saffron infused rice steamed with paneer pearls and mild organic spices"
    }
  ];

  const handleGallerySelect = (promptText: string) => {
    setPromptValue(promptText);
    const promptSection = document.getElementById("craving-section");
    if (promptSection) {
      promptSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const runAgentReasoningLoop = async (prompt: string) => {
    setIsSynthesizing(true);
    setSynthesizedDish(null);
    setCommitmentToken("");
    setIsRedeeming(false);
    setRedemptionParams(null);
    
    const logs: LogMessage[] = [
      { text: "Reading uploaded photo descriptors...", status: "pending", time: "0.2s" },
      { text: "Validating dietary rules...", status: "pending", time: "1.0s" },
      { text: "Auditing active kitchen stock snapshots...", status: "pending", time: "1.8s" },
      { text: "Confirming budget parameters...", status: "pending", time: "2.6s" },
      { text: "Compiling ingredient measurements...", status: "pending", time: "3.4s" },
      { text: "Signing secure dining lease token...", status: "pending", time: "4.2s" }
    ];

    setReasoningLogs([]);

    for (let i = 0; i < logs.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setReasoningLogs((prev) => {
        const updated = [...prev];
        if (i > 0) updated[i - 1].status = "success";
        updated.push(logs[i]);
        return updated;
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
    setReasoningLogs((prev) => {
      const updated = [...prev];
      updated[updated.length - 1].status = "success";
      return updated;
    });

    const lowerPrompt = prompt.toLowerCase();
    let selectedImage = "/download.jpg";
    let customTitle = "Spicy Creamy Paneer Udon Bowl";
    let customIngredients = ["Hand-pulled Udon Noodles", "Fresh Paneer Cubes", "Spicy Cream Emulsion", "Green Chives", "Chili Paste"];
    let customDescription = "A custom culinary target formulated by our dining logic, verified against inventory stock and budget parameters.";

    if (lowerPrompt.includes("ramen") || lowerPrompt.includes("chicken") || lowerPrompt.includes("shoyu")) {
      selectedImage = "/download2.jpg";
      customTitle = "Signature Shoyu Chicken Ramen";
      customIngredients = ["Wheat Ramen Noodles", "Soy-marinated Chicken", "Chili Oil Crunch", "Soft-boiled Egg", "Bok Choy"];
      customDescription = "A hot, comforting bowl of soy-chicken broth layered with tender chicken slices, soft egg, fresh bok choy, and wheat noodles.";
    } else if (lowerPrompt.includes("mushroom") || lowerPrompt.includes("soup") || lowerPrompt.includes("velvet") || lowerPrompt.includes("forest")) {
      selectedImage = "/download3.jpg";
      customTitle = "Earthy Wild Forest Mushroom Soup";
      customIngredients = ["Brown-cap Mushrooms", "Fresh Sage Leaves", "Sweet Heavy Cream", "Clarified Butter", "Green Scallions"];
      customDescription = "A rich soup composed of slow-simmered forest brown-cap mushrooms, fresh garden sage, heavy cream, and butter.";
    } else if (lowerPrompt.includes("rice") || lowerPrompt.includes("saffron") || lowerPrompt.includes("pearls")) {
      selectedImage = "/download4.jpg";
      customTitle = "Organic Saffron Steamed Rice with Paneer";
      customIngredients = ["High-mountain Basmati Rice", "Organic Saffron Filaments", "Lightly Fried Paneer Pearls", "Cardamom", "Mild Spices"];
      customDescription = "Fragrant basmati rice grains steamed with organic saffron, tossed gently with lightly fried paneer pearls and mild aromatic spices.";
    }

    const activeBudget = budgetLimit > 0 ? budgetLimit : 300;
    const finalCost = Math.min(Math.max(activeBudget - 30, 120), 450);

    setSynthesizedDish({
      title: customTitle,
      ingredients: customIngredients,
      cost: finalCost,
      prepTime: "16 mins",
      calories: 510,
      description: customDescription,
      backdropImage: selectedImage
    });
    
    const randId = Math.random().toString(36).substring(2, 6).toUpperCase();
    setCommitmentToken(`GB-DCT-2026-${randId}`);
    setIsSynthesizing(false);
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      {/* Hand-drawn Background Sketches scattered all over */}
      <PhoBowlSketch />
      <SaigonCathedralDrawing />
      <OnePillarPagodaDrawing />
      <DripCoffeeSketch />
      <PaddlingBoatDrawing />
      
      {/* Botanical Sprigs scattered for leafy detail */}
      <BotanicalSprigDrawing className="absolute left-6 top-[550px] w-24 h-24 hidden lg:block" />
      <BotanicalSprigDrawing className="absolute right-12 top-[1250px] w-32 h-32 rotate-45 hidden lg:block" />
      <BotanicalSprigDrawing className="absolute left-10 top-[1800px] w-28 h-28 -rotate-12 hidden lg:block" />
      
      {/* Dynamic Navigation Bar (Mr. Spring & Mrs. Fresh style) */}
      <nav className="bg-brand sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex justify-between items-center">
          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <span className="text-white text-lg font-black tracking-tight flex items-center gap-1.5 font-heading">
              🍜 Mr. Grub & Mrs. Go
            </span>
          </div>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="menu-link text-[#e59b27]">Home</a>
            <a href="#featured" className="menu-link">Story</a>
            <a href="#featured" className="menu-link">Food</a>
            <a href="#sandbox" className="menu-link">Security Desk</a>
            <a href="#contact" className="menu-link">Contact</a>
          </div>

          {/* Ticket button "ORDER NOW" style */}
          <div>
            <a
              href="#sandbox"
              className="bg-brand-orange hover:bg-brand-orangelight text-white font-black text-xs px-5 py-2.5 rounded-sm shadow-sm transition-all duration-200 tracking-wider inline-block uppercase border-t border-b border-dashed border-white/30"
            >
              Order Now
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative w-full h-[520px] flex items-center justify-center overflow-hidden border-b-4 border-brand-orange bg-zinc-900">
        {/* Banner image background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/download2.jpg"
          alt="Kitchen Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-[0.7] sepia-[0.1]"
        />
        
        {/* Green gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand/90 via-brand/40 to-transparent"></div>

        {/* Bến Thành Clock Tower sketch inside Hero */}
        <BenThanhMarketDrawing stroke="#ffffff" className="opacity-[0.22] right-8 top-[30px] !block" />

        {/* Content Box */}
        <div className="relative z-10 text-center max-w-4xl px-4 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-brand/50 text-[#e59b27] text-[10px] font-bold uppercase tracking-widest mb-6">
            🔒 Cryptographically Verified Kitchen
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6.5xl font-black tracking-tight leading-none text-white outlined-text mb-4 font-heading">
            Family Flavours, Securely Fired
          </h1>
          <p className="text-[#f4f1ea] font-medium max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed mb-8 drop-shadow-md">
            Savour hand-pulled wheat ribbons and slow-simmered broths generated specifically to your dietary constraints, with inventory allocations locked by Generation-Bound Decentralized Capability Tokens (GB-DCT).
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#featured"
              className="bg-white/10 hover:bg-white/20 border border-white text-white font-bold text-xs uppercase px-8 py-3 rounded-full transition-all"
            >
              Explore Our Menu
            </a>
            <a
              href="#sandbox"
              className="bg-brand-orange hover:bg-brand-orangelight text-white font-bold text-xs uppercase px-8 py-3 rounded-full transition-all shadow-md"
            >
              Configure Dining Lease
            </a>
          </div>
        </div>
      </header>

      {/* Preset Targets (Featured Items) */}
      <section id="featured" className="max-w-7xl mx-auto px-4 md:px-8 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-brand tracking-tight font-heading">
            Authentic Flavours Made Fresh Daily!
          </h2>
          <p className="text-zinc-500 text-xs font-semibold mt-1">
            Select one of our signature preset creations to load into the verification sandbox.
          </p>
        </div>

        {/* Stamps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleGallerySelect(item.prompt)}
              className="stamp-card cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 relative group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full rounded-md overflow-hidden mb-3 border border-zinc-150">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-brand/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-[10px] text-white uppercase tracking-widest font-black bg-brand-orange px-3.5 py-1.5 rounded-full shadow-md">
                      Load recipe
                    </span>
                  </div>
                </div>
                <h3 className="text-xs font-bold text-brand mb-1 font-heading">{item.title}</h3>
                <p className="text-[10px] text-zinc-500 leading-relaxed font-semibold italic">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sandbox Workspace (Attestation Desk) */}
      <section id="sandbox" className="bg-brand-creamdarks border-t-2 border-b-2 border-brand/5 py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="text-center mb-10">
            <span className="text-[#e59b27] text-xs font-black uppercase tracking-widest">
              Live Lease Sandbox
            </span>
            <h2 className="text-2xl font-black text-brand tracking-tight font-heading mt-1">
              Verify Your Order Specifications
            </h2>
            <p className="text-zinc-500 text-xs font-semibold mt-1 max-w-xl mx-auto">
              Simulate price increases, supplier changes, or item shortages in the temporal gap between order placement and kitchen execution.
            </p>
          </div>

          {/* Two-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Configure Inputs (5 spans) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              <ImageUpload onImagesChange={setSelectedImages} />

              <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm flex flex-col gap-5">
                <DietaryFilters onChange={setDietaryPrefs} />
                <BudgetInput onChange={setBudgetLimit} />
              </div>

              <div id="craving-section">
                <PromptInput
                  onSubmit={runAgentReasoningLoop}
                  isLoading={isSynthesizing}
                  value={promptValue}
                  onChange={setPromptValue}
                />
              </div>

            </div>

            {/* Right Column: Execution Console (7 spans) */}
            <div className="lg:col-span-7 flex flex-col gap-6 min-h-[550px]">
              
              {/* Reasoning terminal spinner */}
              {isSynthesizing && (
                <div className="w-full">
                  <h2 className="text-xs font-bold text-brand/80 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-pulse"></span>
                    Verification Stream
                  </h2>
                  <div className="receipt-paper rounded-2xl p-5 font-mono text-[11px] text-[#2c1e15] leading-relaxed shadow-md">
                    <div className="flex justify-between items-center border-b border-dashed border-zinc-300 pb-3 mb-4">
                      <span className="text-brand font-bold uppercase tracking-wider flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
                        </span>
                        Active validation check...
                      </span>
                      <span className="text-zinc-400 font-semibold">stream.log</span>
                    </div>
                    
                    <div className="flex flex-col gap-2.5">
                      {reasoningLogs.map((log, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 animate-fade-in font-medium">
                          <span className="text-zinc-400">[{log.time}]</span>
                          <span className="flex-1 text-[#2c1e15]">{log.text}</span>
                          <span className={`text-[8px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${
                            log.status === "success" 
                              ? "bg-emerald-50 border-emerald-300 text-emerald-700" 
                              : "bg-amber-100/30 border-amber-300 text-amber-600 animate-pulse"
                          }`}>
                            {log.status === "success" ? "✓ ok" : "⚡ run"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic verified dish outcome */}
              {synthesizedDish && commitmentToken ? (
                <div className="flex flex-col gap-6 animate-fade-in">
                  <DishCard {...synthesizedDish} />
                  
                  <DCTDisplay token={commitmentToken} expiresIn={1200} />

                  <DriftEmulator
                    originalCost={synthesizedDish.cost}
                    originalIngredients={synthesizedDish.ingredients}
                    budgetLimit={budgetLimit}
                    onRedeem={(params) => {
                      setRedemptionParams(params);
                      setIsRedeeming(true);
                    }}
                    isRedeeming={isRedeeming}
                  />

                  {redemptionParams && (
                    <RedemptionTerminal
                      token={commitmentToken}
                      securityMode={redemptionParams.securityMode}
                      simulatedPrice={redemptionParams.simulatedPrice}
                      simulatedInventory={redemptionParams.simulatedInventory}
                      simulatedDietary={redemptionParams.simulatedDietary}
                      originalCost={synthesizedDish.cost}
                      originalIngredients={synthesizedDish.ingredients}
                      budgetLimit={budgetLimit}
                      isRedeeming={isRedeeming}
                      onFinished={() => setIsRedeeming(false)}
                    />
                  )}
                </div>
              ) : (
                /* Idle state placeholder */
                !isSynthesizing && (
                  <div className="w-full flex-1 flex flex-col items-center justify-center border border-dashed border-zinc-300 bg-white rounded-3xl p-10 text-center animate-fade-in min-h-[480px]">
                    <div className="w-16 h-16 rounded-full bg-brand/5 flex items-center justify-center mb-5 border border-zinc-150">
                      <svg className="w-8 h-8 text-brand/45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-bold text-brand uppercase tracking-widest mb-1.5">
                      No Active Lease Loaded
                    </h3>
                    <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed font-semibold">
                      Select one of our signature preset target dishes from the menu above, or type in a custom recipe craving, then click <strong>Execute Dish Generation</strong> to begin verification checks.
                    </p>
                  </div>
                )
              )}

            </div>
          </div>
        </div>
      </section>

      {/* Footer Block */}
      <footer id="contact" className="bg-brand text-white/90 border-t-4 border-brand-orange py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-base font-black tracking-tight font-heading">
              🍜 Mr. Grub & Mrs. Go
            </span>
            <p className="text-xs text-white/60 mt-1 max-w-xs leading-relaxed font-semibold">
              Delivering secure, cryptographically attested meals using Generation-Bound Capability Tokens.
            </p>
          </div>
          <div className="flex gap-6 text-xs uppercase font-bold">
            <a href="#" className="hover:text-brand-orange transition-colors">Privacy</a>
            <a href="#" className="hover:text-brand-orange transition-colors">Terms</a>
            <a href="#" className="hover:text-brand-orange transition-colors">Security Details</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
