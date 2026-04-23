import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Recipe",
};

export default function NewRecipeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
