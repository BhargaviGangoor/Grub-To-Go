"use client";

import { useState } from "react"; // Importing useState hook from React to manage the current view state
import LandingView from "@/components/landing/LandingView";
import GenerateView from "@/components/GenerateView";

type ViewName = "landing" | "generate";

export default function Page() {
  const [view, setView] = useState<ViewName>("landing"); // Initializing the view state to "landing" by default

  const handleNavigate = (nextView: string) => { // Function to handle navigation between views based on the nextView parameter
    if (nextView === "landing") {
      setView("landing");
      return;
    }

    if (nextView === "generate") {
      setView("generate");
      return;
    }

    console.log(`Would navigate to: ${nextView}`);
  };

  return (
    <main>
      {view === "generate" ? (
        <div className="mx-auto flex w-full max-w-7xl justify-start px-4 pt-4">
          <button
            type="button"
            onClick={() => setView("landing")}
            className="rounded-full border border-[#e9e5da] bg-white/80 px-4 py-2 text-sm font-semibold text-[#1d3a2b] shadow-sm backdrop-blur transition hover:bg-white"
          >
            Back to home
          </button>
        </div>
      ) : null}

      {view === "landing" ? (
        <LandingView onNavigate={handleNavigate} />
      ) : (
        <GenerateView onNavigate={handleNavigate} />
      )}
    </main>
  );
}
