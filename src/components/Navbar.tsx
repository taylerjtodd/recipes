"use client";

import { usePathname } from "next/navigation";
import Link from "@/components/core/Link";
import { SettingsMenu } from "./SettingsMenu";
import React from "react";

export function Navbar() {
  const pathname = usePathname();
  
  // Create breadcrumbs based on pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  
  // Custom mapping for segments to labels
  const getLabel = (segment: string) => {
    if (segment === "new") return "New Recipe";
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
  };

  const breadcrumbs = [
    { label: "My Recipes", href: "/" },
  ];

  let currentPath = "";
  pathSegments.forEach((segment) => {
    // Skip the generic 'recipes' segment if it's just a folder prefix
    if (segment === "recipes") return;
    
    currentPath += `/${segment}`;
    // If we're in the /recipes/ subtree, we need to prefix the href
    const href = pathname.startsWith("/recipes") ? `/recipes${currentPath}` : currentPath;
    
    breadcrumbs.push({
      label: getLabel(segment),
      href: href
    });
  });

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Breadcrumbs Section */}
          <div className="flex items-center space-x-2 text-sm font-medium">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                {index > 0 && (
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-gray-400 dark:text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <Link
                  href={crumb.href}
                  className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                    index === breadcrumbs.length - 1
                      ? "text-gray-900 dark:text-white font-bold"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {crumb.label}
                </Link>
              </React.Fragment>
            ))}
          </div>

          {/* Right side Section */}
          <div className="flex items-center">
            <SettingsMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
