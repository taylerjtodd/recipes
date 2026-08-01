"use client";

import { useState, useMemo } from "react";
import { useStarredRecipes } from "@/hooks/useStarredRecipes";
import recipes from "@/data/recipes.json";
import { Recipe } from "@/types/recipe";
import { formatMeasurement } from "@/utils/formatters";
import Paper from "@/components/core/Paper";
import Link from "@/components/core/Link";
import { ShoppingCart, Check, RotateCcw } from "lucide-react";

interface AggregatedIngredient {
  name: string;
  /** Each entry is a unique (quantity, unit) pair from one or more recipes */
  amounts: { quantity: number; unit: string }[];
  /** Which recipes use this ingredient */
  recipes: string[];
  notes: string[];
}

function aggregateIngredients(starredTitles: string[]): AggregatedIngredient[] {
  const map = new Map<string, AggregatedIngredient>();

  for (const title of starredTitles) {
    const recipe = (recipes as Recipe[]).find((r) => r.title === title);
    if (!recipe) continue;

    for (const ing of recipe.ingredients) {
      const key = ing.name.toLowerCase();
      const existing = map.get(key);

      if (existing) {
        // Try to merge quantities with the same unit
        const matchingAmount = existing.amounts.find(
          (a) => a.unit === ing.unit
        );
        if (matchingAmount) {
          matchingAmount.quantity += ing.quantity;
        } else {
          existing.amounts.push({ quantity: ing.quantity, unit: ing.unit });
        }
        if (!existing.recipes.includes(recipe.title)) {
          existing.recipes.push(recipe.title);
        }
        if (ing.notes && !existing.notes.includes(ing.notes)) {
          existing.notes.push(ing.notes);
        }
      } else {
        map.set(key, {
          name: ing.name,
          amounts: [{ quantity: ing.quantity, unit: ing.unit }],
          recipes: [recipe.title],
          notes: ing.notes ? [ing.notes] : [],
        });
      }
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

export default function ShoppingListPage() {
  const { starredRecipes, isMounted } = useStarredRecipes();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const ingredients = useMemo(
    () => aggregateIngredients(starredRecipes),
    [starredRecipes]
  );

  const toggleItem = (name: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const clearAll = () => setCheckedItems(new Set());
  const checkAll = () =>
    setCheckedItems(new Set(ingredients.map((i) => i.name.toLowerCase())));

  const checkedCount = checkedItems.size;
  const totalCount = ingredients.length;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  if (!isMounted) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Paper level={1} className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
            <div className="space-y-3 mt-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl"
                />
              ))}
            </div>
          </div>
        </Paper>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Paper level={1} className="p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <span className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
          </span>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Shopping List
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Combined ingredients from{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {starredRecipes.length}
          </span>{" "}
          starred {starredRecipes.length === 1 ? "recipe" : "recipes"}
        </p>

        {starredRecipes.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 mb-2">
              No starred recipes yet.
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Star some recipes to build your shopping list.
            </p>
            <Link
              href="/"
              unstyled
              className="inline-block mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold no-underline hover:bg-blue-700 transition-colors shadow-sm"
            >
              Browse Recipes
            </Link>
          </div>
        ) : (
          <>
            {/* Progress bar + actions */}
            <div className="mb-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>
                  {checkedCount} of {totalCount} items checked
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={checkAll}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    aria-label="Check all items"
                  >
                    <Check className="w-3.5 h-3.5" />
                    All
                  </button>
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    aria-label="Reset all items"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                </div>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Ingredient checklist */}
            <ul className="space-y-1">
              {ingredients.map((item) => {
                const isChecked = checkedItems.has(item.name.toLowerCase());
                return (
                  <li key={item.name.toLowerCase()}>
                    <label
                      className={`flex items-start gap-4 p-3 rounded-xl cursor-pointer transition-all border group ${
                        isChecked
                          ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30"
                          : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:border-slate-100 dark:hover:border-slate-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleItem(item.name.toLowerCase())}
                        className="mt-0.5 w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500 dark:focus:ring-emerald-500 accent-emerald-600 dark:accent-emerald-500 cursor-pointer transition-transform group-active:scale-90 flex-shrink-0"
                      />
                      <div
                        className={`flex-1 transition-opacity duration-300 ${
                          isChecked ? "opacity-50" : "opacity-100"
                        }`}
                      >
                        <p
                          className={`text-slate-700 dark:text-slate-300 ${
                            isChecked ? "line-through" : ""
                          }`}
                        >
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {item.amounts
                              .map(
                                (a) =>
                                  `${formatMeasurement(a.quantity)} ${a.unit}`
                              )
                              .join(" + ")}{" "}
                          </span>
                          {item.name}
                        </p>
                        {item.notes.length > 0 && !isChecked && (
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 italic">
                            {item.notes.join("; ")}
                          </p>
                        )}
                        {item.recipes.length > 1 && !isChecked && (
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                            Used in: {item.recipes.join(", ")}
                          </p>
                        )}
                      </div>
                    </label>
                  </li>
                );
              })}
            </ul>

            {/* Starred recipes summary */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                Recipes Included
              </h3>
              <div className="flex flex-wrap gap-2">
                {starredRecipes.map((title) => (
                  <Link
                    key={title}
                    href={`/recipes/${title.toLowerCase().replace(/ /g, "-")}`}
                    unstyled
                    className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-medium no-underline border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {title}
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </Paper>
    </div>
  );
}
