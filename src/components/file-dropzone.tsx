"use client";

import { useCallback, useState } from "react";
import { Upload } from "lucide-react";

interface FileDropzoneProps {
  onFile: (file: File) => void;
  accept?: string;
}

export function FileDropzone({ onFile, accept = "image/*" }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFile(file);
    },
    [onFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFile(file);
    },
    [onFile]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`glass glass-hover flex flex-col items-center justify-center p-12 cursor-pointer transition-all ${
        isDragging ? "border-purple-400 bg-purple-500/10" : ""
      }`}
    >
      <Upload className="w-12 h-12 text-purple-400 mb-4" />
      <p className="text-lg mb-2">Arraste uma imagem aqui</p>
      <p className="text-sm text-white/50 mb-4">ou clique para selecionar</p>
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
      <p className="text-xs text-white/30">Máximo 5MB</p>
    </div>
  );
}
