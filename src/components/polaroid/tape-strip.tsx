import { clsx } from "clsx";
import type { PolaroidTheme } from "@/types/form";
import { polaroidThemes } from "@/constants/polaroid-themes";

interface TapeStripProps {
  position: "top-left" | "top-right";
  variant: "preview" | "export";
  theme?: PolaroidTheme;
}

export function TapeStrip({
  position,
  variant,
  theme = "classic",
}: TapeStripProps) {
  const isExport = variant === "export";
  const size = isExport ? "w-8 h-3" : "w-12 h-4";
  const rotation = position === "top-left" ? "-rotate-12" : "rotate-12";
  const placement =
    position === "top-left"
      ? isExport
        ? "-left-2 -top-1"
        : "-left-3 -top-1.5"
      : isExport
        ? "-right-2 -top-1"
        : "-right-3 -top-1.5";

  const config = polaroidThemes[theme] ?? polaroidThemes.classic;

  return (
    <div
      className={clsx(
        "absolute z-10",
        size,
        rotation,
        placement,
        "shadow-sm",
        "backdrop-blur-[1px]",
        "before:absolute before:inset-0 before:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)]",
        "after:absolute after:inset-0 after:opacity-30 after:bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)]"
      )}
      style={{
        background: config.tapeGradient,
        border: `1px solid ${config.tapeBorder}`,
      }}
    />
  );
}








