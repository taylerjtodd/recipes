"use client";

import { useState } from "react";
import { Recipe } from "@/types/recipe";
import { formatMeasurement } from "@/utils/formatters";
import InstructionStep from "@/components/InstructionStep";
import Ingredient from "@/components/Ingredient";
import Paper from "@/components/core/Paper";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [scaleFactor, setScaleFactor] = useState(1);

  return (
    <Paper level={1} className="p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-1">
            Recipe Scale
          </span>
          <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <button
              onClick={() => {
                if (scaleFactor === 1) setScaleFactor(0.5);
                else if (scaleFactor > 1) setScaleFactor(Math.ceil(scaleFactor) - 1);
              }}
              disabled={scaleFactor <= 0.5}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-all font-bold text-xl"
              aria-label="Decrease scale"
            >
              −
            </button>

            <div className="relative flex items-center px-2">
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={scaleFactor}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val >= 0.1) setScaleFactor(val);
                }}
                className="w-16 bg-transparent border-none text-center font-bold text-slate-800 dark:text-slate-100 focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            <button
              onClick={() => {
                if (scaleFactor === 0.5) setScaleFactor(1);
                else setScaleFactor(Math.floor(scaleFactor) + 1);
              }}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-bold text-xl"
              aria-label="Increase scale"
            >
              +
            </button>
          </div>
        </div>

        {scaleFactor !== 1 && (
          <button
            onClick={() => setScaleFactor(1)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-bold hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all border border-slate-100 dark:border-slate-700 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300"
            aria-label="Reset scale to 1"
          >
            <span className="text-lg leading-none">↺</span>
            Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <Paper level={2} className="p-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Category</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{recipe.category}</p>
            </Paper>
            <Paper level={2} className="p-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Servings</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {formatMeasurement(recipe.servings * scaleFactor)}
              </p>
            </Paper>
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
          <ul>
            {recipe.ingredients.map((ingredient) => (
              <Ingredient key={ingredient.name} ingredient={ingredient} scaleFactor={scaleFactor} />
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
    </Paper>
  );
}
