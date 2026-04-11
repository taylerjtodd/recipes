"use client";

import { useState } from "react";
import Link from "@/components/core/Link";
import recipes from "@/data/recipes.json";
import { Recipe } from "@/types/recipe";

const searchString = (recipe: Recipe) => {
  return `${recipe.title}|${recipe.tags.join(", ")}|${recipe.category}|${recipe.ingredients.map(i => i.name).join('|')}`
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecipes = recipes.filter((recipe) =>
    searchString(recipe).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold m-0">My Recipes</h1>
        <Link href="/recipes/new" unstyled className="px-4 py-2 bg-blue-600 text-white rounded no-underline">
          Add Recipe
        </Link>
      </div>
      <input
        type="text"
        placeholder="Search for a recipe"
        className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-300 dark:border-gray-700 p-2 text-left">Title</th>
            <th className="border border-gray-300 dark:border-gray-700 p-2 text-left">Category</th>
            <th className="border border-gray-300 dark:border-gray-700 p-2 text-left">Tags</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecipes.map((recipe) => (
            <tr key={recipe.title}>
              <td className="border border-gray-300 dark:border-gray-700 p-2">
                <Link href={`/recipes/${recipe.title.toLowerCase().replace(/ /g, "-")}`}>
                  {recipe.title}
                </Link>
              </td>
              <td className="border border-gray-300 dark:border-gray-700 p-2">{recipe.category}</td>
              <td className="border border-gray-300 dark:border-gray-700 p-2">{recipe.tags.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
