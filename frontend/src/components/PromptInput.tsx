import { useState } from "react";

interface PromptInputProps {
  onSubmit: (text: string) => void;
  isLoading?: boolean;
  value: string;
  onChange: (val: string) => void;
}

export default function PromptInput({
  onSubmit,
  isLoading = false,
  value = "",
  onChange = () => { }
}: PromptInputProps) {
  const maxLength = 300;

  const suggestions = [
    "Royal Udon of Spicy Creamy Cottage Cheese",
    "Crown Prince's Signature Shoyu Chicken Ramen",
    "Rich Velvet Soup of Forest Mushrooms & Herbs",
    "Saffron Infused Rice with Cottage Cheese Pearls"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onSubmit(value);
      }
    }
  };

  return (
    <div className="w-full mt-6">
      <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#1d3a2b]/70">
        <span className="h-2 w-2 rounded-full bg-[#e59b27]"></span>
        III. Whisper Your Heart's Desires
      </h2>

      <div className="flex flex-col gap-4 rounded-[1.75rem] border border-[#e9e5da] bg-white/80 p-6 shadow-[0_14px_40px_rgba(29,58,43,0.06)] backdrop-blur-sm">
        <div className="relative">
          <textarea
            className="w-full resize-none rounded-2xl border border-[#e9e5da] bg-[#fffdf9]/80 p-4 text-sm text-[#1d3a2b] placeholder:text-[#1d3a2b]/40 focus:border-[#1d3a2b] focus:outline-none focus:ring-2 focus:ring-[#e59b27]/15 transition-colors duration-200"
            rows={4}
            maxLength={maxLength}
            placeholder="What does your heart crave? e.g., 'A rich, creamy bowl of wild forest mushrooms and hand-pulled noodles, flavored with fresh cream and wild scallions under 300 gold coins'..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <div className="absolute bottom-3 right-3 text-xs font-semibold text-[#1d3a2b]/45">
            {value.length}/{maxLength}
          </div>
        </div>

        {/* Suggestion Chips */}
        <div>
          <p className="mb-2 text-xs font-medium italic text-[#1d3a2b]/72">Looking for inspiration? Whisper a preset craving:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="rounded-full border border-[#e9e5da] bg-white px-3 py-1.5 text-xs font-medium text-[#1d3a2b] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1d3a2b]/25 hover:bg-[#1d3a2b]/5"
              >
                📜 {suggestion.split(" ").slice(0, 3).join(" ")}...
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-end mt-2">
          <button
            onClick={() => value.trim() && onSubmit(value)}
            disabled={!value.trim() || isLoading}
            className={`flex items-center gap-2 rounded-full border px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${!value.trim() || isLoading
                ? "cursor-not-allowed border-[#e9e5da] bg-[#fffdf9]/50 text-[#1d3a2b]/30"
                : "border-transparent bg-[#1d3a2b] text-[#f8f3e6] shadow-[0_18px_40px_rgba(29,58,43,0.16)] hover:-translate-y-0.5 hover:bg-[#e59b27] hover:text-[#1d3a2b]"
              }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="font-serif italic font-medium">Alchemizing Masterpiece...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="font-serif font-semibold">Synthesize Culinary Masterpiece</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
