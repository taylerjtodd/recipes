import { Recipe } from "@/types/recipe";
import recipes from "@/data/recipes.json";
import Header from "@/components/Header";
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
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
      <Header title={recipe?.title ?? 'Not Found'} />
      <RecipeCard recipe={recipe} />
    </div>
  );
}
