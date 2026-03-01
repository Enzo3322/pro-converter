import Link from "next/link";
import { Header } from "@/components/header";
import { Minimize2, RefreshCw, Eraser } from "lucide-react";

const tools = [
  {
    title: "Minificar",
    description: "Reduza o tamanho das suas imagens com controle de qualidade",
    icon: Minimize2,
    href: "/minify",
    color: "text-blue-400",
  },
  {
    title: "Converter",
    description: "Converta entre PNG, JPG, WebP e AVIF",
    icon: RefreshCw,
    href: "/convert",
    color: "text-green-400",
  },
  {
    title: "Remover Fundo",
    description: "Remova o fundo de qualquer imagem automaticamente",
    icon: Eraser,
    href: "/remove-bg",
    color: "text-pink-400",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col items-center justify-center px-4 pt-20">
        <h1 className="text-5xl font-bold mb-4 text-center">
          Pro <span className="text-purple-400">Converter</span>
        </h1>
        <p className="text-white/60 text-lg mb-12 text-center max-w-md">
          Minifique, converta e remova fundos de imagens. Tudo no navegador, rapido e gratuito.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href}>
              <div className="glass glass-hover p-8 text-center h-full">
                <tool.icon className={`w-12 h-12 mx-auto mb-4 ${tool.color}`} />
                <h2 className="text-xl font-semibold mb-2">{tool.title}</h2>
                <p className="text-white/50 text-sm">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
