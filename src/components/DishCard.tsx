type Props = {
  title: string;
  ingredients: string[];
  cost: number;
};

export default function DishCard({ title, ingredients, cost }: Props) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition mt-6">
      <h3 className="text-xl font-semibold">{title}</h3>
      <ul className="mt-2 list-disc list-inside text-gray-600">
        {ingredients.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
      <p className="mt-2 font-medium">Estimated cost: ₹{cost}</p>
    </div>
  );
}
