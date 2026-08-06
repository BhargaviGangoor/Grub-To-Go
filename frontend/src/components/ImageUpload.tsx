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
      <h2 className="mb-3.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1d3a2b]/70">
        <span className="h-2.5 w-2.5 rounded-full bg-[#e59b27]"></span>
        I. Visual Reference Inputs (Optional)
      </h2>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center rounded-[1.75rem] border-2 border-dashed p-8 transition-all duration-200 bg-white/80 ${
          isDragActive
            ? "border-[#e59b27] bg-[#fff7ea] scale-[1.01]"
            : "border-[#e9e5da] hover:border-[#1d3a2b]/30"
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
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1d3a2b]/10 transition-all duration-200 group-hover:scale-105 group-hover:bg-[#1d3a2b]/15">
              <svg
                className="h-8 w-8 text-[#1d3a2b]"
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
            <p className="mb-1 text-base font-semibold text-[#1d3a2b]">
              Drag and drop reference images here, or <span className="text-[#e59b27] hover:underline">browse files</span>
            </p>
            <p className="text-xs font-semibold text-[#1d3a2b]/52">
              Accepts PNG, JPG, or WEBP (Max 3, up to 5MB each)
            </p>
          </div>
        ) : (
          <div className="w-full">
            <div className="grid grid-cols-3 gap-4 mb-6">
              {images.map((img) => (
                <div key={img.id} className="relative group aspect-square overflow-hidden rounded-2xl border border-[#e9e5da] bg-[#faf7f0]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt="Inspiration thumbnail"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={() => removeImage(img.id)}
                    className="absolute right-2 top-2 rounded-full bg-red-800/80 p-1.5 text-white opacity-0 transition-all duration-200 hover:scale-105 group-hover:opacity-100 hover:bg-red-900"
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
                  className="group flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#e9e5da] bg-white/70 transition-colors duration-200 hover:border-[#1d3a2b]/30"
                >
                  <svg
                    className="h-6 w-6 text-[#1d3a2b]/35 transition-colors duration-200 group-hover:text-[#1d3a2b]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="mt-2 text-xs font-semibold text-[#1d3a2b]/58">Add more</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-[#e9e5da] pt-4 text-xs font-semibold text-[#1d3a2b]/52">
              <span>{images.length} of 3 reference images loaded</span>
              <button
                onClick={() => {
                  images.forEach(img => URL.revokeObjectURL(img.url));
                  setImages([]);
                  if (onImagesChange) onImagesChange([]);
                }}
                className="font-semibold text-[#1d3a2b] transition-colors hover:text-red-700"
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
