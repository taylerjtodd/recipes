import { Recipe } from "@/types/recipe";
import { formatMeasurement } from "@/utils/formatters";
import { UnitSystem, convertForSystem } from "@/utils/units";

export default function InstructionStep({
  step,
  ingredients,
  scaleFactor = 1,
  unitSystem = "original",
}: {
  step: string;
  ingredients: Recipe["ingredients"];
  scaleFactor?: number;
  unitSystem?: UnitSystem;
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
            const { quantity: displayQuantity, unit: displayUnit } = convertForSystem(ingredient.quantity, ingredient.unit, unitSystem);
            return (
              <strong key={index}>
                {formatMeasurement(displayQuantity * scaleFactor)} {displayUnit}{" "}
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
