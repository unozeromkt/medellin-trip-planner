"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, Loader2, X, FileText } from "lucide-react";

interface PaymentProofUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function PaymentProofUpload({ value, onChange }: PaymentProofUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      const isImage = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf";
      if (!isImage && !isPdf) {
        setError("Solo se permiten imágenes o archivos PDF.");
        return;
      }
      setUploading(true);
      setError("");
      try {
        const fd = new FormData();
        fd.append("file", file, file.name);
        const res = await fetch("/api/upload/payment-proof", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Error al subir");
        setFileName(file.name);
        onChange(data.url as string);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Error al subir el comprobante");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const isPdfUrl = value.toLowerCase().endsWith(".pdf");

  return (
    <div>
      {value ? (
        <div className="relative w-full rounded-xl overflow-hidden bg-[#F1F3F6] border border-[#E2E8ED] group">
          {isPdfUrl ? (
            <div className="flex items-center gap-3 px-4 py-6">
              <FileText className="w-8 h-8 text-[#2BB7A6] shrink-0" />
              <span className="text-sm font-body text-[#0D1B3D] truncate">{fileName || "Comprobante.pdf"}</span>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Comprobante de pago" className="w-full max-h-64 object-contain bg-white" />
          )}
          <button
            type="button"
            onClick={() => {
              onChange("");
              setFileName("");
            }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full py-8 rounded-xl border-2 border-dashed border-[#E2E8ED] hover:border-[#2BB7A6] bg-[#F8FAFC] hover:bg-[#2BB7A6]/5 transition-colors flex flex-col items-center justify-center gap-2 text-[#9DAAB5] hover:text-[#2BB7A6] disabled:opacity-60"
        >
          {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
          <span className="text-sm font-body">
            {uploading ? "Subiendo comprobante..." : "Haz clic para subir el comprobante"}
          </span>
          <span className="text-xs">JPG, PNG o PDF · Máx 10MB</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      {error && <p className="text-xs text-red-600 font-body mt-1">{error}</p>}
    </div>
  );
}
