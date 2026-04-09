import { Recipe } from "@/types/recipe";
import { formatMeasurement } from "@/utils/formatters";

export default function InstructionStep({
  step,
  ingredients,
}: {
  step: string;
  ingredients: Recipe["ingredients"];
}) {
  const parts = step.split(/(\{\{.*?\}\})/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("{{") && part.endsWith("}}")) {
          const matchKey = part.slice(2, -2).trim();
          
          let ingredient = ingredients.find((i) => i.key === matchKey);
          
          if (!ingredient) {
            ingredient = ingredients.find(
              (i) => i.name.toLowerCase() === matchKey.toLowerCase()
            );
          }

          if (ingredient) {
            return (
              <strong key={index}>
                {formatMeasurement(ingredient.quantity)} {ingredient.unit}{" "}
                {ingredient.name}
              </strong>
            );
          } else {
            // Unbracket if not found, as per user requirement
            return <span key={index}>{matchKey}</span>;
          }
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}
