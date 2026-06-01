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
      <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-brand"></span>
        III. Whisper Your Heart's Desires
      </h2>

      <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
        <div className="relative">
          <textarea
            className="w-full bg-white/40 border border-cyber-border rounded-xl p-4 text-amber-950 placeholder-amber-900/60 focus:outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/30 transition-all duration-300 resize-none font-serif text-sm"
            rows={4}
            maxLength={maxLength}
            placeholder="What does your heart crave? e.g., 'A rich, creamy bowl of wild forest mushrooms and hand-pulled noodles, flavored with fresh cream and wild scallions under 300 gold coins'..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <div className="absolute bottom-3 right-3 text-xs text-amber-900/60 font-semibold font-serif">
            {value.length}/{maxLength}
          </div>
        </div>

        {/* Suggestion Chips */}
        <div>
          <p className="text-xs text-amber-900/80 mb-2 font-medium font-serif italic">Looking for inspiration? Whisper a preset craving:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs bg-cyber-card/70 hover:bg-brand/10 border border-cyber-border hover:border-brand/30 text-amber-950 hover:text-brand px-3 py-1.5 rounded-full transition-all duration-300 font-serif font-medium"
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
            className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-xl text-white transition-all duration-300 shadow-[0_4px_20px_rgba(139,38,62,0.15)] hover:shadow-[0_4px_25px_rgba(139,38,62,0.3)] ${!value.trim() || isLoading
                ? "bg-amber-900/10 text-amber-950/40 cursor-not-allowed border border-cyber-border shadow-none"
                : "bg-gradient-to-r from-brand to-brand-dark hover:scale-[1.03] active:scale-[0.98]"
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
