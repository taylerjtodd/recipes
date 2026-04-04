import { Recipe } from "@/types/recipe";
import recipes from "@/data/recipes.json";
import Link from "next/link";

export async function generateStaticParams() {
  return recipes.map((recipe) => ({
    slug: recipe.title.toLowerCase().replace(/ /g, "-"),
  }));
}

export default function RecipePage({ params }: { params: { slug: string } }) {
  const recipe = recipes.find(
    (r) => r.title.toLowerCase().replace(/ /g, "-") === params.slug
  ) as Recipe;

  if (!recipe) {
    return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
      <Link href="/">Back to recipes</Link>
      <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", margin: "1rem 0" }}>Not found</h1>
    </div>
  );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
      <Link href="/">Back to recipes</Link>
      <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", margin: "1rem 0" }}>{recipe.title}</h1>
      {!!recipe && (
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
            {ingredient.quantity} {ingredient.unit} {ingredient.name}
          </li>
        ))}
      </ul>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginTop: "1rem" }}>Steps</h2>
      <ol>
        {recipe.steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
        </>
      )}
    </div>
  );
}
