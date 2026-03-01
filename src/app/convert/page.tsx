"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { FileDropzone } from "@/components/file-dropzone";
import { DownloadButton } from "@/components/download-button";
import { Loader2 } from "lucide-react";

const FORMATS = ["png", "jpg", "webp", "avif"] as const;

export default function ConvertPage() {
  const [format, setFormat] = useState<string>("webp");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [filename, setFilename] = useState("");

  async function handleFile(file: File) {
    setLoading(true);
    setPreview(null);
    const baseName = file.name.replace(/\.[^.]+$/, "");
    setFilename(`${baseName}.${format}`);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("format", format);

      const res = await fetch("/api/convert", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to convert");

      const blob = await res.blob();
      setPreview(URL.createObjectURL(blob));
    } catch {
      alert("Erro ao converter imagem");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col items-center px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-2">Converter Imagem</h1>
        <p className="text-white/50 mb-8">Converta entre PNG, JPG, WebP e AVIF</p>

        <div className="glass p-6 mb-8 w-full max-w-md">
          <label className="block text-sm mb-3">Converter para:</label>
          <div className="flex gap-2">
            {FORMATS.map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`flex-1 py-3 text-sm font-mono rounded-lg uppercase transition-all ${
                  format === f
                    ? "bg-green-500/30 border border-green-400 text-green-300"
                    : "glass glass-hover"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full max-w-md mb-8 relative">
          <FileDropzone onFile={handleFile} />
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-green-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            Convertendo...
          </div>
        )}

        {preview && (
          <div className="text-center">
            <div className="glass p-4 mb-6 inline-block">
              <img src={preview} alt="Converted" className="rounded-lg max-h-64" />
            </div>
            <div>
              <DownloadButton url={preview} filename={filename} />
            </div>
          </div>
        )}
      </main>
    </>
  );
}
