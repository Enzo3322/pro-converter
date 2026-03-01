import { Download } from "lucide-react";

interface DownloadButtonProps {
  url: string;
  filename: string;
}

export function DownloadButton({ url, filename }: DownloadButtonProps) {
  return (
    <a
      href={url}
      download={filename}
      className="glass glass-hover inline-flex items-center gap-2 px-6 py-3 text-purple-300 font-medium"
    >
      <Download className="w-5 h-5" />
      Baixar
    </a>
  );
}
