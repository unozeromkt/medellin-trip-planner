"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { Upload, Loader2, X, Images } from "lucide-react";

const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

type LibraryImage = { name: string; url: string; createdAt: string };

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}

export function ImageUpload({ label, value, onChange, hint }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Solo se permiten imágenes.");
        return;
      }
      setUploading(true);
      setError("");
      try {
        const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
        const fd = new FormData();
        fd.append("file", compressed, file.name);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Error al subir");
        onChange(data.url as string);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Error al subir imagen");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-body font-medium text-[#0D1B3D]">{label}</label>
        <button
          type="button"
          onClick={() => setLibraryOpen(true)}
          className="flex items-center gap-1.5 text-xs font-body font-semibold text-[#2BB7A6] hover:text-[#2BB7A6]/80"
        >
          <Images className="w-3.5 h-3.5" /> Elegir de subidas anteriores
        </button>
      </div>
      {hint && <p className="text-xs text-[#9DAAB5] font-body mb-2">{hint}</p>}

      {value ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#F1F3F6] group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
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
          className="w-full aspect-video rounded-xl border-2 border-dashed border-[#E2E8ED] hover:border-[#2BB7A6] bg-[#F8FAFC] hover:bg-[#2BB7A6]/5 transition-colors flex flex-col items-center justify-center gap-2 text-[#9DAAB5] hover:text-[#2BB7A6] disabled:opacity-60"
        >
          {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
          <span className="text-sm font-body">
            {uploading ? "Comprimiendo y subiendo..." : "Haz clic o arrastra una imagen"}
          </span>
          <span className="text-xs">JPG, PNG, WebP · Máx 15MB · Se comprime automáticamente</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      {error && <p className="text-xs text-red-600 font-body mt-1">{error}</p>}

      {libraryOpen && (
        <ImageLibraryModal
          onClose={() => setLibraryOpen(false)}
          onSelect={(url) => {
            onChange(url);
            setLibraryOpen(false);
          }}
        />
      )}
    </div>
  );
}

function ImageLibraryModal({ onClose, onSelect }: { onClose: () => void; onSelect: (url: string) => void }) {
  const [images, setImages] = useState<LibraryImage[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/upload/list")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setImages(data.images as LibraryImage[]);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Error al cargar la galería"));
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8ED]">
          <span className="font-heading text-sm font-bold text-[#0D1B3D]">Imágenes subidas anteriormente</span>
          <button type="button" onClick={onClose} className="text-[#637489] hover:text-[#0D1B3D]">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto">
          {error && <p className="text-sm text-red-600 font-body">{error}</p>}
          {!error && images === null && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-[#9DAAB5]" />
            </div>
          )}
          {images?.length === 0 && (
            <p className="text-sm text-[#9DAAB5] font-body text-center py-12">Aún no hay imágenes subidas.</p>
          )}
          {images && images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img) => (
                <button
                  key={img.name}
                  type="button"
                  onClick={() => onSelect(img.url)}
                  className="relative aspect-square rounded-lg overflow-hidden bg-[#F1F3F6] hover:ring-2 hover:ring-[#2BB7A6] transition-all"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
