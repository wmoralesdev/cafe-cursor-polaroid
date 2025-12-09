import type { PolaroidTheme } from "@/types/form";

export interface PolaroidThemeConfig {
  // Colors
  accent: string;
  accentLight: string;
  textPrimary: string;
  textMuted: string;
  badgeBg: string;
  badgeBorder: string;
  
  // Fonts
  displayFont: string;
  bodyFont: string;
  monoFont: string;
  
  // Stamp
  stampBorder: string;
  stampInnerBorder: string;
  stampText: string;
  stampFilter?: string;
  
  // Tape
  tapeGradient: string;
  tapeBorder: string;
  
  // Badge styles
  featureBadgeStyle: "pill" | "square" | "outline" | "handwritten" | "minimal" | "tag";
  techBadgeStyle: "pill" | "square" | "minimal" | "underline";
  
  // Special effects
  imageFilter?: string;
}

export const polaroidThemes: Record<PolaroidTheme, PolaroidThemeConfig> = {
  // ═══════════════════════════════════════════════════════════════
  // CLASSIC - Modern Cursor brand, orange accent
  // ═══════════════════════════════════════════════════════════════
  classic: {
    accent: "#f54e00",
    accentLight: "rgba(245, 78, 0, 0.1)",
    textPrimary: "#1a1a1a",
    textMuted: "#666666",
    badgeBg: "rgba(245, 78, 0, 0.1)",
    badgeBorder: "rgba(245, 78, 0, 0.3)",
    
    displayFont: "'DM Sans', system-ui, sans-serif",
    bodyFont: "'DM Sans', system-ui, sans-serif",
    monoFont: "'DM Mono', monospace",
    
    stampBorder: "rgba(245, 78, 0, 0.7)",
    stampInnerBorder: "rgba(245, 78, 0, 0.5)",
    stampText: "#f54e00",
    
    tapeGradient: "linear-gradient(to bottom, rgba(251, 191, 36, 0.9), rgba(251, 191, 36, 0.7))",
    tapeBorder: "rgba(251, 191, 36, 0.5)",
    
    featureBadgeStyle: "pill",
    techBadgeStyle: "pill",
  },
  
  // ═══════════════════════════════════════════════════════════════
  // MINIMAL - Clean, subtle, understated
  // ═══════════════════════════════════════════════════════════════
  minimal: {
    accent: "#9ca3af",
    accentLight: "rgba(156, 163, 175, 0.1)",
    textPrimary: "#374151",
    textMuted: "#9ca3af",
    badgeBg: "rgba(156, 163, 175, 0.08)",
    badgeBorder: "rgba(156, 163, 175, 0.2)",
    
    displayFont: "'Inter', system-ui, sans-serif",
    bodyFont: "'Inter', sans-serif",
    monoFont: "'IBM Plex Mono', monospace",
    
    stampBorder: "rgba(156, 163, 175, 0.5)",
    stampInnerBorder: "rgba(156, 163, 175, 0.3)",
    stampText: "#9ca3af",
    
    tapeGradient: "linear-gradient(to bottom, rgba(243, 244, 246, 0.8), rgba(255, 255, 255, 0.7))",
    tapeBorder: "rgba(229, 231, 235, 0.4)",
    
    featureBadgeStyle: "minimal",
    techBadgeStyle: "minimal",
  },
  
  // ═══════════════════════════════════════════════════════════════
  // WEB - Internet/browser aesthetic, blue links, tech vibes
  // ═══════════════════════════════════════════════════════════════
  web: {
    accent: "#0066CC", // Classic hyperlink blue
    accentLight: "rgba(0, 102, 204, 0.1)",
    textPrimary: "#1a1a1a",
    textMuted: "#555555",
    badgeBg: "rgba(0, 102, 204, 0.08)",
    badgeBorder: "rgba(0, 102, 204, 0.25)",
    
    displayFont: "'Inter', system-ui, sans-serif",
    bodyFont: "'Inter', sans-serif",
    monoFont: "'Fira Code', 'JetBrains Mono', monospace",
    
    stampBorder: "rgba(0, 102, 204, 0.7)",
    stampInnerBorder: "rgba(0, 102, 204, 0.4)",
    stampText: "#0066CC",
    
    tapeGradient: "linear-gradient(to bottom, rgba(0, 102, 204, 0.2), rgba(100, 180, 255, 0.15))",
    tapeBorder: "rgba(0, 102, 204, 0.3)",
    
    featureBadgeStyle: "outline",
    techBadgeStyle: "pill",
  },
  
  // ═══════════════════════════════════════════════════════════════
  // SAKURA - Cherry blossom, soft pink, Japanese spring
  // ═══════════════════════════════════════════════════════════════
  sakura: {
    accent: "#E91E8C", // Sakura pink
    accentLight: "rgba(233, 30, 140, 0.1)",
    textPrimary: "#2D2D2D",
    textMuted: "#7A6B6B",
    badgeBg: "rgba(233, 30, 140, 0.08)",
    badgeBorder: "rgba(233, 30, 140, 0.25)",
    
    displayFont: "'Noto Serif JP', 'Georgia', serif",
    bodyFont: "'Noto Sans JP', 'DM Sans', sans-serif",
    monoFont: "'Noto Sans Mono', monospace",
    
    stampBorder: "rgba(233, 30, 140, 0.6)",
    stampInnerBorder: "rgba(233, 30, 140, 0.35)",
    stampText: "#E91E8C",
    
    tapeGradient: "linear-gradient(to bottom, rgba(255, 183, 197, 0.7), rgba(255, 218, 225, 0.6))",
    tapeBorder: "rgba(233, 30, 140, 0.25)",
    
    featureBadgeStyle: "pill",
    techBadgeStyle: "pill",
    
    imageFilter: "contrast(1.02) saturate(1.05)",
  },
  
  // ═══════════════════════════════════════════════════════════════
  // TOKYO - Cyberpunk nightlife, neon lights, futuristic
  // ═══════════════════════════════════════════════════════════════
  tokyo: {
    accent: "#FF2D95", // Hot pink neon
    accentLight: "rgba(255, 45, 149, 0.2)",
    textPrimary: "#1A1A2E", // Dark night
    textMuted: "#4A4A5E", // Darker neon-tinted gray for contrast
    badgeBg: "rgba(255, 45, 149, 0.18)",
    badgeBorder: "rgba(255, 45, 149, 0.5)",
    
    displayFont: "'Space Grotesk', 'Inter', sans-serif",
    bodyFont: "'Space Grotesk', sans-serif",
    monoFont: "'JetBrains Mono', monospace",
    
    stampBorder: "rgba(255, 45, 149, 0.8)",
    stampInnerBorder: "rgba(0, 217, 255, 0.5)", // Cyan accent
    stampText: "#FF2D95",
    
    tapeGradient: "linear-gradient(to right, rgba(255, 45, 149, 0.3), rgba(0, 217, 255, 0.3))",
    tapeBorder: "rgba(255, 45, 149, 0.4)",
    
    featureBadgeStyle: "tag",
    techBadgeStyle: "square",
  },
  
  // ═══════════════════════════════════════════════════════════════
  // CYBERPUNK - Blade Runner / CP2077, yellow neon, cyan accents
  // ═══════════════════════════════════════════════════════════════
  cyberpunk: {
    accent: "#FCE300", // Cyberpunk yellow
    accentLight: "rgba(252, 227, 0, 0.15)",
    textPrimary: "#0D0D0D", // Near black
    textMuted: "#5A5A3D", // Dark yellow-gray
    badgeBg: "rgba(252, 227, 0, 0.12)",
    badgeBorder: "rgba(252, 227, 0, 0.4)",
    
    displayFont: "'Rajdhani', 'Share Tech', sans-serif",
    bodyFont: "'Rajdhani', sans-serif",
    monoFont: "'Share Tech Mono', monospace",
    
    stampBorder: "rgba(252, 227, 0, 0.8)",
    stampInnerBorder: "rgba(0, 217, 255, 0.5)", // Cyan accent
    stampText: "#FCE300",
    
    tapeGradient: "linear-gradient(to right, rgba(252, 227, 0, 0.3), rgba(0, 217, 255, 0.2))",
    tapeBorder: "rgba(252, 227, 0, 0.3)",
    
    featureBadgeStyle: "tag",
    techBadgeStyle: "square",
    
    imageFilter: "contrast(1.1) saturate(1.1)",
  },
  
  // ═══════════════════════════════════════════════════════════════
  // MATRIX - Digital rain, green on black, hacker movie aesthetic
  // ═══════════════════════════════════════════════════════════════
  matrix: {
    accent: "#00FF00", // Pure matrix green
    accentLight: "rgba(0, 255, 0, 0.12)",
    textPrimary: "#0A0A0A",
    textMuted: "#2D4A2D",
    badgeBg: "rgba(0, 255, 0, 0.1)",
    badgeBorder: "rgba(0, 255, 0, 0.35)",
    
    displayFont: "'Courier New', 'Consolas', monospace",
    bodyFont: "'Courier New', monospace",
    monoFont: "'Courier New', monospace",
    
    stampBorder: "rgba(0, 255, 0, 0.7)",
    stampInnerBorder: "rgba(0, 255, 0, 0.4)",
    stampText: "#00FF00",
    
    tapeGradient: "linear-gradient(to bottom, rgba(0, 255, 0, 0.2), rgba(0, 180, 0, 0.1))",
    tapeBorder: "rgba(0, 255, 0, 0.25)",
    
    featureBadgeStyle: "square",
    techBadgeStyle: "square",
    
    imageFilter: "contrast(1.15) saturate(0.8) brightness(0.95)",
  },
};

// Helper to get CSS variables for a theme
export function getThemeStyles(theme: PolaroidTheme): React.CSSProperties {
  const config = polaroidThemes[theme];
  return {
    "--polaroid-accent": config.accent,
    "--polaroid-accent-light": config.accentLight,
    "--polaroid-text-primary": config.textPrimary,
    "--polaroid-text-muted": config.textMuted,
    "--polaroid-badge-bg": config.badgeBg,
    "--polaroid-badge-border": config.badgeBorder,
    "--polaroid-display-font": config.displayFont,
    "--polaroid-body-font": config.bodyFont,
    "--polaroid-mono-font": config.monoFont,
  } as React.CSSProperties;
}
