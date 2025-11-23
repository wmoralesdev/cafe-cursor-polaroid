import { forwardRef } from "react";
import { clsx } from "clsx";
import type { Profile } from "@/types/form";
import { PolaroidImage } from "./polaroid-image";
import { PolaroidCaption } from "./polaroid-caption";

interface PolaroidCardProps {
  image: string | null;
  profiles: Profile[];
  className?: string;
  variant?: "preview" | "export";
  // Image interaction
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearImage?: () => void;
  error?: string | null;
  // Image transform
  zoom?: number;
  position?: { x: number; y: number };
}

export const PolaroidCard = forwardRef<HTMLDivElement, PolaroidCardProps>(
  ({ 
    image, 
    profiles, 
    className, 
    variant = "preview",
    onDrop,
    onFileChange,
    clearImage,
    error,
    zoom,
    position
  }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "bg-white p-4 pb-8 transition-all duration-500 ease-out transform origin-center",
          // Variant specific sizing
          variant === "preview" && [
            "hover:scale-[1.01] hover:rotate-1",
            "w-full aspect-[3/4] max-w-[420px]", // Responsive preview
            "shadow-[0_20px_40px_-5px_rgba(0,0,0,0.15),0_10px_20px_-5px_rgba(0,0,0,0.1)]"
          ],
          variant === "export" && [
             "w-[3in] h-[4in]", // Physical sizing for export
          ],
          "paper-texture border-4 border-white",
          className
        )}
      >
        <PolaroidImage 
          image={image} 
          editable={variant === "preview"}
          onDrop={onDrop}
          onFileChange={onFileChange}
          clearImage={clearImage}
          error={error}
          zoom={zoom}
          position={position}
        />
        <PolaroidCaption profiles={profiles} />
      </div>
    );
  }
);

PolaroidCard.displayName = "PolaroidCard";

export { PolaroidCard as PolaroidPreview };
