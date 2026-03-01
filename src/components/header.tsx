import Link from "next/link";
import { ImageIcon } from "lucide-react";

export function Header() {
  return (
    <header className="glass fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 text-xl font-bold">
        <ImageIcon className="w-6 h-6 text-purple-400" />
        Pro Converter
      </Link>
      <nav className="flex gap-4 text-sm">
        <Link href="/minify" className="hover:text-purple-300 transition-colors">
          Minificar
        </Link>
        <Link href="/convert" className="hover:text-purple-300 transition-colors">
          Converter
        </Link>
        <Link href="/remove-bg" className="hover:text-purple-300 transition-colors">
          Remover Fundo
        </Link>
      </nav>
    </header>
  );
}
