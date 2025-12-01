import { forwardRef } from "react";
import { clsx } from "clsx";
import type { CursorProfile } from "@/types/form";
import { PolaroidImage } from "./polaroid-image";
import { PolaroidCaption } from "./polaroid-caption";

interface PolaroidCardProps {
  image: string | null;
  profiles: CursorProfile[];
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
          "bg-white transition-all duration-500 ease-out transform origin-center paper-texture",
          // Variant specific sizing
          variant === "preview" && [
            "hover:scale-[1.01] hover:rotate-1",
            "w-full aspect-[2/3] max-w-[340px]", // 2:3 aspect ratio
            "p-3 pb-12", // Reduced padding for larger image, classic bottom space
            "shadow-polaroid"
          ],
          variant === "export" && [
             "w-[4in] h-[6in]", // 2:3 ratio (4x6 inches)
             "p-[0.15in] pb-[0.6in]", // Scaled padding to match preview proportions
          ],
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
