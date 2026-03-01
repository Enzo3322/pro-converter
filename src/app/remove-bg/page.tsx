"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { FileDropzone } from "@/components/file-dropzone";
import { DownloadButton } from "@/components/download-button";
import { Loader2 } from "lucide-react";

export default function RemoveBgPage() {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [filename, setFilename] = useState("");

  async function handleFile(file: File) {
    setOriginalPreview(URL.createObjectURL(file));
    setFilename(`no-bg-${file.name.replace(/\.[^.]+$/, "")}.png`);
    setLoading(true);
    setPreview(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/remove-bg", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to remove background");

      const blob = await res.blob();
      setPreview(URL.createObjectURL(blob));
    } catch {
      alert("Erro ao remover fundo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col items-center px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-2">Remover Fundo</h1>
        <p className="text-white/50 mb-8">Remova o fundo de qualquer imagem automaticamente</p>

        <div className="w-full max-w-md mb-8 relative">
          <FileDropzone onFile={handleFile} />
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-pink-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            Removendo fundo... (pode levar alguns segundos)
          </div>
        )}

        {preview && (
          <div className="w-full max-w-2xl">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="glass p-4 text-center">
                <p className="text-sm text-white/50 mb-2">Original</p>
                {originalPreview && (
                  <img src={originalPreview} alt="Original" className="rounded-lg max-h-64 mx-auto" />
                )}
              </div>
              <div className="glass p-4 text-center">
                <p className="text-sm text-white/50 mb-2">Sem Fundo</p>
                <div
                  className="inline-block rounded-lg overflow-hidden"
                  style={{
                    backgroundImage:
                      "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%)",
                    backgroundSize: "16px 16px",
                  }}
                >
                  <img src={preview} alt="No background" className="max-h-64" />
                </div>
              </div>
            </div>
            <div className="text-center">
              <DownloadButton url={preview} filename={filename} />
            </div>
          </div>
        )}
      </main>
    </>
  );
}
