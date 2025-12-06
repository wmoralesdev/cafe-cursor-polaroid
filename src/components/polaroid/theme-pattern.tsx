import type { PolaroidTheme } from "@/types/form";
import { polaroidThemes } from "@/constants/polaroid-themes";

interface ThemePatternProps {
  theme: PolaroidTheme;
}

export function ThemePattern({ theme }: ThemePatternProps) {
  const config = polaroidThemes[theme] ?? polaroidThemes.classic;

  // Position: left side, under the handle text in the caption area
  const baseClass = "absolute left-3 pointer-events-none";
  // ~70% from top puts it right under the handle
  const topPosition = "top-[70%]";

  switch (theme) {
    // Classic: Subtle dot grid pattern
    case "classic":
      return (
        <div className={`${baseClass} ${topPosition} w-14 h-14 opacity-[0.15]`}>
          <svg width="100%" height="100%" viewBox="0 0 56 56">
            {Array.from({ length: 4 }).map((_, row) =>
              Array.from({ length: 4 }).map((_, col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={7 + col * 14}
                  cy={7 + row * 14}
                  r="2"
                  fill={config.accent}
                />
              ))
            )}
          </svg>
        </div>
      );

    // Minimal: Small dot cluster (3-5 dots)
    case "minimal":
      return (
        <div className={`${baseClass} ${topPosition} w-7 h-7 opacity-[0.2]`}>
          <svg width="100%" height="100%" viewBox="0 0 28 28">
            <circle cx="4" cy="14" r="2.5" fill={config.accent} />
            <circle cx="14" cy="8" r="2" fill={config.accent} />
            <circle cx="14" cy="20" r="2" fill={config.accent} />
            <circle cx="24" cy="12" r="3" fill={config.accent} />
            <circle cx="22" cy="22" r="1.5" fill={config.accent} />
          </svg>
        </div>
      );

    // Coffee: Coffee ring stain watermark
    case "coffee":
      return (
        <div className={`${baseClass} ${topPosition} w-14 h-14 opacity-[0.12]`}>
          <svg width="100%" height="100%" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke={config.accent}
              strokeWidth="5"
              strokeDasharray="6 3 12 3"
            />
            <circle
              cx="32"
              cy="32"
              r="18"
              fill="none"
              stroke={config.accent}
              strokeWidth="2"
              strokeDasharray="3 6"
              opacity="0.6"
            />
          </svg>
        </div>
      );

    // Zen: Bamboo stalks silhouette
    case "zen":
      return (
        <div className={`${baseClass} ${topPosition} w-10 h-16 opacity-[0.15]`}>
          <svg width="100%" height="100%" viewBox="0 0 40 64">
            {/* Main bamboo stalk */}
            <rect x="14" y="0" width="4" height="64" rx="2" fill={config.accent} />
            <rect x="12" y="12" width="8" height="2" rx="1" fill={config.accent} />
            <rect x="12" y="30" width="8" height="2" rx="1" fill={config.accent} />
            <rect x="12" y="48" width="8" height="2" rx="1" fill={config.accent} />
            {/* Secondary stalk */}
            <rect x="26" y="16" width="3" height="48" rx="1.5" fill={config.accent} opacity="0.7" />
            <rect x="24" y="32" width="7" height="1.5" rx="0.75" fill={config.accent} opacity="0.7" />
            <rect x="24" y="50" width="7" height="1.5" rx="0.75" fill={config.accent} opacity="0.7" />
            {/* Leaves */}
            <ellipse cx="8" cy="8" rx="7" ry="2.5" fill={config.accent} opacity="0.5" transform="rotate(-35 8 8)" />
            <ellipse cx="32" cy="22" rx="5" ry="2" fill={config.accent} opacity="0.4" transform="rotate(30 32 22)" />
          </svg>
        </div>
      );

    // Tokyo: Pixelated/glitch effect
    case "tokyo":
      return (
        <div className={`${baseClass} ${topPosition} w-14 h-12 opacity-[0.25]`}>
          <svg width="100%" height="100%" viewBox="0 0 56 48">
            <rect x="0" y="4" width="8" height="4" fill={config.accent} />
            <rect x="12" y="0" width="5" height="5" fill="#00D9FF" />
            <rect x="20" y="6" width="10" height="3" fill={config.accent} opacity="0.8" />
            <rect x="34" y="2" width="4" height="4" fill="#00D9FF" opacity="0.9" />
            <rect x="44" y="0" width="4" height="8" fill={config.accent} opacity="0.6" />

            <rect x="2" y="14" width="12" height="2" fill="#00D9FF" opacity="0.7" />
            <rect x="20" y="12" width="5" height="4" fill={config.accent} />
            <rect x="30" y="16" width="8" height="2" fill="#00D9FF" opacity="0.5" />
            <rect x="44" y="10" width="6" height="4" fill={config.accent} opacity="0.8" />

            <rect x="4" y="24" width="4" height="6" fill={config.accent} opacity="0.7" />
            <rect x="12" y="28" width="10" height="2" fill="#00D9FF" />
            <rect x="26" y="22" width="4" height="5" fill={config.accent} opacity="0.9" />
            <rect x="36" y="26" width="8" height="3" fill="#00D9FF" opacity="0.6" />
            <rect x="48" y="20" width="4" height="8" fill={config.accent} opacity="0.5" />

            <rect x="0" y="38" width="6" height="2" fill="#00D9FF" opacity="0.8" />
            <rect x="10" y="40" width="5" height="4" fill={config.accent} opacity="0.6" />
            <rect x="24" y="36" width="12" height="2" fill="#00D9FF" opacity="0.7" />
            <rect x="42" y="34" width="4" height="6" fill={config.accent} />
          </svg>
        </div>
      );

    default:
      return null;
  }
}

