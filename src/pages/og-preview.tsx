import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPolaroidBySlug, type PolaroidRecord } from "@/lib/polaroids";
import { polaroidThemes, type PolaroidThemeConfig } from "@/constants/polaroid-themes";
import type { PolaroidTheme } from "@/types/form";
import { Loader2 } from "lucide-react";

// Inline SVG icons for Edge Function compatibility
const TerminalIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 7 5 5-5 5"/><path d="M12 19h7"/>
  </svg>
);

const LightbulbIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>
  </svg>
);

const AwardIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);

const THEME_OPTIONS: PolaroidTheme[] = ["classic", "minimal", "coffee", "zen", "tokyo"];

function getThemeConfig(themeName: PolaroidTheme): PolaroidThemeConfig {
  return polaroidThemes[themeName] || polaroidThemes.classic;
}

function getHandle(profile: PolaroidRecord["profile"]): string {
  return profile?.handles?.[0]?.handle || "dev";
}

function getPlatformIcon(platform: string): string {
  switch (platform) {
    case "x": return "𝕏";
    case "linkedin": return "in";
    case "github": return "⌘";
    default: return "@";
  }
}

function formatModel(model: string): string {
  return model
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace("Gpt", "GPT");
}

export function OGPreviewPage() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedTheme, setSelectedTheme] = useState<PolaroidTheme | null>(null);
  
  const { data: polaroid, isLoading, error } = useQuery({
    queryKey: ["polaroid-slug", slug],
    queryFn: () => getPolaroidBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (error || !polaroid) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-2">Polaroid not found</h1>
          <p className="text-neutral-400">Slug: {slug}</p>
        </div>
      </div>
    );
  }

  const activeTheme = selectedTheme || (polaroid.profile?.polaroidTheme as PolaroidTheme) || "classic";
  const theme = getThemeConfig(activeTheme);
  const handle = getHandle(polaroid.profile);
  const platform = polaroid.profile?.handles?.[0]?.platform || "x";
  const title = `@${handle}'s dev card`;
  const project = polaroid.profile?.projectType || "";
  const primaryModel = polaroid.profile?.primaryModel ? formatModel(polaroid.profile.primaryModel) : "";
  const secondaryModel = polaroid.profile?.secondaryModel ? formatModel(polaroid.profile.secondaryModel) : "";
  const plan = polaroid.profile?.planTier?.toUpperCase() || "";
  const isMax = polaroid.profile?.isMaxMode;
  const extras = polaroid.profile?.extras?.slice(0, 3) || [];
  const description = [primaryModel, plan, isMax ? "MAX" : ""].filter(Boolean).join(" · ");

  return (
    <div className="min-h-screen bg-neutral-900 p-8">
      {/* Dev banner */}
      <div className="max-w-2xl mx-auto mb-4">
        <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg px-4 py-2 text-amber-200 text-sm">
          <strong>DEV ONLY:</strong> This page previews how the Twitter/X card will look when shared.
        </div>
      </div>

      {/* Theme toggle */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-neutral-400 text-sm mr-2">Theme:</span>
          {THEME_OPTIONS.map((themeName) => {
            const themeConfig = getThemeConfig(themeName);
            const isActive = activeTheme === themeName;
            return (
              <button
                key={themeName}
                onClick={() => setSelectedTheme(themeName)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isActive 
                    ? "ring-2 ring-offset-2 ring-offset-neutral-900" 
                    : "opacity-70 hover:opacity-100"
                }`}
                style={{ 
                  background: themeConfig.accent,
                  color: "white",
                }}
              >
                {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
              </button>
            );
          })}
          {selectedTheme && (
            <button
              onClick={() => setSelectedTheme(null)}
              className="px-3 py-1.5 rounded-full text-sm font-medium bg-neutral-700 text-neutral-300 hover:bg-neutral-600 transition-all ml-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Twitter card preview */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-neutral-400 text-sm mb-4 font-mono">Twitter Card Preview (summary_large_image)</h2>
        
        {/* Card mockup - Polaroid style */}
        <div 
          className="rounded-2xl overflow-hidden border border-neutral-700"
          style={{ maxWidth: 600 }}
        >
          {/* OG Image area - 1.91:1 aspect ratio */}
          <div 
            className="relative w-full flex items-center justify-center p-8"
            style={{ 
              aspectRatio: "1.91 / 1",
              background: `linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 50%, #1a1a1a 100%)`,
            }}
          >
            {/* Subtle pattern overlay */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 80%, ${theme.accent}15 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${theme.accent}10 0%, transparent 40%)`,
              }}
            />

            {/* Landscape Polaroid Card */}
            <div 
              className="relative bg-white rounded-sm shadow-2xl"
              style={{ 
                width: "92%",
                height: "85%",
                padding: "10px",
                paddingBottom: "32px",
                transform: "rotate(-1deg)",
                boxShadow: `0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)`,
              }}
            >
              {/* Main content area */}
              <div className="flex h-full gap-4">
                {/* Photo section - left side */}
                <div 
                  className="relative h-full overflow-hidden rounded-sm"
                  style={{ width: "42%", flexShrink: 0 }}
                >
                  {polaroid.source_image_url || polaroid.image_url ? (
                    <img 
                      src={polaroid.source_image_url || polaroid.image_url!} 
                      alt={`${handle}'s photo`}
                      className="w-full h-full object-cover"
                      style={{ filter: theme.imageFilter }}
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                      <span className="text-neutral-400 text-sm">No photo</span>
                    </div>
                  )}
                </div>

                {/* Info section - right side */}
                <div className="flex-1 py-1 flex flex-col justify-between min-w-0">
                  {/* Top - Handle & Project */}
                  <div>
                    {/* Handle with MAX badge */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <span 
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                        style={{ background: theme.accent, color: "white" }}
                      >
                        {getPlatformIcon(platform)}
                      </span>
                      <span 
                        className="text-sm font-bold tracking-tight truncate"
                        style={{ color: theme.textPrimary, fontFamily: theme.displayFont }}
                      >
                        @{handle}
                      </span>
                      {isMax && (
                        <span 
                          className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide shrink-0"
                          style={{ background: theme.accent, color: "white" }}
                        >
                          MAX
                        </span>
                      )}
                    </div>
                    
                    {/* Project */}
                    {project && (
                      <p 
                        className="text-[11px] leading-snug mb-2 line-clamp-2"
                        style={{ color: theme.textMuted, fontFamily: theme.bodyFont }}
                      >
                        <span className="opacity-60">Building</span>{" "}
                        <span style={{ color: theme.textPrimary, fontWeight: 600 }}>{project}</span>
                      </p>
                    )}

                    {/* Model & Plan row with icons */}
                    <div 
                      className="flex items-center gap-3 text-[10px] mb-2"
                      style={{ color: theme.textMuted }}
                    >
                      {primaryModel && (
                        <div className="flex items-center gap-1">
                          <TerminalIcon className="w-3 h-3 opacity-50" style={{ color: theme.accent }} />
                          <span>{primaryModel}</span>
                        </div>
                      )}
                      {secondaryModel && (
                        <div className="flex items-center gap-1">
                          <LightbulbIcon className="w-3 h-3 opacity-50" style={{ color: theme.accent }} />
                          <span>{secondaryModel}</span>
                        </div>
                      )}
                      {plan && (
                        <div className="flex items-center gap-1">
                          <AwardIcon className="w-3 h-3 opacity-50" style={{ color: theme.accent }} />
                          <span>{plan}</span>
                        </div>
                      )}
                    </div>

                    {/* Tech stack */}
                    {extras.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {extras.map((tech, i) => (
                          <span 
                            key={i}
                            className="text-[9px] px-1.5 py-0.5 rounded"
                            style={{ background: theme.badgeBg, color: theme.textMuted, border: `1px solid ${theme.badgeBorder}` }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom - Cafe Cursor branding */}
                  <div className="flex items-center gap-1.5">
                    <img 
                      src="/cursor.svg" 
                      alt="Cursor" 
                      className="w-4 h-4"
                      style={{ filter: "brightness(0) opacity(0.5)" }}
                    />
                    <span 
                      className="text-[10px] font-medium"
                      style={{ color: theme.textMuted }}
                    >
                      Cafe Cursor
                    </span>
                  </div>
                </div>
              </div>

              {/* Stamp - bottom right corner of polaroid */}
              <div 
                className="absolute bottom-8 right-2"
                style={{ transform: `rotate(${polaroid.profile?.stampRotation || 12}deg)` }}
              >
                <div 
                  className="relative w-14 h-14 rounded-full flex items-center justify-center bg-white"
                  style={{ 
                    border: `2px ${activeTheme === 'coffee' ? 'dashed' : 'solid'} ${theme.stampBorder}`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <div 
                    className="absolute inset-1 rounded-full border border-dashed"
                    style={{ borderColor: theme.stampInnerBorder }}
                  />
                  
                  <div 
                    className="flex flex-col items-center justify-center gap-0"
                    style={{ color: theme.stampText }}
                  >
                    <span 
                      className="text-[6px] font-bold uppercase tracking-wide"
                      style={{ fontFamily: activeTheme === 'coffee' ? theme.displayFont : undefined }}
                    >
                      {activeTheme === 'zen' ? '東京' : activeTheme === 'coffee' ? '☕' : 'Cafe'}
                    </span>
                    <img 
                      src="/cursor.svg" 
                      alt="Cursor" 
                      className="w-3.5 h-3.5"
                      style={{ 
                        filter: activeTheme === 'minimal' 
                          ? 'grayscale(100%) opacity(0.6)' 
                          : activeTheme === 'coffee' 
                            ? 'sepia(30%)' 
                            : 'brightness(0)',
                      }}
                    />
                    <span className="text-[5px] font-medium uppercase tracking-wider">
                      {activeTheme === 'zen' ? '禅' : '2025'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tape decoration - top left */}
              <div 
                className="absolute -top-2 left-12 w-14 h-5 -rotate-12"
                style={{ 
                  background: theme.tapeGradient,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              />

              {/* Bottom white area with subtle accent */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-7 flex items-center px-3"
                style={{ background: "white" }}
              >
                <div 
                  className="h-px w-full rounded-full"
                  style={{ 
                    background: `linear-gradient(to right, ${theme.accent}20, ${theme.accent}40, ${theme.accent}20)`,
                  }}
                />
              </div>
            </div>

            {/* Floating accent elements */}
            <div 
              className="absolute top-4 right-4 w-2 h-2 rounded-full"
              style={{ background: theme.accent, opacity: 0.6 }}
            />
            <div 
              className="absolute bottom-6 left-6 w-1.5 h-1.5 rounded-full"
              style={{ background: theme.accent, opacity: 0.4 }}
            />
          </div>

          {/* Card metadata footer */}
          <div 
            className="p-3 border-t"
            style={{ background: "rgb(22, 22, 22)", borderColor: "rgb(47, 47, 47)" }}
          >
            <p className="text-neutral-500 text-xs mb-0.5">cafe.cursor-sv.com</p>
            <h3 className="text-white font-semibold text-sm">{title}</h3>
            <p className="text-neutral-400 text-xs">{description || "Cafe Cursor dev card"} · Cafe Cursor</p>
          </div>
        </div>

        {/* Meta tags preview */}
        <div className="mt-8">
          <h2 className="text-neutral-400 text-sm mb-4 font-mono">OG Meta Tags</h2>
          <pre className="bg-neutral-800 rounded-lg p-4 text-sm text-neutral-300 overflow-x-auto">
{`<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description || "Cafe Cursor dev card"} · Cafe Cursor" />
<meta property="og:image" content="[generated OG image]" />
<meta property="og:url" content="https://cafe.cursor-sv.com/c/${slug}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description || "Cafe Cursor dev card"} · Cafe Cursor" />`}
          </pre>
        </div>

        {/* Theme info */}
        <div className="mt-8">
          <h2 className="text-neutral-400 text-sm mb-4 font-mono">
            Theme: {activeTheme}
            {selectedTheme && selectedTheme !== polaroid.profile?.polaroidTheme && (
              <span className="text-amber-400 ml-2">(preview only)</span>
            )}
          </h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded"
                style={{ background: theme.accent }}
              />
              <span className="text-neutral-400 text-sm">Accent</span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded"
                style={{ background: theme.tapeGradient }}
              />
              <span className="text-neutral-400 text-sm">Tape</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

