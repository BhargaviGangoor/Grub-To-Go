import { useState } from "react";

interface BudgetInputProps {
  onChange: (value: number) => void;
}

export default function BudgetInput({ onChange }: BudgetInputProps) {
  const [budgetValue, setBudgetValue] = useState<string>("");

  const presets = [
    { label: "Economy", value: 150 },
    { label: "Standard", value: 300 },
    { label: "Premium", value: 500 }
  ];

  const handleInputChange = (val: string) => {
    setBudgetValue(val);
    onChange(Number(val));
  };

  const handlePresetClick = (val: number) => {
    setBudgetValue(val.toString());
    onChange(val);
  };

  return (
    <div className="w-full">
      <h3 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#1d3a2b]/70">
        Maximum Budget Constraint
      </h3>

      <div className="flex flex-col gap-3">
        {/* Styled numeric input with prefix */}
        <div className="relative overflow-hidden rounded-2xl border border-[#e9e5da] bg-white/80 shadow-[0_10px_24px_rgba(29,58,43,0.05)]">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-lg font-bold text-[#1d3a2b]">
            ₹
          </div>
          <input
            type="number"
            min="50"
            max="5000"
            className="block w-full rounded-2xl border-0 bg-transparent py-3 pl-9 pr-4 text-sm font-semibold text-[#1d3a2b] placeholder:text-[#1d3a2b]/35 focus:outline-none focus:ring-0"
            placeholder="Enter maximum budget (e.g., 300)"
            value={budgetValue}
            onChange={(e) => handleInputChange(e.target.value)}
          />
        </div>

        {/* Quick select presets */}
        <div className="flex gap-2">
          {presets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handlePresetClick(preset.value)}
              className={`flex-1 rounded-full border px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-200 ${
                budgetValue === preset.value.toString()
                  ? "border-transparent bg-[#1d3a2b] text-[#f8f3e6] shadow-[0_14px_28px_rgba(29,58,43,0.14)]"
                  : "border-[#e9e5da] bg-white text-[#1d3a2b]/72 hover:-translate-y-0.5 hover:border-[#1d3a2b]/20 hover:bg-[#1d3a2b]/5 hover:text-[#1d3a2b]"
              }`}
            >
              ₹{preset.value} <span className="text-[10px] opacity-80 block md:inline">({preset.label})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
