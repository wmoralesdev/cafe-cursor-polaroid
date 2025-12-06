import { Sparkles, SquareTerminal, Lightbulb, Award, Linkedin } from "lucide-react";
import { clsx } from "clsx";
import type { CursorProfile, CursorModel, CursorFeature, PlanTier, CursorTenure, SocialPlatform, PolaroidTheme } from "@/types/form";
import { CURSOR_MODELS, CURSOR_FEATURES, PLAN_TIERS, CURSOR_TENURES } from "@/constants/cursor-data";
import { polaroidThemes } from "@/constants/polaroid-themes";
import { XIcon } from "@/components/ui/x-icon";
import { SourceBadge } from "./source-badge";

interface CursorProfileRowProps {
  profile: CursorProfile;
  source?: string | null;
}

const getModelLabel = (id: CursorModel) => CURSOR_MODELS.find(m => m.id === id)?.label || id;
const getFeatureLabel = (id: CursorFeature) => CURSOR_FEATURES.find(f => f.id === id)?.label || id;
const getPlanLabel = (id: PlanTier) => PLAN_TIERS.find(p => p.id === id)?.label || id;
const getTenureLabel = (id: CursorTenure) => CURSOR_TENURES.find(t => t.id === id)?.label || id;

const PlatformIcon = ({ platform }: { platform: SocialPlatform }) => {
  if (platform === "linkedin") return <Linkedin className="w-3 h-3" strokeWidth={1.5} />;
  return <XIcon className="w-3 h-3" />;
};

// Feature badge styles based on theme
function FeatureBadge({ 
  label, 
  theme 
}: { 
  label: string; 
  theme: PolaroidTheme;
}) {
  const config = polaroidThemes[theme] ?? polaroidThemes.classic;
  
  const baseClasses = "inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide";
  
  switch (config.featureBadgeStyle) {
    case "square":
      return (
        <span 
          className={clsx(baseClasses, "px-2 py-1 rounded-none")}
          style={{ 
            backgroundColor: config.accentLight,
            color: config.accent,
            border: `1px solid ${config.badgeBorder}`,
          }}
        >
          <Sparkles className="w-2 h-2" />
          {label}
        </span>
      );
    case "outline":
      return (
        <span 
          className={clsx(baseClasses, "px-2 py-0.5 rounded-sm bg-transparent")}
          style={{ 
            color: config.accent,
            border: `1.5px solid ${config.accent}`,
          }}
        >
          <Sparkles className="w-2 h-2" />
          {label}
        </span>
      );
    case "handwritten":
      return (
        <span 
          className="inline-flex items-center gap-1 text-[10px] font-medium tracking-normal px-2 py-0.5"
          style={{ 
            color: config.accent,
            fontFamily: config.displayFont,
            borderBottom: `2px solid ${config.accent}`,
            transform: "rotate(-1deg)",
          }}
        >
          ✦ {label}
        </span>
      );
    case "tag":
      return (
        <span 
          className={clsx(baseClasses, "px-2 py-0.5 rounded-none")}
          style={{ 
            backgroundColor: config.accent,
            color: "white",
          }}
        >
          {label}
        </span>
      );
    case "minimal":
      return (
        <span 
          className={clsx(baseClasses, "px-1.5 py-0.5")}
          style={{ 
            color: config.accent,
            borderBottom: `1px solid ${config.accent}`,
          }}
        >
          {label}
        </span>
      );
    case "pill":
    default:
      return (
        <span 
          className={clsx(baseClasses, "px-1.5 py-0.5 rounded-full")}
          style={{ 
            backgroundColor: config.accentLight,
            color: config.accent,
            border: `1px solid ${config.badgeBorder}`,
          }}
        >
          <Sparkles className="w-2 h-2" />
          {label}
        </span>
      );
  }
}

