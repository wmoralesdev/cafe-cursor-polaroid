import type { PolaroidTheme } from "@/types/form";
import { polaroidThemes } from "@/constants/polaroid-themes";

interface ThemePatternProps {
  theme: PolaroidTheme;
}

export function ThemePattern({ theme }: ThemePatternProps) {
  const config = polaroidThemes[theme] ?? polaroidThemes.classic;

  // Position: left side, under the handle text in the caption area
  const baseClass = "absolute left-3 pointer-events-none";
  // ~55% from top puts it right under the handle
  const topPosition = "top-[55%]";

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

    // Web: Browser/code brackets pattern
    case "web":
      return (
        <div className={`${baseClass} ${topPosition} w-12 h-14 opacity-[0.15]`}>
          <svg width="100%" height="100%" viewBox="0 0 48 56">
            {/* Opening bracket < */}
            <path d="M20 8 L8 28 L20 48" fill="none" stroke={config.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {/* Closing bracket > */}
            <path d="M28 8 L40 28 L28 48" fill="none" stroke={config.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {/* Slash / */}
            <line x1="26" y1="12" x2="22" y2="44" stroke={config.accent} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          </svg>
        </div>
      );

    // Sakura: Cherry blossom petals
    case "sakura":
      return (
        <div className={`${baseClass} ${topPosition} w-14 h-16 opacity-[0.2]`}>
          <svg width="100%" height="100%" viewBox="0 0 56 64">
            {/* Falling petals */}
            <ellipse cx="12" cy="8" rx="6" ry="3" fill={config.accent} transform="rotate(-20 12 8)" opacity="0.8" />
            <ellipse cx="40" cy="14" rx="5" ry="2.5" fill={config.accent} transform="rotate(25 40 14)" opacity="0.6" />
            <ellipse cx="8" cy="28" rx="5" ry="2.5" fill={config.accent} transform="rotate(-35 8 28)" opacity="0.7" />
            <ellipse cx="44" cy="36" rx="6" ry="3" fill={config.accent} transform="rotate(15 44 36)" opacity="0.5" />
            <ellipse cx="20" cy="44" rx="5" ry="2.5" fill={config.accent} transform="rotate(-10 20 44)" opacity="0.8" />
            <ellipse cx="36" cy="52" rx="4" ry="2" fill={config.accent} transform="rotate(30 36 52)" opacity="0.6" />
            <ellipse cx="14" cy="56" rx="5" ry="2.5" fill={config.accent} transform="rotate(-25 14 56)" opacity="0.4" />
            {/* Small accent dots */}
            <circle cx="28" cy="20" r="2" fill={config.accent} opacity="0.5" />
            <circle cx="48" cy="48" r="1.5" fill={config.accent} opacity="0.4" />
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

    // Cyberpunk: Neon city grid / circuit pattern (yellow + cyan)
    case "cyberpunk":
      return (
        <div className={`${baseClass} ${topPosition} w-14 h-14 opacity-[0.22]`}>
          <svg width="100%" height="100%" viewBox="0 0 56 56">
            {/* Grid lines - yellow */}
            <line x1="0" y1="14" x2="56" y2="14" stroke={config.accent} strokeWidth="1" opacity="0.5" />
            <line x1="0" y1="28" x2="56" y2="28" stroke={config.accent} strokeWidth="1.5" />
            <line x1="0" y1="42" x2="56" y2="42" stroke={config.accent} strokeWidth="1" opacity="0.5" />
            <line x1="14" y1="0" x2="14" y2="56" stroke={config.accent} strokeWidth="1" opacity="0.5" />
            <line x1="28" y1="0" x2="28" y2="56" stroke={config.accent} strokeWidth="1.5" />
            <line x1="42" y1="0" x2="42" y2="56" stroke={config.accent} strokeWidth="1" opacity="0.5" />
            
            {/* Intersection nodes - cyan */}
            <circle cx="14" cy="14" r="2" fill="#00D9FF" />
            <circle cx="28" cy="28" r="3" fill={config.accent} />
            <circle cx="42" cy="42" r="2" fill="#00D9FF" />
            <circle cx="14" cy="42" r="1.5" fill="#00D9FF" opacity="0.7" />
            <circle cx="42" cy="14" r="1.5" fill="#00D9FF" opacity="0.7" />
            
            {/* Accent bars */}
            <rect x="4" y="26" width="8" height="4" fill={config.accent} opacity="0.8" />
            <rect x="44" y="26" width="8" height="4" fill="#00D9FF" opacity="0.8" />
          </svg>
        </div>
      );

    // Matrix: Digital rain / falling characters
    case "matrix":
      return (
        <div className={`${baseClass} ${topPosition} w-14 h-16 opacity-[0.18]`}>
          <svg width="100%" height="100%" viewBox="0 0 56 64">
            {/* Falling rain columns */}
            <rect x="4" y="0" width="2" height="64" fill={config.accent} opacity="0.3" />
            <rect x="14" y="0" width="2" height="64" fill={config.accent} opacity="0.3" />
            <rect x="24" y="0" width="2" height="64" fill={config.accent} opacity="0.3" />
            <rect x="34" y="0" width="2" height="64" fill={config.accent} opacity="0.3" />
            <rect x="44" y="0" width="2" height="64" fill={config.accent} opacity="0.3" />
            
            {/* Bright "head" characters */}
            <rect x="4" y="8" width="2" height="4" fill={config.accent} />
            <rect x="14" y="20" width="2" height="4" fill={config.accent} />
            <rect x="24" y="4" width="2" height="4" fill={config.accent} />
            <rect x="34" y="32" width="2" height="4" fill={config.accent} />
            <rect x="44" y="16" width="2" height="4" fill={config.accent} />
            
            {/* Fading trail segments */}
            <rect x="4" y="12" width="2" height="8" fill={config.accent} opacity="0.7" />
            <rect x="14" y="24" width="2" height="12" fill={config.accent} opacity="0.6" />
            <rect x="24" y="8" width="2" height="16" fill={config.accent} opacity="0.5" />
            <rect x="34" y="36" width="2" height="10" fill={config.accent} opacity="0.7" />
            <rect x="44" y="20" width="2" height="14" fill={config.accent} opacity="0.6" />
            
            {/* Random character dots */}
            <circle cx="5" cy="40" r="1" fill={config.accent} opacity="0.8" />
            <circle cx="15" cy="50" r="1" fill={config.accent} opacity="0.6" />
            <circle cx="25" cy="45" r="1" fill={config.accent} opacity="0.9" />
            <circle cx="35" cy="55" r="1" fill={config.accent} opacity="0.5" />
            <circle cx="45" cy="48" r="1" fill={config.accent} opacity="0.7" />
          </svg>
        </div>
      );

    default:
      return null;
  }
}

