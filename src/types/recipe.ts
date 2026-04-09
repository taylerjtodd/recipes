export interface Recipe {
  title: string;
  category: string;
  tags: string[];
  ingredients: {
    key?: string;
    name: string;
    quantity: number;
    unit: string;
  }[];
  steps: string[];
  servings: number;
  serving_size: number;
  serving_size_units: string;
}

export const COMMON_UNITS = [
  "g",
  "kg",
  "mg",
  "oz",
  "lb",
  "tsp",
  "tbsp",
  "fl oz",
  "cup",
  "pt",
  "qt",
  "gal",
  "ml",
  "l",
  "pinch",
  "dash",
  "clove",
  "slice",
  "piece",
  "whole"
];
