"use client";

import { useState } from "react";
import Link from "next/link";
import recipes from "@/data/recipes.json";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
      <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", marginBottom: "1rem" }}>My Recipes</h1>
      <input
        type="text"
        placeholder="Search for a recipe"
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem", border: "1px solid #ccc", borderRadius: "0.25rem" }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem", textAlign: "left" }}>Title</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem", textAlign: "left" }}>Category</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem", textAlign: "left" }}>Tags</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecipes.map((recipe) => (
            <tr key={recipe.title}>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                <Link href={`/recipes/${recipe.title.toLowerCase().replace(/ /g, "-")}`}>
                  {recipe.title}
                </Link>
              </td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{recipe.category}</td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{recipe.tags.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
