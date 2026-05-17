import { useState, useEffect } from "react";

export default function DietaryFilters({
  onChange,
}: {
  onChange: (filters: string[]) => void;
}) {
  const options = [
    "Vegan",
    "Vegetarian",
    "Gluten‑Free",
    "Nut‑Free",
    "Halal",
    "Kosher",
  ];
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (opt: string) => {
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((i) => i !== opt) : [...prev, opt]
    );
  };

  // Notify parent whenever selection changes
  useEffect(() => onChange(selected), [selected]);

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {options.map((opt) => (
        <button
          key={opt}
          className={`px-3 py-1 rounded border ${
            selected.includes(opt) ? "bg-indigo-600 text-white" : "bg-white"
          }`}
          onClick={() => toggle(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
