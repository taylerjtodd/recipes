import { Recipe } from "@/types/recipe";
import { formatMeasurement } from "@/utils/formatters";
import InstructionStep from "@/components/InstructionStep";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <>
          <p>
            <strong>Category:</strong> {recipe.category}
          </p>
          <p>
            <strong>Tags:</strong> {recipe.tags.join(", ")}
          </p>
          <p>
            <strong>Servings:</strong> {recipe.servings}
          </p>
          <p>
            <strong>Serving Size:</strong> {recipe.serving_size}{" "}
            {recipe.serving_size_units}
          </p>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginTop: "1rem" }}>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.name}>
                {formatMeasurement(ingredient.quantity)} {ingredient.unit} {ingredient.name}
                {ingredient.notes ? ` - ${ingredient.notes}` : ""}
              </li>
            ))}
          </ul>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginTop: "1rem" }}>Steps</h2>
          <ol>
            {recipe.steps.map((step, index) => (
              <li key={index} style={{ marginBottom: "0.5rem" }}>
                <InstructionStep step={step} ingredients={recipe.ingredients} />
              </li>
            ))}
          </ol>
        </>
  );
}