// Tech badge styles based on theme
function TechBadge({ 
  label, 
  theme 
}: { 
  label: string; 
  theme: PolaroidTheme;
}) {
  const config = polaroidThemes[theme] ?? polaroidThemes.classic;
  
  const baseClasses = "inline-flex items-center text-[9px] font-medium";
  
  switch (config.techBadgeStyle) {
    case "square":
      return (
        <span 
          className={clsx(baseClasses, "px-1.5 py-0.5 rounded-none")}
          style={{ 
            backgroundColor: config.badgeBg,
            color: config.textMuted,
            border: `1px solid ${config.badgeBorder}`,
            fontFamily: config.monoFont,
          }}
        >
          {label}
        </span>
      );
    case "underline":
      return (
        <span 
          className={clsx(baseClasses, "px-1 py-0.5")}
          style={{ 
            color: config.textMuted,
            fontFamily: config.monoFont,
            borderBottom: `1px dashed ${config.textMuted}`,
          }}
        >
          {label}
        </span>
      );
    case "minimal":
      return (
        <span 
          className={clsx(baseClasses, "px-1 py-0.5")}
          style={{ 
            color: config.textMuted,
            fontFamily: config.monoFont,
          }}
        >
          {label}
        </span>
      );
    case "pill":
    default:
      return (
        <span 
          className={clsx(baseClasses, "px-1.5 py-0.5 rounded-full")}
          style={{ 
            backgroundColor: config.badgeBg,
            color: config.textMuted,
            border: `1px solid ${config.badgeBorder}`,
            fontFamily: config.monoFont,
          }}
        >
          {label}
        </span>
      );
  }
}

export function CursorProfileRow({ profile, source }: CursorProfileRowProps) {
  const handles = profile.handles || [];
  const hasHandles = handles.some(h => h.handle);
  const rawTheme = profile.polaroidTheme ?? "classic";
  const theme = polaroidThemes[rawTheme] ? rawTheme : "classic";
  const config = polaroidThemes[theme];
  
  if (!hasHandles && !profile.primaryModel) return null;

  const tenureLabel = getTenureLabel(profile.cursorSince);

  return (
    <div 
      className="flex flex-col gap-2"
      style={{ fontFamily: config.bodyFont }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          {handles.map((h, i) => (
            h.handle && (
              <div 
                key={i} 
                className="flex items-center gap-1.5"
                style={{ color: config.textPrimary }}
              >
                <PlatformIcon platform={h.platform} />
                <span 
                  className={i === 0 ? "text-lg font-semibold" : "text-sm font-medium"}
                  style={{ 
                    fontFamily: config.displayFont,
                    color: i === 0 ? config.textPrimary : config.textMuted,
                  }}
                >
                  @{h.handle}
                </span>
              </div>
            )
          ))}
          {!hasHandles && (
            <span 
              className="text-lg font-semibold"
              style={{ fontFamily: config.displayFont, color: config.textPrimary }}
            >
              @handle
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {source && source !== "direct" && (
            <SourceBadge source={source} theme={theme} />
          )}
          {profile.isMaxMode && (
            <div 
              className="px-1.5 py-0.5 text-white rounded-sm text-[8px] font-bold uppercase tracking-wider"
              style={{ backgroundColor: config.accent }}
            >
              MAX
            </div>
          )}
        </div>
      </div>

      {profile.projectType && (
        <div 
          className="text-sm line-clamp-1 overflow-hidden text-ellipsis" 
          style={{ color: config.textMuted, fontFamily: config.bodyFont }}
          title={profile.projectType}
        >
          Building: {profile.projectType}
        </div>
      )}

      <div 
        className="flex items-center gap-2 text-[11px] flex-wrap"
        style={{ color: config.textMuted }}
      >
        <div className="flex items-center gap-1" title="Coding Model">
          <SquareTerminal className="w-3 h-3 opacity-60" />
          <span>{getModelLabel(profile.primaryModel)}</span>
        </div>
        <span className="opacity-30">•</span>
        <div className="flex items-center gap-1" title="Thinking Model">
          <Lightbulb className="w-3 h-3 opacity-60" />
          <span>{getModelLabel(profile.secondaryModel)}</span>
        </div>
        <span className="opacity-30">•</span>
        <div className="flex items-center gap-1">
          <Award className="w-3 h-3 opacity-60" />
          <span>{getPlanLabel(profile.planTier)}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1 mt-0.5">
        <FeatureBadge 
          label={getFeatureLabel(profile.favoriteFeature)} 
          theme={theme} 
        />

        {tenureLabel && (
          <TechBadge label={`Since ${tenureLabel}`} theme={theme} />
        )}

        {profile.extras?.map((tech) => (
          <TechBadge key={tech} label={tech} theme={theme} />
        ))}
      </div>
    </div>
  );
}
