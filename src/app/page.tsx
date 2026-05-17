"use client";

import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import PromptInput from "@/components/PromptInput";
import DietaryFilters from "@/components/DietaryFilters";
import BudgetInput from "@/components/BudgetInput";
import DishCard from "@/components/DishCard";
import DCTDisplay from "@/components/DCTDisplay";

export default function Home() {
  // ------------ React state (concept) ------------
  const [dish, setDish] = useState<any>(null);
  const [dct, setDCT] = useState<string>("");

  // ------------ Event handling (concept) ------------
  const handleGenerate = (prompt: string) => {
    // Placeholder – later we’ll call the real API
    const mockDish = {
      title: "Spicy Creamy Paneer Chili Udon",
      ingredients: ["Udon noodles", "Paneer", "Chili paste", "Cream"],
      cost: 270,
    };
    const mockDCT = "DCT-XYZ123";
    setDish(mockDish);
    setDCT(mockDCT);
  };

  // ------------ JSX rendering (React) ------------
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        GrubToGo – Custom Dish Generator
      </h1>

      {/* 1️⃣ Image upload */}
      <ImageUpload />

      {/* 2️⃣ Prompt input */}
      <PromptInput onSubmit={handleGenerate} />

      {/* 3️⃣ Dietary filters */}
      <DietaryFilters onChange={() => {}} />

      {/* 4️⃣ Budget input */}
      <BudgetInput onChange={() => {}} />

      {/* 5️⃣ Render dish & DCT when we have data */}
      {dish && (
        <>
          <DishCard {...dish} />
          <DCTDisplay token={dct} expiresIn={1200} />
        </>
      )}
    </main>
  );
}
