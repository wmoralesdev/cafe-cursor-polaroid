import { clsx } from "clsx";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import React, { useState, useRef, useCallback, useMemo } from "react";
import { useLanguage } from "@/contexts/language-context";

interface PolaroidImageProps {
  image: string | null;
  editable?: boolean;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearImage?: () => void;
  error?: string | null;
  zoom?: number;
  position?: { x: number; y: number };
  imageFilter?: string;
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
  imageFilter,
}: PolaroidImageProps) {
  const { t } = useLanguage();
  const [isDragOver, setIsDragOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

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

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
  }, []);

  // Calculate the image styles for proper zoom and pan behavior
  const imageStyles = useMemo(() => {
    if (!imageDimensions) {
      // Fallback before image loads - use object-fit cover
      return {
        width: "100%",
        height: "100%",
        objectFit: "cover" as const,
        transform: "none",
      };
    }

    const imgAspect = imageDimensions.width / imageDimensions.height;
    
    // For cover behavior:
    // - Landscape (aspect > 1): height fills container, width overflows
    // - Portrait (aspect < 1): width fills container, height overflows
    // - Square (aspect = 1): both fill exactly
    
    // Calculate how much the image overflows the container after scaling
    // For a landscape image: width overflows by (aspect * zoom - 1) of container
    // For a portrait image: height overflows by ((1/aspect) * zoom - 1) of container
    const scaledWidth = imgAspect >= 1 ? imgAspect * zoom : zoom;
    const scaledHeight = imgAspect >= 1 ? zoom : (1 / imgAspect) * zoom;
    
    // Maximum pan is half the overflow (so image edge reaches container edge)
    const maxPanX = Math.max(0, (scaledWidth - 1) / 2);
    const maxPanY = Math.max(0, (scaledHeight - 1) / 2);
    
    // Convert slider position [-150, 150] to actual pan offset
    // Position is in percentage of container size
    const panX = (position.x / 150) * maxPanX * 100;
    const panY = (position.y / 150) * maxPanY * 100;

    return {
      // Set the constraining dimension to 100%, other to auto
      width: imgAspect >= 1 ? "auto" : "100%",
      height: imgAspect >= 1 ? "100%" : "auto",
      objectFit: "contain" as const,
      transform: `translate(calc(-50% + ${panX}%), calc(-50% + ${panY}%)) scale(${zoom})`,
    };
  }, [imageDimensions, zoom, position]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        "aspect-[4/3] w-full bg-card-01 rounded-sm overflow-hidden relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] border border-border/20 transition-colors shrink-0",
        editable && "group cursor-pointer",
        isDragOver && "bg-accent/10 border-accent"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {image ? (
        <div className="w-full h-full relative overflow-hidden">
          <img
            src={image}
            alt="Polaroid shot"
            onLoad={handleImageLoad}
            className="absolute top-1/2 left-1/2 transition-transform origin-center will-change-transform"
            style={{
              width: imageStyles.width,
              height: imageStyles.height,
              objectFit: imageStyles.objectFit,
              transform: imageStyles.transform,
              filter: imageFilter || "contrast(1.05) saturate(1.05)",
            }}
          />
          
          <div className="absolute inset-0 bg-radial-gradient-to-tr from-black/10 to-transparent pointer-events-none mix-blend-multiply" />
          <div className="absolute inset-0 noise-bg opacity-[0.15] mix-blend-overlay pointer-events-none" />

          {editable && clearImage && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearImage();
              }}
              className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-accent hover:bg-accent/10 hover:scale-110 transition-all shadow-sm opacity-0 group-hover:opacity-100 z-20"
              title={t.imageUpload.removeImage}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className={clsx(
          "absolute inset-0 flex flex-col items-center justify-center text-fg-muted/60 p-4 text-center transition-colors",
          isDragOver ? "bg-accent/5 text-accent" : "bg-card-02/30"
        )}>
          {editable ? (
            <>
              <div className={clsx(
                "w-12 h-12 mb-3 flex items-center justify-center rounded-full border border-current transition-transform duration-300",
                isDragOver ? "scale-110 rotate-3" : "group-hover:scale-110 group-hover:rotate-2"
              )}>
                <Upload className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium uppercase tracking-wider font-display">
                {isDragOver ? t.imageUpload.perfect : t.imageUpload.showBestSide}
              </span>
              <span className="text-[10px] font-mono mt-1 opacity-60 uppercase">
                {t.imageUpload.dropHere}
              </span>
              {error && (
                <p className="mt-2 text-[10px] text-white font-bold bg-accent px-2 py-0.5 rounded uppercase">
                  {error}
                </p>
              )}
            </>
          ) : (
            <>
              <ImageIcon className="w-12 h-12 mb-2 opacity-50" strokeWidth={1.5} />
              <span className="text-sm font-medium font-display text-lg">{t.imageUpload.noImage}</span>
            </>
          )}
        </div>
      )}

      {editable && onFileChange && (
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={onFileChange}
          accept="image/*"
          title=""
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none mix-blend-soft-light z-0" />
    </div>
  );
}
