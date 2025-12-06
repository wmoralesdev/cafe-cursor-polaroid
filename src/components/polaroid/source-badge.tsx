import { clsx } from "clsx";
import type { PolaroidTheme } from "@/types/form";
import { polaroidThemes } from "@/constants/polaroid-themes";

export type SourceType = "event" | "x" | "github" | "shared" | "direct";

interface SourceBadgeProps {
  source: SourceType | string | null;
  theme?: PolaroidTheme;
  className?: string;
}

const sourceLabels: Record<string, string> = {
  event: "From Event",
  x: "From X",
  github: "From GitHub",
  shared: "Referred",
  direct: "Direct",
};

export function SourceBadge({ source, theme = "classic", className }: SourceBadgeProps) {
  if (!source || source === "direct") {
    return null;
  }

  const sourceKey = source.toLowerCase();
  const label = sourceLabels[sourceKey] || source;
  const config = polaroidThemes[theme] ?? polaroidThemes.classic;

  // Source-specific accent colors
  const sourceAccents: Record<string, string> = {
    event: "#3b82f6",
    x: "#000000",
    github: "#24292e",
    shared: "#8b5cf6",
    direct: "#6b7280",
  };

  const accentColor = sourceAccents[sourceKey] || config.accent;

  return (
    <div
      className={clsx(
        "px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider",
        config.featureBadgeStyle === "square" ? "rounded-none" : "rounded-sm",
        className
      )}
      style={{
        backgroundColor: "white",
        color: accentColor,
        border: `1px solid ${accentColor}`,
        fontFamily: config.bodyFont,
      }}
    >
      {label}
    </div>
  );
}
