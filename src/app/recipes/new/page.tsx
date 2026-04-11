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

  const inputClassName = "w-full p-2 border border-gray-300 rounded";
  const secondaryBtnClassName = "px-4 py-2 bg-gray-200 text-gray-800 rounded cursor-pointer hover:bg-gray-300 transition-colors";

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Link
        href="/"
        className="text-blue-600 underline mb-4 inline-block hover:text-blue-800"
      >
        &larr; Back to Recipes
      </Link>
      <h1 className="text-4xl font-bold mb-8">
        Create New Recipe
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Basic Information */}
        <section className="border border-gray-200 p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Basic Info</h2>

          <label className="block mb-4">
            <span className="font-bold">Title</span>
            <input
              type="text"
              required
              className={`${inputClassName} mb-2 mt-1`}
              value={recipe.title}
              onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
            />
          </label>

          <label className="block mb-4">
            <span className="font-bold">Category</span>
            <input
              type="text"
              required
              className={`${inputClassName} mb-2 mt-1`}
              value={recipe.category}
              onChange={(e) => setRecipe({ ...recipe, category: e.target.value })}
            />
          </label>

          <div className="flex gap-4">
            <label className="flex-1">
              <span className="font-bold">Servings</span>
              <input
                type="number"
                min="1"
                required
                className={`${inputClassName} mb-2 mt-1`}
                value={recipe.servings}
                onChange={(e) => setRecipe({ ...recipe, servings: e.target.value })}
              />
            </label>
            <label className="flex-1">
              <span className="font-bold">Serving Size</span>
              <input
                type="number"
                min="0.1"
                step="0.1"
                required
                className={`${inputClassName} mb-2 mt-1`}
                value={recipe.serving_size}
                onChange={(e) => setRecipe({ ...recipe, serving_size: e.target.value })}
              />
            </label>
            <label className="flex-1">
              <span className="font-bold">Serving Size Units</span>
              <input
                type="text"
                required
                className={`${inputClassName} mb-2 mt-1`}
                value={recipe.serving_size_units}
                onChange={(e) => setRecipe({ ...recipe, serving_size_units: e.target.value })}
              />
            </label>
          </div>
        </section>

        {/* Tags */}
        <section className="border border-gray-200 p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Tags</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              className={`${inputClassName} mb-0`}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="e.g. dinner, vegan"
            />
            <button type="button" onClick={addTag} className={secondaryBtnClassName}>Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag, index) => (
              <span key={index} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {tag}
                <button type="button" onClick={() => removeTag(index)} className="bg-transparent border-none text-white cursor-pointer p-0 hover:text-gray-200">&times;</button>
              </span>
            ))}
          </div>
        </section>

        {/* Ingredients */}
        <section className="border border-gray-200 p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
          <div className="flex gap-2 mb-4 max-sm:flex-wrap">
            <input
              type="text"
              placeholder="Name"
              className={`${inputClassName} mb-0 flex-[2] min-w-[120px]`}
              value={ingredientInput.name}
              onChange={(e) => setIngredientInput({ ...ingredientInput, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Qty"
              min="0.1"
              step="0.1"
              className={`${inputClassName} mb-0 flex-1 min-w-[70px]`}
              value={ingredientInput.quantity}
              onChange={(e) => setIngredientInput({ ...ingredientInput, quantity: e.target.value })}
            />
            <input
              list="units-list"
              type="text"
              placeholder="Unit"
              className={`${inputClassName} mb-0 flex-1 min-w-[80px]`}
              value={ingredientInput.unit}
              onChange={(e) => setIngredientInput({ ...ingredientInput, unit: e.target.value })}
            />
            <input
              type="text"
              placeholder="Notes"
              className={`${inputClassName} mb-0 flex-1 min-w-[100px]`}
              value={ingredientInput.notes}
              onChange={(e) => setIngredientInput({ ...ingredientInput, notes: e.target.value })}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addIngredient(); } }}
            />
            <datalist id="units-list">
              {COMMON_UNITS.map((unit) => (
                <option key={unit} value={unit} />
              ))}
            </datalist>
            <button type="button" onClick={addIngredient} className={secondaryBtnClassName}>Add</button>
          </div>
          <ul className="list-inside p-0 m-0">
            {recipe.ingredients.map((ing, index) => (
              <li key={index} className="mb-1">
                {ing.quantity} {ing.unit} {ing.name}
                {ing.notes ? ` - ${ing.notes}` : ""}
                {" "}
                {ing.key && (
                  <span className="text-gray-500 text-sm">
                    (use {"{{"}{ing.key}{"}}"})
                  </span>
                )}
                <button type="button" onClick={() => removeIngredient(index)} className="bg-transparent border-none text-red-500 cursor-pointer ml-4 hover:text-red-700">[remove]</button>
              </li>
            ))}
          </ul>
        </section>

        {/* Steps */}
        <section className="border border-gray-200 p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Steps</h2>
          <div className="flex gap-2 mb-4">
            <textarea
              className={`${inputClassName} mb-0 min-h-[80px] resize-y`}
              value={stepInput}
              onChange={(e) => setStepInput(e.target.value)}
              placeholder="Describe this step..."
            />
            <button type="button" onClick={addStep} className={secondaryBtnClassName}>Add Step</button>
          </div>
          <ol className="pl-6 m-0 list-decimal">
            {recipe.steps.map((step, index) => (
              <li key={index} className="mb-2">
                {step}
                <button type="button" onClick={() => removeStep(index)} className="bg-transparent border-none text-red-500 cursor-pointer ml-4 hover:text-red-700">[remove]</button>
              </li>
            ))}
          </ol>
        </section>

        {/* Submit */}
        <div className="mt-4 mb-16">
          <button
            type="submit"
            className={`w-full text-xl p-4 rounded cursor-pointer text-white border-none transition-colors ${copied ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {copied ? "Copied to Clipboard!" : "Copy JSON to Clipboard"}
          </button>
        </div>

      </form>
    </div>
  );
}
