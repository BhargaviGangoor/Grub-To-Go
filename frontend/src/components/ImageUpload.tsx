import { useState, useRef } from "react";

interface ImageUploadProps {
  onImagesChange?: (files: File[]) => void;
}

export default function ImageUpload({ onImagesChange }: ImageUploadProps) {
  const [images, setImages] = useState<{ id: string; url: string; file: File }[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (files: FileList | null) => {
    if (!files) return;

    const validFiles: { id: string; url: string; file: File }[] = [];
    const maxFilesAllowed = 3;

    const remainingSlots = maxFilesAllowed - images.length;
    if (remainingSlots <= 0) {
      alert("You can upload a maximum of 3 reference images.");
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      if (file.type.startsWith("image/")) {
        validFiles.push({
          id: Math.random().toString(36).substring(7),
          url: URL.createObjectURL(file),
          file: file,
        });
      }
    });

    if (validFiles.length > 0) {
      const updatedImages = [...images, ...validFiles];
      setImages(updatedImages);
      if (onImagesChange) {
        onImagesChange(updatedImages.map((img) => img.file));
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    processFiles(e.dataTransfer.files);
  };

  const removeImage = (id: string) => {
    const updatedImages = images.filter((img) => img.id !== id);
    const removed = images.find((img) => img.id === id);
    if (removed) URL.revokeObjectURL(removed.url);

    setImages(updatedImages);
    if (onImagesChange) {
      onImagesChange(updatedImages.map((img) => img.file));
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xs font-bold text-brand/80 mb-3.5 uppercase tracking-wider flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-brand"></span>
        I. Visual Reference Inputs (Optional)
      </h2>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-200 border-2 border-dashed bg-white ${
          isDragActive
            ? "border-brand-orange bg-brand-cream/50 scale-[1.01]"
            : "border-zinc-200 hover:border-brand/40"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept="image/*"
          onChange={(e) => processFiles(e.target.files)}
        />

        {images.length === 0 ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center cursor-pointer text-center group"
          >
            <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-all duration-200 group-hover:scale-105">
              <svg
                className="w-8 h-8 text-brand"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-brand font-bold text-base mb-1">
              Drag and drop reference images here, or <span className="text-brand-orange hover:underline">browse files</span>
            </p>
            <p className="text-xs text-zinc-500 font-semibold">
              Accepts PNG, JPG, or WEBP (Max 3, up to 5MB each)
            </p>
          </div>
        ) : (
          <div className="w-full">
            <div className="grid grid-cols-3 gap-4 mb-6">
              {images.map((img) => (
                <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt="Inspiration thumbnail"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={() => removeImage(img.id)}
                    className="absolute top-2 right-2 p-1.5 bg-red-800/80 hover:bg-red-900 text-white rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-105"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}

              {images.length < 3 && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border border-dashed border-zinc-200 hover:border-brand/40 bg-zinc-50 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 group"
                >
                  <svg
                    className="w-6 h-6 text-zinc-400 group-hover:text-brand transition-colors duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs text-zinc-500 mt-2 font-bold">Add more</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-xs text-zinc-500 border-t border-zinc-100 pt-4 font-semibold">
              <span>{images.length} of 3 reference images loaded</span>
              <button
                onClick={() => {
                  images.forEach(img => URL.revokeObjectURL(img.url));
                  setImages([]);
                  if (onImagesChange) onImagesChange([]);
                }}
                className="text-brand hover:text-red-700 transition-colors font-bold"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
