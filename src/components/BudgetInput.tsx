export default function BudgetInput({
  onChange,
}: {
  onChange: (value: number) => void;
}) {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">
        Budget (₹)
      </label>
      <input
        type="number"
        className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        placeholder="e.g., 300"
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
