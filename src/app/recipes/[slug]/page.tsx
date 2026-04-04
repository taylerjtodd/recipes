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
    <div className="container mx-auto p-4">
      <Link href="/">Back to recipes</Link>
      <h1 className="text-4xl font-bold my-4">Not found</h1>
    </div>
  );
  }

  return (
    <div className="container mx-auto p-4">
      <Link href="/">Back to recipes</Link>
      <h1 className="text-4xl font-bold my-4">{recipe.title}</h1>
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
      <h2 className="text-2xl font-bold mt-4">Ingredients</h2>
      <ul>
        {recipe.ingredients.map((ingredient) => (
          <li key={ingredient.name}>
            {ingredient.quantity} {ingredient.unit} {ingredient.name}
          </li>
        ))}
      </ul>
      <h2 className="text-2xl font-bold mt-4">Steps</h2>
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
