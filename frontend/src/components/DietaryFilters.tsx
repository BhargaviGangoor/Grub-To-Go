import { useState, useEffect } from "react";

interface DietaryFiltersProps {
  onChange: (filters: string[]) => void;
}

interface FilterOption {
  label: string;
  icon: string;
}

export default function DietaryFilters({ onChange }: DietaryFiltersProps) {
  const options: FilterOption[] = [
    { label: "Vegan", icon: "🌿" },
    { label: "Vegetarian", icon: "🥦" },
    { label: "Gluten-Free", icon: "🌾" },
    { label: "Nut-Free", icon: "🥜" },
    { label: "Halal", icon: "🌙" },
    { label: "Kosher", icon: "✡️" }
  ];

  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (opt: string) => {
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((i) => i !== opt) : [...prev, opt]
    );
  };

  useEffect(() => {
    onChange(selected);
  }, [selected]);

  return (
    <div className="w-full">
      <h3 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#1d3a2b]/70">
        Dietary Preferences
      </h3>
      <div className="flex flex-wrap gap-2.5">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.label);
          return (
            <button
              key={opt.label}
              onClick={() => toggle(opt.label)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-200 ${
                isSelected
                  ? "border-transparent bg-[#1d3a2b] text-[#f8f3e6] shadow-[0_14px_28px_rgba(29,58,43,0.14)] scale-[1.02]"
                  : "border-[#e9e5da] bg-white text-[#1d3a2b]/72 hover:-translate-y-0.5 hover:border-[#1d3a2b]/20 hover:bg-[#1d3a2b]/5 hover:text-[#1d3a2b]"
              }`}
            >
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
