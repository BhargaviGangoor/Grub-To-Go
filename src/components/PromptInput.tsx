import { useState } from "react";

export default function PromptInput({
  onSubmit,
}: {
  onSubmit: (text: string) => void;
}) {
  const [text, setText] = useState("");

  return (
    <div className="mt-4">
      <textarea
        className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        rows={3}
        placeholder="Describe cravings, diet, budget…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        onClick={() => onSubmit(text)}
      >
        Generate Dish
      </button>
    </div>
  );
}
