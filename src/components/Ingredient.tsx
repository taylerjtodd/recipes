import { Ingredient as IngredientType } from "@/types/recipe";
import { formatMeasurement } from "@/utils/formatters";
import { UnitSystem, convertForSystem, getCompatibleUnits, convertUnit } from "@/utils/units";
import { useState, useEffect } from "react";

const Ingredient = ({ 
    ingredient, 
    scaleFactor, 
    unitSystem 
}: { 
    ingredient: IngredientType, 
    scaleFactor: number,
    unitSystem: UnitSystem
}) => {
    const [isChecked, setChecked] = useState(false);
    const [manualUnit, setManualUnit] = useState<string | null>(null);

    // Reset manual unit if the system returns to original
    useEffect(() => {
        if (unitSystem === 'original') {
            setManualUnit(null);
        }
    }, [unitSystem]);
    
    let { quantity: displayQuantity, unit: displayUnit } = convertForSystem(ingredient.quantity, ingredient.unit, unitSystem);

    if (manualUnit) {
        displayUnit = manualUnit;
        displayQuantity = convertUnit(ingredient.quantity, ingredient.unit, manualUnit);
    }

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
                        {formatMeasurement(displayQuantity * scaleFactor)}{" "}
                        {getCompatibleUnits(displayUnit).length > 1 ? (
                            <select 
                                value={displayUnit}
                                onChange={(e) => setManualUnit(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-transparent border-none p-0 pr-1 font-bold text-slate-900 dark:text-slate-100 focus:ring-0 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 underline decoration-dotted decoration-slate-300 dark:decoration-slate-600 underline-offset-4 transition-colors appearance-none inline-block text-center"
                                title="Change unit"
                            >
                                {getCompatibleUnits(displayUnit).map(u => (
                                    <option key={u.id} value={u.id} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                                        {u.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            displayUnit
                        )}
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