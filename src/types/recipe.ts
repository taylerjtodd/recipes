export interface Recipe {
  title: string;
  category: string;
  tags: string[];
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  steps: string[];
  servings: number;
  serving_size: number;
  serving_size_units: string;
}
