import { forwardRef } from "react";
import { clsx } from "clsx";
import type { CursorProfile } from "@/types/form";
import { PolaroidImage } from "./polaroid-image";
import { PolaroidCaption } from "./polaroid-caption";

interface PolaroidCardProps {
  image: string | null;
  profile: CursorProfile;
  className?: string;
  variant?: "preview" | "export";
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearImage?: () => void;
  error?: string | null;
  zoom?: number;
  position?: { x: number; y: number };
}

function TapeStrip({ position, variant }: { position: "top-left" | "top-right"; variant: "preview" | "export" }) {
  const isExport = variant === "export";
  const size = isExport ? "w-8 h-3" : "w-12 h-4";
  const rotation = position === "top-left" ? "-rotate-12" : "rotate-12";
  const placement = position === "top-left" 
    ? (isExport ? "-left-2 -top-1" : "-left-3 -top-1.5")
    : (isExport ? "-right-2 -top-1" : "-right-3 -top-1.5");
  
  return (
    <div 
      className={clsx(
        "absolute z-10",
        size,
        rotation,
        placement,
        "bg-gradient-to-b from-amber-100/90 to-amber-50/80",
        "border border-amber-200/50",
        "shadow-sm",
        "backdrop-blur-[1px]",
        "before:absolute before:inset-0 before:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)]",
        "after:absolute after:inset-0 after:opacity-30 after:bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)]"
      )}
    />
  );
}

export const PolaroidCard = forwardRef<HTMLDivElement, PolaroidCardProps>(
  ({ 
    image, 
    profile, 
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
      <div className="relative">
        {variant === "preview" && (
          <>
            <TapeStrip position="top-left" variant={variant} />
            <TapeStrip position="top-right" variant={variant} />
          </>
        )}
        
        <div
          ref={ref}
          className={clsx(
            "bg-white transition-all duration-500 ease-out transform origin-center paper-texture relative polaroid-card-light",
          variant === "preview" && [
            "hover:scale-[1.01] hover:rotate-1",
            "w-full max-w-[340px] h-[510px]",
            "p-3",
            "shadow-polaroid",
            "flex flex-col"
          ],
            variant === "export" && [
               "w-[340px] h-[510px]",
               "p-3",
               "shadow-polaroid",
               "flex flex-col",
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
          <PolaroidCaption profile={profile} />
        </div>
      </div>
    );
  }
);

PolaroidCard.displayName = "PolaroidCard";

export { PolaroidCard as PolaroidPreview };
