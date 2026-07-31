"use client";

import { useState, useEffect } from "react";

export function useStarredRecipes() {
  const [starredRecipes, setStarredRecipes] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem("starredRecipes");
    if (stored) {
      try {
        setStarredRecipes(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse starred recipes from local storage", e);
      }
    }
  }, []);

  const toggleStar = (title: string) => {
    setStarredRecipes((prev) => {
      let newStarred;
      if (prev.includes(title)) {
        newStarred = prev.filter((t) => t !== title);
      } else {
        newStarred = [...prev, title];
      }
      localStorage.setItem("starredRecipes", JSON.stringify(newStarred));
      // Dispatch a custom event so other components (like the Navbar) can listen to changes
      window.dispatchEvent(new Event('starredRecipesChanged'));
      return newStarred;
    });
  };

  const isStarred = (title: string) => {
    return starredRecipes.includes(title);
  };

  // We add an effect to listen for changes from other components
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("starredRecipes");
      if (stored) {
        try {
          setStarredRecipes(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse starred recipes from local storage", e);
        }
      } else {
         setStarredRecipes([]);
      }
    };

    window.addEventListener('starredRecipesChanged', handleStorageChange);
    // Also listen for storage event for cross-tab synchronization
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('starredRecipesChanged', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    starredRecipes,
    toggleStar,
    isStarred,
    isMounted,
  };
}
