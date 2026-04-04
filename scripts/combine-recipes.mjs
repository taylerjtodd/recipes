import fs from "fs";
import path from "path";

const recipesDir = path.join(process.cwd(), "src/data/recipes");
const outputFile = path.join(process.cwd(), "src/data/recipes.json");

const combineRecipes = () => {
  const recipeFiles = fs
    .readdirSync(recipesDir)
    .filter((file) => path.extname(file) === ".json");

  const recipes = recipeFiles.flatMap((file) => {
    const filePath = path.join(recipesDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent);
  });

  fs.writeFileSync(outputFile, JSON.stringify(recipes, null, 2));
  console.log(`Successfully combined ${recipeFiles.length} recipes into ${outputFile}`);
};

combineRecipes();
