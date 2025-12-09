import { forwardRef } from "react";
import { clsx } from "clsx";
import type { CursorProfile } from "@/types/form";
import { polaroidThemes } from "@/constants/polaroid-themes";
import { POLAROID_WIDTH_PX, POLAROID_HEIGHT_PX } from "@/constants/print-dimensions";
import { PolaroidImage } from "./polaroid-image";
import { PolaroidCaption } from "./polaroid-caption";
import { ThemePattern } from "./theme-pattern";
import { TapeStrip } from "./tape-strip";

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
  source?: string | null;
}

export const PolaroidCard = forwardRef<HTMLDivElement, PolaroidCardProps>(
  (
    {
      image,
      profile,
      className,
      variant = "preview",
      onDrop,
      onFileChange,
      clearImage,
      error,
      zoom,
      position,
      source,
    },
    ref
  ) => {
    const rawTheme = profile.polaroidTheme ?? "classic";
    // Fallback to classic if theme was removed (e.g. "vintage")
    const theme = polaroidThemes[rawTheme] ? rawTheme : "classic";
    const config = polaroidThemes[theme];

    return (
      <div className="relative">
        {variant === "preview" && (
          <>
            <TapeStrip position="top-left" variant={variant} theme={theme} />
            <TapeStrip position="top-right" variant={variant} theme={theme} />
          </>
        )}

        <div
          ref={ref}
          className={clsx(
            "bg-white transition-all duration-500 ease-out transform origin-center paper-texture relative polaroid-card-light",
            variant === "preview" && [
              "hover:scale-[1.01] hover:rotate-1",
              "w-full pt-5 px-3 pb-3 shadow-polaroid flex flex-col",
            ],
            variant === "export" && [
              "pt-5 px-3 pb-3 shadow-polaroid flex flex-col",
            ],
            className
          )}
          style={{
            width: variant === "preview" ? undefined : POLAROID_WIDTH_PX,
            maxWidth: variant === "preview" ? POLAROID_WIDTH_PX : undefined,
            height: POLAROID_HEIGHT_PX,
            backgroundColor: "#ffffff",
          }}
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
            imageFilter={config.imageFilter}
          />
          <PolaroidCaption profile={profile} source={source} />
          <ThemePattern theme={theme} />
        </div>
      </div>
    );
  }
);

PolaroidCard.displayName = "PolaroidCard";

export { PolaroidCard as PolaroidPreview };
