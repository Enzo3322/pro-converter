"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { FileDropzone } from "@/components/file-dropzone";
import { DownloadButton } from "@/components/download-button";
import { Loader2 } from "lucide-react";

const QUALITY_PRESETS = [
  { label: "Baixa", value: 30 },
  { label: "Média", value: 60 },
  { label: "Alta", value: 80 },
  { label: "Sem perda", value: 100 },
];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function MinifyPage() {
  const [quality, setQuality] = useState(80);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [filename, setFilename] = useState("");

  async function handleFile(file: File) {
    setOriginalPreview(URL.createObjectURL(file));
    setOriginalSize(file.size);
    setFilename(file.name);
    setLoading(true);
    setPreview(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("quality", quality.toString());

      const res = await fetch("/api/minify", { method: "POST", body: formData });

      if (!res.ok) throw new Error("Failed to minify");

      const compressed = Number(res.headers.get("X-Compressed-Size") || 0);
      setCompressedSize(compressed);

      const blob = await res.blob();
      setPreview(URL.createObjectURL(blob));
    } catch {
      alert("Erro ao minificar imagem");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col items-center px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-2">Minificar Imagem</h1>
        <p className="text-white/50 mb-8">Reduza o tamanho sem perder qualidade visual</p>

        <div className="glass p-6 mb-8 w-full max-w-md">
          <label className="block text-sm mb-2">
            Qualidade: <span className="text-purple-400 font-bold">{quality}%</span>
          </label>
          <input
            type="range"
            min={10}
            max={100}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-purple-500 mb-4"
          />
          <div className="flex gap-2">
            {QUALITY_PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => setQuality(p.value)}
                className={`flex-1 py-2 text-xs rounded-lg transition-all ${
                  quality === p.value
                    ? "bg-purple-500/30 border border-purple-400"
                    : "glass glass-hover"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full max-w-md mb-8 relative">
          <FileDropzone onFile={handleFile} />
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-purple-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            Processando...
          </div>
        )}

        {preview && (
          <div className="w-full max-w-2xl">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="glass p-4 text-center">
                <p className="text-sm text-white/50 mb-1">Original</p>
                <p className="text-lg font-bold">{formatSize(originalSize)}</p>
                {originalPreview && (
                  <img src={originalPreview} alt="Original" className="mt-2 rounded-lg max-h-48 mx-auto" />
                )}
              </div>
              <div className="glass p-4 text-center">
                <p className="text-sm text-white/50 mb-1">Comprimido</p>
                <p className="text-lg font-bold text-green-400">{formatSize(compressedSize)}</p>
                <p className="text-xs text-green-400">
                  -{Math.round((1 - compressedSize / originalSize) * 100)}%
                </p>
                <img src={preview} alt="Compressed" className="mt-2 rounded-lg max-h-48 mx-auto" />
              </div>
            </div>
            <div className="text-center">
              <DownloadButton url={preview} filename={`minified-${filename}`} />
            </div>
          </div>
        )}
      </main>
    </>
  );
}
