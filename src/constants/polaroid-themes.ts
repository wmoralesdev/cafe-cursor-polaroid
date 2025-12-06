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
  // COFFEE - Artisan craft coffee shop, kraft paper, hand-drawn
  // ═══════════════════════════════════════════════════════════════
  coffee: {
    accent: "#6F4E37", // Coffee brown
    accentLight: "rgba(111, 78, 55, 0.12)",
    textPrimary: "#3E2723", // Dark espresso
    textMuted: "#8D6E63", // Latte
    badgeBg: "rgba(111, 78, 55, 0.08)",
    badgeBorder: "rgba(111, 78, 55, 0.25)",
    
    displayFont: "'Caveat', 'Patrick Hand', cursive, system-ui",
    bodyFont: "'DM Sans', system-ui, sans-serif",
    monoFont: "'Source Code Pro', monospace",
    
    stampBorder: "rgba(111, 78, 55, 0.7)",
    stampInnerBorder: "rgba(111, 78, 55, 0.4)",
    stampText: "#6F4E37",
    
    tapeGradient: "linear-gradient(to bottom, rgba(210, 180, 140, 0.85), rgba(188, 158, 118, 0.75))",
    tapeBorder: "rgba(139, 119, 91, 0.4)",
    
    featureBadgeStyle: "handwritten",
    techBadgeStyle: "underline",
    
    imageFilter: "contrast(1.02) saturate(0.95) sepia(5%)",
  },
  
  // ═══════════════════════════════════════════════════════════════
  // ZEN - Traditional Japanese garden, moss green, wabi-sabi
  // ═══════════════════════════════════════════════════════════════
  zen: {
    accent: "#5B7553", // Moss green (苔色 koke-iro)
    accentLight: "rgba(91, 117, 83, 0.12)",
    textPrimary: "#2D3A2D", // Deep forest
    textMuted: "#6B7B6B", // Stone moss
    badgeBg: "rgba(91, 117, 83, 0.1)",
    badgeBorder: "rgba(91, 117, 83, 0.25)",
    
    displayFont: "'Zen Antique', 'Noto Serif JP', 'Georgia', serif",
    bodyFont: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
    monoFont: "'Noto Sans Mono', monospace",
    
    stampBorder: "rgba(91, 117, 83, 0.7)",
    stampInnerBorder: "rgba(91, 117, 83, 0.4)",
    stampText: "#5B7553",
    
    tapeGradient: "linear-gradient(to bottom, rgba(216, 223, 208, 0.9), rgba(200, 210, 190, 0.8))",
    tapeBorder: "rgba(160, 175, 150, 0.4)",
    
    featureBadgeStyle: "outline",
    techBadgeStyle: "minimal",
    
    imageFilter: "contrast(1.02) saturate(0.92) sepia(3%)",
  },
  
  // ═══════════════════════════════════════════════════════════════
  // TOKYO - Cyberpunk nightlife, neon lights, futuristic
  // ═══════════════════════════════════════════════════════════════
  tokyo: {
    accent: "#FF2D95", // Hot pink neon
    accentLight: "rgba(255, 45, 149, 0.15)",
    textPrimary: "#1A1A2E", // Dark night
    textMuted: "#8B8BA3", // Neon-tinted gray
    badgeBg: "rgba(255, 45, 149, 0.12)",
    badgeBorder: "rgba(255, 45, 149, 0.35)",
    
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
