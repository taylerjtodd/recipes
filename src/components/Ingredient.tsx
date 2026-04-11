import { Ingredient as IngredientType } from "@/types/recipe";
import { formatMeasurement } from "@/utils/formatters";
import { useState } from "react";

const Ingredient = ({ ingredient, scaleFactor }: { ingredient: IngredientType, scaleFactor: number }) => {
    const [isChecked, setChecked] = useState(false);

    return (
        <li className={isChecked ? "px-1 py-0" : "p-1"}>
            <label className={`flex items-center gap-4 ${isChecked ? "px-2 py-1" : "p-2"} rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700 group cursor-pointer w-full`}>
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setChecked(!isChecked)}
                    className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-500 accent-indigo-600 dark:accent-indigo-500 cursor-pointer transition-transform group-active:scale-90 flex-shrink-0"
                />
                <p className={`text-slate-700 dark:text-slate-300 transition-all duration-300 ${isChecked ? 'opacity-50' : 'opacity-100'}`}>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                        {formatMeasurement(ingredient.quantity * scaleFactor)} {ingredient.unit}
                    </span>{" "}
                    {ingredient.name}
                    {!isChecked && ingredient.notes && (
                        <span className="text-slate-500 dark:text-slate-400 ml-1 italic text-sm">({ingredient.notes})</span>
                    )}
                </p>
            </label>
        </li>
    )
};

export default Ingredient;