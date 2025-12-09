import { forwardRef } from "react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import type { CursorProfile, PolaroidTheme } from "@/types/form";
import { polaroidThemes, type PolaroidThemeConfig } from "@/constants/polaroid-themes";
import cursorLogo from "@/assets/cursor.svg";

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

interface OGCardProps {
  profile: CursorProfile;
  imageUrl: string | null;
  lang?: "en" | "es";
  className?: string;
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

function formatShortDate(dateString: string | undefined, locale: typeof es | typeof enUS): string {
  if (!dateString) return "";
  return format(new Date(dateString), "MMM d, yyyy", { locale });
}

interface OGStampProps {
  rotation: number;
  generatedAt?: string;
  locale: typeof es | typeof enUS;
  theme: PolaroidTheme;
  config: PolaroidThemeConfig;
}

function OGStamp({ rotation, generatedAt, locale, theme, config }: OGStampProps) {
  const getStampContent = () => {
    switch (theme) {
      case "web":
        return { top: "</>", bottom: generatedAt ? formatShortDate(generatedAt, locale) : "2025" };
      case "sakura":
        return { top: "桜", bottom: generatedAt ? formatShortDate(generatedAt, locale) : "春 2025" };
      case "tokyo":
        return { top: "東京", bottom: generatedAt ? formatShortDate(generatedAt, locale) : "2025" };
      case "cyberpunk":
        return { top: "NIGHT CITY", bottom: generatedAt ? formatShortDate(generatedAt, locale) : "2077" };
      case "matrix":
        return { top: "WAKE UP", bottom: generatedAt ? formatShortDate(generatedAt, locale) : "1999" };
      case "minimal":
        return { top: "", bottom: "2025" };
      default:
        return { top: "Cafe Cursor", bottom: generatedAt ? formatShortDate(generatedAt, locale) : "SV · 2025" };
    }
  };

  const content = getStampContent();
  const isSquare = theme === "minimal";

  if (isSquare) {
    return (
      <div 
        className="relative flex items-center justify-center opacity-60"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div className="relative w-14 h-14 flex items-center justify-center">
          <div 
            className="absolute inset-0 border"
            style={{ borderColor: config.stampBorder }}
          />
          <div 
            className="absolute inset-1 border"
            style={{ borderColor: config.stampInnerBorder }}
          />
          <div className="flex flex-col items-center justify-center gap-0.5" style={{ color: config.stampText }}>
            <img 
              src={cursorLogo}
              alt="Cursor" 
              className="h-4 w-4 object-contain opacity-60"
              style={{ filter: 'grayscale(100%)' }}
            />
            <span className="text-[6px] font-medium uppercase tracking-widest">{content.bottom}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative flex items-center justify-center"
      style={{ opacity: theme === "tokyo" ? 0.8 : 0.7 }}
    >
      <div 
        className="relative w-14 h-14 rounded-full flex items-center justify-center bg-white"
        style={{ 
          transform: `rotate(${rotation}deg)`,
          border: `2px solid ${config.stampBorder}`,
          boxShadow: theme === "tokyo" 
            ? `0 0 8px ${config.accent}60, inset 0 0 8px ${config.accent}20`
            : "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {/* Inner dashed ring */}
        <div 
          className="absolute inset-1 rounded-full border border-dashed"
          style={{ 
            borderColor: config.stampInnerBorder,
            boxShadow: theme === "tokyo" ? `0 0 4px ${config.stampInnerBorder}` : undefined,
          }}
        />

        {/* Tokyo neon dots */}
        {theme === "tokyo" && (
          <>
            <div className="absolute top-0.5 right-1.5 w-1 h-1 rounded-full" style={{ backgroundColor: "#00D9FF", boxShadow: "0 0 4px #00D9FF" }} />
            <div className="absolute bottom-1.5 left-0.5 w-0.5 h-0.5 rounded-full" style={{ backgroundColor: config.accent, boxShadow: `0 0 3px ${config.accent}` }} />
          </>
        )}
        
        <div className="flex flex-col items-center justify-center gap-0" style={{ color: config.stampText }}>
          {content.top && (
            <span 
              className="text-[6px] font-bold uppercase tracking-wide"
            >
              {content.top}
            </span>
          )}
          <img 
            src={cursorLogo}
            alt="Cursor" 
            className="w-3.5 h-3.5"
            style={{ 
              filter: theme === 'tokyo'
                ? 'hue-rotate(310deg) saturate(1.5) brightness(1.1)'
                : 'brightness(0)',
            }}
          />
          <span 
            className="text-[5px] font-medium uppercase tracking-wider"
            style={{ 
              fontFamily: config.monoFont,
              color: theme === "tokyo" ? "#00D9FF" : config.stampText,
              textShadow: theme === "tokyo" ? "0 0 4px #00D9FF" : undefined,
            }}
          >
            {content.bottom}
          </span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// OG CARD - Landscape format for social sharing (1200x630)
// ═══════════════════════════════════════════════════════════════

export const OGCard = forwardRef<HTMLDivElement, OGCardProps>(
  ({ profile, imageUrl, lang = "en", className }, ref) => {
    const rawTheme = profile.polaroidTheme ?? "classic";
    const theme = (polaroidThemes[rawTheme] ? rawTheme : "classic") as PolaroidTheme;
    const config = polaroidThemes[theme];
    const locale = lang === "es" ? es : enUS;

    const handle = profile.handles?.[0]?.handle || "dev";
    const platform = profile.handles?.[0]?.platform || "x";
    const project = profile.projectType || "";
    const primaryModel = profile.primaryModel ? formatModel(profile.primaryModel) : "";
    const secondaryModel = profile.secondaryModel ? formatModel(profile.secondaryModel) : "";
    const plan = profile.planTier?.toUpperCase() || "";
    const isMax = profile.isMaxMode;
    const extras = (profile.extras || []).slice(0, 3);
    const stampRotation = profile.stampRotation ?? -12;

    return (
      <div 
        ref={ref}
        className={className}
        style={{ 
          width: 1200,
          height: 630,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
          background: `linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 50%, #1a1a1a 100%)`,
          position: "relative",
        }}
      >
        {/* Subtle pattern overlay */}
        <div 
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.3,
            backgroundImage: `radial-gradient(circle at 20% 80%, ${config.accent}15 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${config.accent}10 0%, transparent 40%)`,
          }}
        />

        {/* Floating accent elements */}
        <div 
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: config.accent,
            opacity: 0.6,
          }}
        />
        <div 
          style={{
            position: "absolute",
            bottom: 30,
            left: 30,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: config.accent,
            opacity: 0.4,
          }}
        />

        {/* Landscape Polaroid Card */}
        <div 
          style={{ 
            position: "relative",
            background: "white",
            borderRadius: 4,
            width: "92%",
            height: "85%",
            padding: 20,
            paddingBottom: 60,
            transform: "rotate(-1deg)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)",
          }}
        >
          {/* Main content area */}
          <div style={{ display: "flex", height: "100%", gap: 32 }}>
            {/* Photo section - left side */}
            <div 
              style={{ 
                width: "42%", 
                height: "100%",
                flexShrink: 0,
                overflow: "hidden",
                borderRadius: 4,
                background: "#e5e5e5",
              }}
            >
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={`${handle}'s photo`}
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover",
                    filter: config.imageFilter,
                  }}
                />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#9ca3af", fontSize: 14 }}>No photo</span>
                </div>
              )}
            </div>

