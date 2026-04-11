"use client";

import { useState } from "react";
import { Recipe } from "@/types/recipe";
import { formatMeasurement } from "@/utils/formatters";
import InstructionStep from "@/components/InstructionStep";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [scaleFactor, setScaleFactor] = useState(1);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-2xl">
      <div className="p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-100 dark:border-slate-700">
            <button
              onClick={() => setScaleFactor(0.5)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                scaleFactor === 0.5
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              ½×
            </button>
            <button
              onClick={() => setScaleFactor(1)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                scaleFactor === 1
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              1×
            </button>
            <button
              onClick={() => setScaleFactor(2)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                scaleFactor === 2
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              2×
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <label htmlFor="custom-scale" className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Custom:
            </label>
            <div className="relative group">
              <input
                id="custom-scale"
                type="number"
                step="0.1"
                min="0.1"
                value={scaleFactor}
                onChange={(e) => setScaleFactor(parseFloat(e.target.value) || 1)}
                className="w-20 px-3 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-lg text-sm font-bold text-center focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 font-bold pointer-events-none group-focus-within:text-blue-500">
                ×
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Category</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{recipe.category}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Servings</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {formatMeasurement(recipe.servings * scaleFactor)}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg">🥗</span>
              Ingredients
            </h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.name} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                  <span className="shrink-0 w-2 h-2 rounded-full bg-emerald-400 dark:bg-emerald-500 mt-2"></span>
                  <p className="text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {formatMeasurement(ingredient.quantity * scaleFactor)} {ingredient.unit}
                    </span>{" "}
                    {ingredient.name}
                    {ingredient.notes && (
                      <span className="text-slate-400 dark:text-slate-500 italic ml-1">
                        — {ingredient.notes}
                      </span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg">👨‍🍳</span>
              Steps
            </h2>
            <ol className="space-y-4">
              {recipe.steps.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 text-sm border border-slate-200 dark:border-slate-700">
                    {index + 1}
                  </span>
                  <div className="pt-1.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                    <InstructionStep step={step} ingredients={recipe.ingredients} scaleFactor={scaleFactor} />
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
