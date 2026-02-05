"use client";

import { uploadProjectImage } from "@/app/actions/project";
import { CheckCircle2, UploadCloud } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

export default function ImageUpload({
  onUploadComplete,
  inputId,
}: { onUploadComplete: (url: string) => void; inputId?: string }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resolvedInputId = inputId || "image-upload";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setPreview(base64);
      setIsUploading(true);
      setError(null);

      const result = await uploadProjectImage(base64);
      setIsUploading(false);

      if (result.error) {
        setError(result.error);
      } else if (result.imageUrl) {
        setUploadedUrl(result.imageUrl);
        onUploadComplete(result.imageUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={isUploading}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative group h-40 glass-morphism rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden ${
          error
            ? "border-red-500/50"
            : uploadedUrl
              ? "border-emerald-500/50"
              : "border-white/10 hover:border-primary/50"
        }`}
      >
        {preview ? (
          <>
            <Image
              src={preview}
              alt="Preview"
              fill
              className={`object-cover ${isUploading ? "opacity-50" : "opacity-100"}`}
            />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-bold text-white uppercase tracking-widest">
                    Uploading...
                  </span>
                </div>
              </div>
            )}
            {!isUploading && !uploadedUrl && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-bold text-white uppercase tracking-widest">
                  Change Image
                </span>
              </div>
            )}
            {uploadedUrl && (
              <div className="absolute top-2 right-2 p-1.5 bg-emerald-500 rounded-full shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-6">
            <UploadCloud className="w-10 h-10 text-white/20 mx-auto mb-2 group-hover:text-primary/50 transition-colors" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Click to upload cover image
            </p>
          </div>
        )}
        <input
          id={resolvedInputId}
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="sr-only"
          accept="image/*"
        />
      </button>
      {error && (
        <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest text-center">
          {error}
        </p>
      )}
      {uploadedUrl && (
        <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest text-center">
          Image uploaded successfully!
        </p>
      )}
    </div>
  );
}