            {/* Info section - right side */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "16px 0" }}>
              {/* Top - Handle & Project */}
              <div>
                {/* Handle with MAX badge */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <span 
                    style={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: "50%", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      fontSize: 18,
                      fontWeight: "bold",
                      background: config.accent, 
                      color: "white",
                      flexShrink: 0,
                    }}
                  >
                    {getPlatformIcon(platform)}
                  </span>
                  <span 
                    style={{ 
                      fontSize: 32, 
                      fontWeight: "bold", 
                      color: config.textPrimary,
                      fontFamily: config.displayFont,
                    }}
                  >
                    @{handle}
                  </span>
                  {isMax && (
                    <span 
                      style={{ 
                        padding: "4px 12px",
                        borderRadius: 6,
                        fontSize: 16,
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        background: config.accent, 
                        color: "white",
                        flexShrink: 0,
                      }}
                    >
                      MAX
                    </span>
                  )}
                </div>
                
                {/* Project */}
                {project && (
                  <p 
                    style={{ 
                      fontSize: 22, 
                      color: config.textMuted, 
                      marginBottom: 20,
                      fontFamily: config.bodyFont,
                    }}
                  >
                    <span style={{ opacity: 0.6 }}>Building</span>{" "}
                    <span style={{ color: config.textPrimary, fontWeight: 600 }}>{project}</span>
                  </p>
                )}

                {/* Model & Plan row with icons */}
                <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 20, marginBottom: 16, color: config.textMuted }}>
                  {primaryModel && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <TerminalIcon className="w-5 h-5 opacity-50" style={{ color: config.accent }} />
                      <span>{primaryModel}</span>
                    </div>
                  )}
                  {secondaryModel && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <LightbulbIcon className="w-5 h-5 opacity-50" style={{ color: config.accent }} />
                      <span>{secondaryModel}</span>
                    </div>
                  )}
                  {plan && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <AwardIcon className="w-5 h-5 opacity-50" style={{ color: config.accent }} />
                      <span>{plan}</span>
                    </div>
                  )}
                </div>

                {/* Tech stack */}
                {extras.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {extras.map((tech, i) => (
                      <span 
                        key={i}
                        style={{ 
                          fontSize: 18,
                          padding: "4px 12px",
                          borderRadius: 6,
                          background: config.badgeBg, 
                          color: config.textMuted, 
                          border: `1px solid ${config.badgeBorder}`,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom - Cafe Cursor branding */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <img 
                  src={cursorLogo}
                  alt="Cursor" 
                  style={{ width: 32, height: 32, filter: "brightness(0) opacity(0.5)" }}
                />
                <span style={{ fontSize: 20, color: config.textMuted }}>Cafe Cursor</span>
              </div>
            </div>
          </div>

          {/* Stamp - bottom right corner of polaroid */}
          <div style={{ position: "absolute", bottom: 70, right: 30 }}>
            <OGStamp 
              rotation={stampRotation}
              generatedAt={profile.generatedAt}
              locale={locale}
              theme={theme}
              config={config}
            />
          </div>

          {/* Tape decoration - top left */}
          <div 
            style={{ 
              position: "absolute",
              top: -10,
              left: 80,
              width: 100,
              height: 36,
              transform: "rotate(-12deg)",
              background: config.tapeGradient,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />

          {/* Bottom accent line */}
          <div 
            style={{ 
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 50,
              background: "white",
              display: "flex",
              alignItems: "center",
              padding: "0 24px",
            }}
          >
            <div 
              style={{ 
                height: 2,
                width: "100%",
                background: `linear-gradient(to right, transparent, ${config.accent}66, transparent)`,
              }}
            />
          </div>
        </div>
      </div>
    );
  }
);

OGCard.displayName = "OGCard";

