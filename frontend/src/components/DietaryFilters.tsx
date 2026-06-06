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
      <h3 className="text-xs font-bold text-brand/80 mb-3.5 uppercase tracking-wider">
        Dietary Preferences
      </h3>
      <div className="flex flex-wrap gap-2.5">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.label);
          return (
            <button
              key={opt.label}
              onClick={() => toggle(opt.label)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs rounded-full border transition-all duration-200 font-bold ${
                isSelected
                  ? "bg-brand text-white border-brand shadow-sm scale-[1.02]"
                  : "bg-white border-zinc-200 hover:border-brand/40 text-brand/80 hover:text-brand"
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
