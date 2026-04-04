import Link from "next/link";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <>
      <Link href="/">Back to recipes</Link>
      <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", margin: "1rem 0" }}>
        {title}
      </h1>
    </>
  );
}
