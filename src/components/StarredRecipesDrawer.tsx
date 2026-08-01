"use client";

import { useStarredRecipes } from "@/hooks/useStarredRecipes";
import { Star, ShoppingCart } from "lucide-react";
import Link from "@/components/core/Link";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/core/Drawer";

export function StarredRecipesDrawer() {
  const { starredRecipes, isMounted, toggleStar } = useStarredRecipes();

  if (!isMounted) return null;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button
          disabled={starredRecipes.length === 0}
          className="p-2 mr-2 rounded-full transition-colors shadow-sm border disabled:opacity-40 disabled:cursor-not-allowed bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/40 border-amber-200 dark:border-amber-800 disabled:hover:bg-amber-50 dark:disabled:hover:bg-amber-900/20"
          aria-label="Starred Recipes"
        >
          <Star className="w-5 h-5 fill-current" />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Starred Recipes</DrawerTitle>
            <DrawerDescription>Your favorite recipes saved to your browser.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0 max-h-[60vh] overflow-y-auto">
            {starredRecipes.length === 0 ? (
              <p className="text-center text-sm text-gray-500 my-8">
                No starred recipes yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {starredRecipes.map((title) => (
                  <li key={title} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                    <DrawerClose asChild>
                      <Link
                        href={`/recipes/${title.toLowerCase().replace(/ /g, "-")}`}
                        className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 truncate pr-4 flex-1"
                      >
                        {title}
                      </Link>
                    </DrawerClose>
                    <button
                      onClick={() => toggleStar(title)}
                      className="text-amber-500 hover:text-gray-400 p-1 rounded-md transition-colors"
                      aria-label="Remove from starred"
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Link
                href="/shopping-list"
                unstyled
                className="flex items-center justify-center gap-2 w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white no-underline hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                Shopping List
              </Link>
            </DrawerClose>
            <DrawerClose asChild>
              <button className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200">
                Close
              </button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

