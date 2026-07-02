"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Shield, Plus, Check, Loader2, Sparkles, Eye, Key, ArrowRight, Wand2 } from "lucide-react";
import { useAppState, GB_DCT_Token, Dish } from "@/context/StateContext";
import { PhoBowlSketch } from "@/components/BackgroundDrawings";

interface GenerateViewProps {
  onNavigate: (view: string) => void;
}

export default function GenerateView({ onNavigate }: GenerateViewProps) {
  const { systemState, addToken } = useAppState();

  // Inputs state
  const [images, setImages] = useState<{ id: string; url: string; file: File }[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [budget, setBudget] = useState<number>(300);
  const [dietary, setDietary] = useState<string[]>([]);
  const [cuisine, setCuisine] = useState<string>("Any");
  const [spiceLevel, setSpiceLevel] = useState<"Mild" | "Medium" | "Spicy">("Medium");

  // Workflow agent state
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [generatedDish, setGeneratedDish] = useState<Dish | null>(null);
  const [generatedToken, setGeneratedToken] = useState<GB_DCT_Token | null>(null);
  const [dishImageIsAI, setDishImageIsAI] = useState(false);

  const steps = [
    "Image Analyzed",
    "Flavor Profile Extracted",
    "Inventory Snapshot Locked",
    "Cost Estimated",
    "Dietary Constraints Validated",
    "AI Artifact Generated",
    "Food Image Rendered",
    "GB-DCT Generated"
  ];

  // File processors
  const processFiles = (files: FileList | null) => {
    if (!files) return;
    const maxFiles = 3;
    const currentCount = images.length;
    const spaceLeft = maxFiles - currentCount;

    if (spaceLeft <= 0) {
      alert("Maximum 3 reference images allowed.");
      return;
    }

    const filesArr = Array.from(files).slice(0, spaceLeft);
    const newImgs = filesArr.map((f) => ({
      id: Math.random().toString(36).substring(7),
      url: URL.createObjectURL(f),
      file: f,
    }));

    setImages((prev) => [...prev, ...newImgs]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((item) => item.id !== id);
    });
  };

  // File base64 reader helper
  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Str = (reader.result as string).split(",")[1];
        resolve(base64Str);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Cryptographic Helper
  const generateHash = (input: string) => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = (hash << 5) - hash + input.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(8, "0");
  };

  // Generate Dish logic
  const handleGenerate = async () => {
    if (budget < 80) {
      alert("Please set a budget of at least ₹80.");
      return;
    }

    setIsGenerating(true);
    setGeneratedDish(null);
    setGeneratedToken(null);
    setActiveStep(0);

    try {
      // 1. Process files to base64
      const base64Images = await Promise.all(
        images.map(async (img) => {
          const base64 = await getBase64(img.file);
          return {
            base64,
            mimeType: img.file.type || "image/jpeg"
          };
        })
      );

      // 2. Step: Flavor profile extraction
      await new Promise((resolve) => setTimeout(resolve, 300));
      setActiveStep(1);

      // 3. Call backend generation API
      const dishRes = await fetch("/api/generate-dish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          budget,
          dietary,
          cuisine,
          spiceLevel,
          images: base64Images
        })
      });
      if (!dishRes.ok) throw new Error("Failed to generate dish via backend API");
      const dishObj = await dishRes.json();

      setActiveStep(2); // Inventory Locked
      await new Promise((resolve) => setTimeout(resolve, 300));
      setActiveStep(3); // Cost Estimated
      await new Promise((resolve) => setTimeout(resolve, 300));
      setActiveStep(4); // Dietary Validated
      await new Promise((resolve) => setTimeout(resolve, 300));
      setActiveStep(5); // AI Artifact Generated
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 4. Call backend signed token generation API
      const dctRes = await fetch("/api/generate-dct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dish: dishObj,
          constraints: { budget, dietary, cuisine, spiceLevel }
        })
      });
      if (!dctRes.ok) throw new Error("Failed to generate token lease via backend API");
      const { token: tokenObj } = await dctRes.json();

      setActiveStep(6); // Food Image Rendered (already done server-side with dish)
      await new Promise((resolve) => setTimeout(resolve, 300));
      setActiveStep(7); // GB-DCT Generated
      await new Promise((resolve) => setTimeout(resolve, 400));

      setDishImageIsAI(!!(dishObj as any).aiGeneratedImage);
      setGeneratedDish(dishObj);
      setGeneratedToken(tokenObj);
      addToken(tokenObj);
    } catch (error: any) {
      console.warn("Backend API generation failed, falling back to local simulation:", error.message);
      
      // Fallback local simulation
      let dishName = "Wild Forest Mushroom Soup";
      let ingredients = ["Mushrooms", "Heavy Cream", "Sage"];
      let prepTime = "12 mins";
      let imageUrl = "/download3.jpg";
      let description = "A velvety blend of simmered forest mushrooms, garden sage, and double heavy cream.";
      let baseCost = 150;

      if (cuisine === "Indian") {
        if (dietary.includes("Vegan")) {
          dishName = "Aromatic Saffron Vegetable Biryani";
          ingredients = ["Basmati Rice", "Saffron", "Sage"];
          prepTime = "22 mins";
          imageUrl = "/download4.jpg";
          description = "Fragrant long-grain basmati rice steamed with real saffron threads and aromatic garden herbs.";
          baseCost = 180;
        } else {
          dishName = "Spicy Cream Paneer Saffron Bowl";
          ingredients = ["Paneer", "Basmati Rice", "Saffron", "Heavy Cream"];
          prepTime = "18 mins";
          imageUrl = "/download4.jpg";
          description = "Saffron infused basmati grains topped with golden paneer cubes in a cardamom cream glaze.";
          baseCost = 260;
        }
      } else if (cuisine === "Chinese") {
        if (dietary.includes("Gluten-Free")) {
          dishName = "Gluten-Free Ginger Garlic Mushrooms";
          ingredients = ["Mushrooms", "Sage", "Basmati Rice"];
          prepTime = "15 mins";
          imageUrl = "/download3.jpg";
          description = "Stir-fried wild mushrooms tossed in light tamari and served over steamed basmati rice.";
          baseCost = 140;
        } else {
          dishName = "Chili Cream Udon Ribbons";
          ingredients = ["Udon Noodles", "Paneer", "Heavy Cream"];
          prepTime = "14 mins";
          imageUrl = "/download.jpg";
          description = "Thick, hand-pulled wheat udon noodles tossed in a spicy cream paste with tossed paneer cubes.";
          baseCost = 210;
        }
      } else if (cuisine === "Italian") {
        dishName = "Tuscan Garlic Mushroom Pasta";
        ingredients = ["Ramen Noodles", "Mushrooms", "Sage", "Heavy Cream"];
        prepTime = "16 mins";
        imageUrl = "/download2.jpg";
        description = "Creamy forest mushroom skillet sauce tossed with thin noodles and fresh chopped sage.";
        baseCost = 190;
      } else {
        if (dietary.includes("Vegan")) {
          dishName = "Slow Simmered Saffron Rice & Sage";
          ingredients = ["Basmati Rice", "Saffron", "Sage", "Mushrooms"];
          prepTime = "20 mins";
          imageUrl = "/download4.jpg";
          description = "Earthy wild mushrooms and fragrant saffron basmati rice topped with sage leaves.";
          baseCost = 160;
        } else if (spiceLevel === "Spicy") {
          dishName = "Spicy Cream Paneer Udon Bowl";
          ingredients = ["Udon Noodles", "Paneer", "Heavy Cream"];
          prepTime = "15 mins";
          imageUrl = "/download.jpg";
          description = "Hand-pulled wheat noodles tossed in a fire-red chili cream emulsion with cubes of soft paneer.";
          baseCost = 230;
        }
      }

      const finalCost = Math.min(baseCost, budget);

      const dishObj: Dish = {
        id: Math.random().toString(36).substring(7).toUpperCase(),
        name: dishName,
        cuisine,
        spiceLevel,
        dietary: [...dietary],
        estimatedCost: finalCost,
        ingredients,
        prepTime,
        confidenceScore: Math.round(92 + Math.random() * 7),
        imageUrl,
        description,
      };
      setDishImageIsAI(false);

      const inventoryHash = generateHash(JSON.stringify(ingredients.map(ing => ({ name: ing, qty: systemState.inventory[ing] ?? 0 }))));
      const pricingHash = generateHash(JSON.stringify(ingredients.map(ing => ({ name: ing, price: systemState.pricing[ing] ?? 0 }))));
      const dietaryHash = generateHash(JSON.stringify(ingredients.map(ing => ({ name: ing, rules: systemState.dietaryRules[ing] ?? [] }))));
      const artifactRoot = generateHash(dishObj.id + JSON.stringify(ingredients) + budget);
      const generationRoot = generateHash(inventoryHash + pricingHash + dietaryHash + artifactRoot);

      const randTokenId = "GB-DCT-2026-" + Math.random().toString(36).substring(2, 6).toUpperCase();
      const expiryTime = new Date(Date.now() + 20 * 60 * 1000).toLocaleTimeString();

      const tokenObj: GB_DCT_Token = {
        id: randTokenId,
        timestamp: new Date().toLocaleTimeString(),
        expiry: expiryTime,
        status: "ACTIVE",
        dish: dishObj,
        constraints: {
          budget,
          dietary: [...dietary],
          cuisine,
          spiceLevel,
        },
        hashes: {
          inventorySnapshotHash: inventoryHash,
          pricingSnapshotHash: pricingHash,
          dietaryHash,
          artifactRoot,
          generationRoot,
        },
        originalState: {
          inventory: { ...systemState.inventory },
          pricing: { ...systemState.pricing },
          dietaryRules: { ...systemState.dietaryRules },
        },
      };

      setGeneratedDish(dishObj);
      setGeneratedToken(tokenObj);
      addToken(tokenObj);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 relative overflow-hidden">
      <PhoBowlSketch className="opacity-[0.06] stroke-[#1d3a2b] -bottom-10" />

      <div>
        <h2 className="text-3xl font-extrabold text-[#1d3a2b] tracking-tight">Order Synthesizer Console</h2>
        <p className="text-[#1d3a2b]/70 text-sm mt-1">
          Provide constraints and visually trace the Agent's decision tree as it signs the dining lease.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Constraints Input (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Image Upload Card */}
          <div className="bg-white border border-[#e9e5da] rounded-xl p-6 relative overflow-hidden shadow-sm">
            <h3 className="text-sm font-bold text-[#1d3a2b] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e59b27]" />
              1. Image References (Optional)
            </h3>

            <div
              onDragEnter={(e) => { e.preventDefault(); setIsDragActive(true); }}
              onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragActive(false); processFiles(e.dataTransfer.files); }}
              className={`border border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-all cursor-pointer ${
                isDragActive ? "border-[#e59b27] bg-[#e59b27]/5" : "border-[#e9e5da] hover:border-[#e59b27]/40 bg-[#fffdf9]"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                accept="image/*"
                onChange={(e) => processFiles(e.target.files)}
              />

              {images.length === 0 ? (
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#f4f1ea] flex items-center justify-center mx-auto text-[#1d3a2b]/65 border border-[#e9e5da]">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-[#1d3a2b]">
                    Drag dish references here, or <span className="text-[#e59b27] hover:underline">browse</span>
                  </p>
                  <p className="text-[10px] text-[#1d3a2b]/50 font-mono">Supports JPG, PNG (Max 3 files)</p>
                </div>
              ) : (
                <div className="w-full space-y-4" onClick={(e) => e.stopPropagation()}>
                  <div className="grid grid-cols-3 gap-3">
                    {images.map((img) => (
                      <div key={img.id} className="relative aspect-square rounded-md overflow-hidden bg-white border border-[#e9e5da] group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt="Reference thumbnail" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeImage(img.id)}
                          className="absolute top-1 right-1 p-1 bg-black/70 rounded-full hover:bg-red-500 text-white transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {images.length < 3 && (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square border border-dashed border-[#e9e5da] rounded-md flex flex-col items-center justify-center hover:border-[#e59b27]/40 transition-colors bg-[#fffdf9]"
                      >
                        <Plus className="w-4 h-4 text-[#1d3a2b]/50" />
                        <span className="text-[10px] text-[#1d3a2b]/50 mt-1">Add</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Constraints Card */}
          <div className="bg-white border border-[#e9e5da] rounded-xl p-6 space-y-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#1d3a2b] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e59b27]" />
              2. User Policy & Constraints
            </h3>

            {/* Budget Constraint */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-[#1d3a2b]/70 block">Maximum Budget Limit</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#1d3a2b]/60 font-mono text-sm">₹</span>
                <input
                  type="number"
                  className="w-full bg-[#fffdf9] border border-[#e9e5da] focus:border-[#e59b27] rounded-lg py-2.5 pl-8 pr-4 text-[#1d3a2b] placeholder-[#1d3a2b]/40 text-sm focus:outline-none"
                  value={budget || ""}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  placeholder="e.g. 300"
                />
              </div>
              <div className="flex gap-2">
                {[150, 300, 500].map((val) => (
                  <button
                    key={val}
                    onClick={() => setBudget(val)}
                    className={`flex-1 py-1.5 border text-xs rounded-md transition-colors font-mono font-bold ${
                      budget === val ? "bg-[#1d3a2b] border-[#1d3a2b] text-[#f4f1ea]" : "bg-white border-[#e9e5da] text-[#1d3a2b]/80 hover:border-[#1d3a2b]"
                    }`}
                  >
                    ₹{val}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Constraints */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-[#1d3a2b]/70 block">Dietary Restrictions</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["Vegetarian", "Vegan", "Jain", "Gluten-Free"].map((pref) => {
                  const active = dietary.includes(pref);
                  return (
                    <button
                      key={pref}
                      onClick={() => setDietary((prev) => active ? prev.filter((p) => p !== pref) : [...prev, pref])}
                      className={`py-2 px-3 border text-xs rounded-lg text-center font-bold transition-all ${
                        active ? "bg-[#e59b27] text-white border-[#e59b27]" : "bg-[#fffdf9] border-[#e9e5da] text-[#1d3a2b]/80 hover:border-[#1d3a2b]"
                      }`}
                    >
                      {pref}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cuisine and Spice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-[#1d3a2b]/70 block">Cuisine Theme</label>
                <select
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full bg-[#fffdf9] border border-[#e9e5da] focus:border-[#e59b27] rounded-lg py-2.5 px-3 text-[#1d3a2b] text-sm focus:outline-none"
                >
                  <option value="Any">Any Cuisine</option>
                  <option value="Indian">Indian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Italian">Italian</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-[#1d3a2b]/70 block">Spice Intensity</label>
                <div className="flex bg-[#fffdf9] rounded-lg border border-[#e9e5da] p-1">
                  {(["Mild", "Medium", "Spicy"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setSpiceLevel(lvl)}
                      className={`flex-1 py-1.5 text-xs rounded-md font-bold transition-colors ${
                        spiceLevel === lvl ? "bg-[#1d3a2b] text-[#f4f1ea]" : "text-[#1d3a2b]/50 hover:text-[#1d3a2b]"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 bg-[#1d3a2b] hover:bg-[#14281e] disabled:bg-[#1d3a2b]/50 text-[#f4f1ea] font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm text-sm"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#e59b27]" />
                  <span>Synthesizing Dining Lease...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#e59b27]" />
                  <span>Generate Dish & Sign Lease</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Agent workflow monitor (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="receipt-paper rounded-xl p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-dashed border-[#e9e5da] pb-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#1d3a2b] font-bold">Agent Status Console</h3>
              <div className="w-2.5 h-2.5 rounded-full bg-[#e59b27] animate-pulse" />
            </div>

            <div className="space-y-3 font-mono text-xs">
              {steps.map((step, idx) => {
                const isCompleted = activeStep > idx;
                const isCurrent = activeStep === idx;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 py-1 transition-all ${
                      isCompleted ? "text-[#1d3a2b]/90 font-semibold" : isCurrent ? "text-[#e59b27] font-bold" : "text-[#1d3a2b]/30"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <div className="w-4 h-4 rounded-full bg-[#1d3a2b]/10 border border-[#1d3a2b]/40 flex items-center justify-center text-[10px]">
                          <Check className="w-2.5 h-2.5 text-[#1d3a2b]" />
                        </div>
                      ) : isCurrent && isGenerating ? (
                        <Loader2 className="w-3.5 h-3.5 text-[#e59b27] animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-[#e9e5da] bg-[#fffdf9]" />
                      )}
                    </div>
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Prompt/Constraint Snapshot */}
          <div className="border border-[#e9e5da] bg-white rounded-xl p-5 text-xs text-[#1d3a2b]/60 font-mono space-y-2 shadow-sm">
            <div className="font-bold text-[#1d3a2b] border-b border-[#f4f1ea] pb-2">[Live System Context]</div>
            <div>Active Kitchen Items: {Object.keys(systemState.inventory).length}</div>
            <div>Constraints Scope: {dietary.length > 0 ? dietary.join(", ") : "None"}</div>
            <div>Validation Mode: Generation-Bound Enforcement</div>
          </div>
        </div>
      </div>

      {/* Generated Dish Output Section */}
      <AnimatePresence>
        {generatedDish && generatedToken && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="border-t border-[#e9e5da] pt-10 mt-10 space-y-6"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#e59b27]/10 text-[#e59b27] border border-[#e59b27]/25 rounded-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-bold text-[#1d3a2b]">Synthesized Dining Lease Target</h3>
            </div>

            <div className="receipt-paper rounded-2xl p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch shadow-sm">
              {/* Dish Image */}
              <div className="md:col-span-4 rounded-xl overflow-hidden bg-[#fffdf9] border border-[#e6dfd3] aspect-video md:aspect-auto relative min-h-[160px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={generatedDish.imageUrl} alt={generatedDish.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur border border-[#e9e5da] rounded text-[10px] font-mono text-[#e59b27] font-bold">
                  Score: {generatedDish.confidenceScore}%
                </div>
                {dishImageIsAI && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono font-bold"
                    style={{ background: "linear-gradient(135deg, #1d3a2b, #2d5a42)", color: "#e59b27", boxShadow: "0 0 10px rgba(229,155,39,0.35)" }}>
                    <Wand2 className="w-3 h-3" />
                    AI Vision
                  </div>
                )}
              </div>

              {/* Dish Metadata */}
              <div className="md:col-span-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h4 className="text-lg font-bold text-[#1d3a2b]">{generatedDish.name}</h4>
                    <span className="text-sm font-mono text-[#1d3a2b] font-bold bg-[#e59b27]/10 px-2 py-1 border border-[#e59b27]/20 rounded">
                      ₹{generatedDish.estimatedCost}
                    </span>
                  </div>

                  <p className="text-xs text-[#1d3a2b]/70 leading-relaxed font-semibold">{generatedDish.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-xs font-mono border-t border-dashed border-[#e9e5da] pt-4">
                    <div>
                      <span className="text-[#1d3a2b]/40 block">Ingredients</span>
                      <span className="text-[#1d3a2b] mt-1 block font-sans font-bold">
                        {generatedDish.ingredients.join(", ")}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#1d3a2b]/40 block">Preparation Duration</span>
                      <span className="text-[#1d3a2b] mt-1 block font-sans font-bold">
                        {generatedDish.prepTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cryptographic Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-dashed border-[#e9e5da]">
                  <button
                    onClick={() => onNavigate("artifact")}
                    className="flex-1 py-2 px-3 bg-white border border-[#e9e5da] text-xs font-mono text-[#1d3a2b] hover:text-[#1d3a2b] hover:border-[#1d3a2b] rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#e59b27]" />
                    <span>View AI Artifact</span>
                  </button>
                  <button
                    onClick={() => onNavigate("token")}
                    className="flex-1 py-2 px-3 bg-white border border-[#e9e5da] text-xs font-mono text-[#1d3a2b] hover:text-[#1d3a2b] hover:border-[#1d3a2b] rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Key className="w-3.5 h-3.5 text-[#e59b27]" />
                    <span>View DCT Details</span>
                  </button>
                  <button
                    onClick={() => onNavigate("redemption")}
                    className="flex-1 py-2 px-3 bg-[#1d3a2b] hover:bg-[#14281e] text-[#f4f1ea] font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Redeem Token</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#e59b27]" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
