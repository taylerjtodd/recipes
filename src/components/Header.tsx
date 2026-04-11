import Link from "next/link";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <>
      <Link href="/">Back to recipes</Link>
      <h1 className="text-4xl font-bold my-4">
        {title}
      </h1>
    </>
  );
}
