"use client";

import { useState } from "react";
import Link from "next/link";
import { Recipe, COMMON_UNITS } from "@/types/recipe";

export default function NewRecipe() {
  const [recipe, setRecipe] = useState({
    title: "",
    category: "",
    tags: [] as string[],
    ingredients: [] as Recipe["ingredients"],
    steps: [] as string[],
    servings: 1 as number | string,
    serving_size: 1 as number | string,
    serving_size_units: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [stepInput, setStepInput] = useState("");
  const [ingredientInput, setIngredientInput] = useState({
    name: "",
    quantity: 1 as number | string,
    unit: "",
    notes: "",
  });
  const [copied, setCopied] = useState(false);

  const addTag = () => {
    if (tagInput.trim()) {
      setRecipe((r) => ({ ...r, tags: [...r.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };

  const addStep = () => {
    if (stepInput.trim()) {
      setRecipe((r) => ({ ...r, steps: [...r.steps, stepInput.trim()] }));
      setStepInput("");
    }
  };

  const addIngredient = () => {
    if (ingredientInput.name.trim()) {
      setRecipe((r) => {
        const newIngr: any = {
          name: ingredientInput.name.trim(),
          quantity: Number(ingredientInput.quantity),
          unit: ingredientInput.unit.trim(),
        };
        if (ingredientInput.notes.trim()) {
          newIngr.notes = ingredientInput.notes.trim();
        }
        
        const existingCopies = r.ingredients.filter(i => i.name.toLowerCase() === newIngr.name.toLowerCase());
        let newIngredients = [...r.ingredients];
        
        if (existingCopies.length > 0) {
            // First time a duplicate arrives, set the original's key to include '-1'
            if (existingCopies.length === 1 && !existingCopies[0].key) {
                const originalIdx = r.ingredients.findIndex(i => i.name.toLowerCase() === newIngr.name.toLowerCase());
                newIngredients[originalIdx] = {
                   ...newIngredients[originalIdx],
                   key: `${newIngredients[originalIdx].name.toLowerCase().replace(/\s+/g, '-')}-1`
                };
            }
            newIngr.key = `${newIngr.name.toLowerCase().replace(/\s+/g, '-')}-${existingCopies.length + 1}`;
        }
        
        newIngredients.push(newIngr);

        return {
          ...r,
          ingredients: newIngredients,
        };
      });
      setIngredientInput({ name: "", quantity: 1, unit: "", notes: "" });
    }
  };

  const removeTag = (index: number) =>
    setRecipe((r) => ({ ...r, tags: r.tags.filter((_, i) => i !== index) }));
  const removeStep = (index: number) =>
    setRecipe((r) => ({ ...r, steps: r.steps.filter((_, i) => i !== index) }));
  const removeIngredient = (index: number) =>
    setRecipe((r) => ({
      ...r,
      ingredients: r.ingredients.filter((_, i) => i !== index),
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format recipe to match files like chicken-tikka-masala.json which wrap in an array
    const recipeData = [
      {
        ...recipe,
        servings: Number(recipe.servings),
        serving_size: Number(recipe.serving_size)
      }
    ];

    navigator.clipboard.writeText(JSON.stringify(recipeData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    marginBottom: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: "0.25rem",
  };
  const btnStyle = {
    padding: "0.5rem 1rem",
    backgroundColor: "#0070f3",
    color: "white",
    border: "none",
    borderRadius: "0.25rem",
    cursor: "pointer",
  };
  const secondaryBtnStyle = {
    ...btnStyle,
    backgroundColor: "#eaeaea",
    color: "#333",
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
      <Link
        href="/"
        style={{
          color: "#0070f3",
          textDecoration: "underline",
          marginBottom: "1rem",
          display: "inline-block",
        }}
      >
        &larr; Back to Recipes
      </Link>
      <h1
        style={{
          fontSize: "2.25rem",
          fontWeight: "bold",
          marginBottom: "2rem",
        }}
      >
        Create New Recipe
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* Basic Information */}
        <section style={{ border: "1px solid #eee", padding: "1rem", borderRadius: "0.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Basic Info</h2>
          
          <label style={{ display: "block", marginBottom: "1rem" }}>
            <span style={{ fontWeight: "bold" }}>Title</span>
            <input
              type="text"
              required
              style={inputStyle}
              value={recipe.title}
              onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
            />
          </label>

          <label style={{ display: "block", marginBottom: "1rem" }}>
            <span style={{ fontWeight: "bold" }}>Category</span>
            <input
              type="text"
              required
              style={inputStyle}
              value={recipe.category}
              onChange={(e) => setRecipe({ ...recipe, category: e.target.value })}
            />
          </label>

          <div style={{ display: "flex", gap: "1rem" }}>
            <label style={{ flex: 1 }}>
              <span style={{ fontWeight: "bold" }}>Servings</span>
              <input
                type="number"
                min="1"
                required
                style={inputStyle}
                value={recipe.servings}
                onChange={(e) => setRecipe({ ...recipe, servings: e.target.value })}
              />
            </label>
            <label style={{ flex: 1 }}>
              <span style={{ fontWeight: "bold" }}>Serving Size</span>
              <input
                type="number"
                min="0.1"
                step="0.1"
                required
                style={inputStyle}
                value={recipe.serving_size}
                onChange={(e) => setRecipe({ ...recipe, serving_size: e.target.value })}
              />
            </label>
            <label style={{ flex: 1 }}>
              <span style={{ fontWeight: "bold" }}>Serving Size Units</span>
              <input
                type="text"
                required
                style={inputStyle}
                value={recipe.serving_size_units}
                onChange={(e) => setRecipe({ ...recipe, serving_size_units: e.target.value })}
              />
            </label>
          </div>
        </section>

        {/* Tags */}
        <section style={{ border: "1px solid #eee", padding: "1rem", borderRadius: "0.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Tags</h2>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <input
              type="text"
              style={{ ...inputStyle, marginBottom: 0 }}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="e.g. dinner, vegan"
            />
            <button type="button" onClick={addTag} style={secondaryBtnStyle}>Add</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {recipe.tags.map((tag, index) => (
              <span key={index} style={{ backgroundColor: "#0070f3", color: "white", padding: "0.25rem 0.5rem", borderRadius: "1rem", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {tag}
                <button type="button" onClick={() => removeTag(index)} style={{ background: "transparent", border: "none", color: "white", cursor: "pointer", padding: 0 }}>&times;</button>
              </span>
            ))}
          </div>
        </section>

        {/* Ingredients */}
        <section style={{ border: "1px solid #eee", padding: "1rem", borderRadius: "0.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Ingredients</h2>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder="Name"
              style={{ ...inputStyle, marginBottom: 0, flex: 2 }}
              value={ingredientInput.name}
              onChange={(e) => setIngredientInput({ ...ingredientInput, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Quantity"
              min="0.1"
              step="0.1"
              style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
              value={ingredientInput.quantity}
              onChange={(e) => setIngredientInput({ ...ingredientInput, quantity: e.target.value })}
            />
            <input
              list="units-list"
              type="text"
              placeholder="Unit (e.g. g, tbsp)"
              style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
              value={ingredientInput.unit}
              onChange={(e) => setIngredientInput({ ...ingredientInput, unit: e.target.value })}
            />
            <input
              type="text"
              placeholder="Notes (e.g. chopped)"
              style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
              value={ingredientInput.notes}
              onChange={(e) => setIngredientInput({ ...ingredientInput, notes: e.target.value })}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addIngredient(); } }}
            />
            <datalist id="units-list">
              {COMMON_UNITS.map((unit) => (
                <option key={unit} value={unit} />
              ))}
            </datalist>
            <button type="button" onClick={addIngredient} style={secondaryBtnStyle}>Add</button>
          </div>
          <ul style={{ listStylePosition: "inside", padding: 0, margin: 0 }}>
            {recipe.ingredients.map((ing, index) => (
              <li key={index} style={{ marginBottom: "0.25rem" }}>
                {ing.quantity} {ing.unit} {ing.name}
                {ing.notes ? ` - ${ing.notes}` : ""}
                {" "}
                {ing.key && (
                  <span style={{ color: "#666", fontSize: "0.85em" }}>
                    (use {"{{"}{ing.key}{"}}"})
                  </span>
                )}
                <button type="button" onClick={() => removeIngredient(index)} style={{ background: "transparent", border: "none", color: "red", cursor: "pointer", marginLeft: "1rem" }}>[remove]</button>
              </li>
            ))}
          </ul>
        </section>

        {/* Steps */}
        <section style={{ border: "1px solid #eee", padding: "1rem", borderRadius: "0.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Steps</h2>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <textarea
              style={{ ...inputStyle, marginBottom: 0, minHeight: "80px", resize: "vertical" }}
              value={stepInput}
              onChange={(e) => setStepInput(e.target.value)}
              placeholder="Describe this step..."
            />
            <button type="button" onClick={addStep} style={secondaryBtnStyle}>Add Step</button>
          </div>
          <ol style={{ paddingLeft: "1.5rem", margin: 0 }}>
            {recipe.steps.map((step, index) => (
              <li key={index} style={{ marginBottom: "0.5rem" }}>
                {step}
                <button type="button" onClick={() => removeStep(index)} style={{ background: "transparent", border: "none", color: "red", cursor: "pointer", marginLeft: "1rem" }}>[remove]</button>
              </li>
            ))}
          </ol>
        </section>

        {/* Submit */}
        <div style={{ marginTop: "1rem", marginBottom: "4rem" }}>
          <button type="submit" style={{ ...btnStyle, width: "100%", fontSize: "1.25rem", padding: "1rem", backgroundColor: copied ? "#28a745" : "#0070f3" }}>
            {copied ? "Copied to Clipboard!" : "Copy JSON to Clipboard"}
          </button>
        </div>

      </form>
    </div>
  );
}
