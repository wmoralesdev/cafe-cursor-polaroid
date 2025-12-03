import { clsx } from "clsx";

export type SourceType = "event" | "x" | "github" | "shared" | "direct";

interface SourceBadgeProps {
  source: SourceType | string | null;
  className?: string;
}

const sourceLabels: Record<string, string> = {
  event: "From Event",
  x: "From X",
  github: "From GitHub",
  shared: "Referred",
  direct: "Direct",
};

const sourceColors: Record<string, string> = {
  event: "bg-blue-500/90 text-white",
  x: "bg-black text-white",
  github: "bg-[#24292e] text-white",
  shared: "bg-purple-500/90 text-white",
  direct: "bg-gray-500/90 text-white",
};

export function SourceBadge({ source, className }: SourceBadgeProps) {
  if (!source || source === "direct") {
    return null;
  }

  const sourceKey = source.toLowerCase();
  const label = sourceLabels[sourceKey] || source;

  // Inverted colors: white background with colored text (opposite of MAX button)
  const invertedColors: Record<string, string> = {
    event: "bg-white text-blue-500 border-blue-500",
    x: "bg-white text-black border-black",
    github: "bg-white text-[#24292e] border-[#24292e]",
    shared: "bg-white text-purple-500 border-purple-500",
    direct: "bg-white text-gray-500 border-gray-500",
  };

  const colorClass = invertedColors[sourceKey] || invertedColors.direct;

  return (
    <div
      className={clsx(
        "px-1.5 py-0.5 rounded-sm text-[8px] font-bold uppercase tracking-wider border",
        colorClass,
        className
      )}
    >
      {label}
    </div>
  );
}

