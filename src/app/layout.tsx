import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pro Converter",
  description: "Minify, convert, and remove backgrounds from images",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <div className="flex-1">{children}</div>
        <footer className="py-4 text-center text-sm text-white/40">
          Developed by{" "}
          <a href="https://spag.dev" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">
            spag.dev
          </a>
        </footer>
      </body>
    </html>
  );
}
