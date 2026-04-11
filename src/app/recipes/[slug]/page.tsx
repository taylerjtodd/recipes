import { Recipe } from "@/types/recipe";
import recipes from "@/data/recipes.json";
import RecipeCard from "@/components/RecipeCard";

export async function generateStaticParams() {
  return recipes.map((recipe) => ({
    slug: recipe.title.toLowerCase().replace(/ /g, "-"),
  }));
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const recipe = recipes.find(
    (r) => r.title.toLowerCase().replace(/ /g, "-") === slug
  ) as Recipe;
  console.log({ slug, recipe })

  return (
    <div className="max-w-3xl mx-auto p-2 md:p-4">
      <RecipeCard recipe={recipe} />
    </div>
  );
}
