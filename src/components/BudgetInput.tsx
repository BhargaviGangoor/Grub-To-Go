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
      <h3 className="text-xs font-bold text-brand/80 mb-3.5 uppercase tracking-wider">
        Maximum Budget Constraint
      </h3>

      <div className="flex flex-col gap-3">
        {/* Styled numeric input with prefix */}
        <div className="relative rounded-xl overflow-hidden shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand font-bold text-lg">
            ₹
          </div>
          <input
            type="number"
            min="50"
            max="5000"
            className="block w-full bg-white border border-zinc-300 rounded-xl pl-9 pr-4 py-3 text-brand placeholder-zinc-400 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all text-sm font-semibold"
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
              className={`flex-1 text-xs border py-2.5 rounded-xl transition-all duration-200 font-bold ${
                budgetValue === preset.value.toString()
                  ? "bg-brand text-white border-brand shadow-sm"
                  : "bg-white border-zinc-200 hover:border-brand/40 text-brand/80 hover:text-brand"
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
