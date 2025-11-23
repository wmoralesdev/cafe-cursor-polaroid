import { clsx } from "clsx";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import React, { useState } from "react";

interface PolaroidImageProps {
  image: string | null;
  editable?: boolean;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearImage?: () => void;
  error?: string | null;
  zoom?: number;
  position?: { x: number; y: number };
}

export function PolaroidImage({
  image,
  editable = false,
  onDrop,
  onFileChange,
  clearImage,
  error,
  zoom = 1,
  position = { x: 0, y: 0 },
}: PolaroidImageProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!editable) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!editable) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!editable) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    onDrop?.(e);
  };

  return (
    <div
      className={clsx(
        "aspect-square w-full bg-card-01 rounded-sm overflow-hidden relative mb-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] border border-black/5 transition-colors",
        editable && "group cursor-pointer",
        isDragOver && "bg-accent/10 border-accent"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Image Area */}
      {image ? (
        <div className="w-full h-full relative overflow-hidden">
          <img
            src={image}
            alt="Polaroid shot"
            className="w-full h-full object-cover filter contrast-[1.05] saturation-[1.05] transition-transform origin-center will-change-transform"
            style={{
              transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
            }}
          />
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-radial-gradient-to-tr from-black/10 to-transparent pointer-events-none mix-blend-multiply" />
          <div className="absolute inset-0 noise-bg opacity-[0.15] mix-blend-overlay pointer-events-none" />

          {/* Clear Button (Only visible in edit mode on hover) */}
          {editable && clearImage && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearImage();
              }}
              className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-red-500 hover:bg-red-50 hover:scale-110 transition-all shadow-md opacity-0 group-hover:opacity-100 z-20"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className={clsx(
          "absolute inset-0 flex flex-col items-center justify-center text-fg/40 p-4 text-center transition-colors",
          isDragOver ? "bg-accent/5 text-accent" : "bg-card-02/30"
        )}>
          {editable ? (
            <>
              <div className={clsx(
                "w-12 h-12 mb-3 flex items-center justify-center rounded-full border-2 border-current transition-transform duration-300",
                isDragOver ? "scale-110" : "group-hover:scale-110"
              )}>
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-sm font-black uppercase tracking-wider">
                {isDragOver ? "Drop it!" : "Add Photo"}
              </span>
              <span className="text-[10px] font-mono mt-1 opacity-60 uppercase">
                Drag & Drop or Click
              </span>
              {error && (
                <p className="mt-2 text-[10px] text-white font-bold bg-red-500 px-2 py-0.5 rounded uppercase">
                  {error}
                </p>
              )}
            </>
          ) : (
            <>
              <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
              <span className="text-sm font-medium font-hand text-lg">No image</span>
            </>
          )}
        </div>
      )}

      {/* File Input Overlay */}
      {editable && onFileChange && (
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={onFileChange}
          accept="image/*"
          title="" // Hide tooltip
        />
      )}

      {/* Glossy reflection */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none mix-blend-soft-light z-0" />
    </div>
  );
}
