import { Sparkles, SquareTerminal, Lightbulb, Award, Linkedin } from "lucide-react";
import type { CursorProfile, CursorModel, CursorFeature, PlanTier, CursorTenure, SocialPlatform } from "@/types/form";
import { CURSOR_MODELS, CURSOR_FEATURES, PLAN_TIERS, CURSOR_TENURES } from "@/constants/cursor-data";
import { XIcon } from "@/components/ui/x-icon";

interface CursorProfileRowProps {
  profile: CursorProfile;
}

const getModelLabel = (id: CursorModel) => CURSOR_MODELS.find(m => m.id === id)?.label || id;
const getFeatureLabel = (id: CursorFeature) => CURSOR_FEATURES.find(f => f.id === id)?.label || id;
const getPlanLabel = (id: PlanTier) => PLAN_TIERS.find(p => p.id === id)?.label || id;
const getTenureLabel = (id: CursorTenure) => CURSOR_TENURES.find(t => t.id === id)?.label || id;

const PlatformIcon = ({ platform }: { platform: SocialPlatform }) => {
  if (platform === "linkedin") return <Linkedin className="w-3 h-3" strokeWidth={1.5} />;
  return <XIcon className="w-3 h-3" />;
};

export function CursorProfileRow({ profile }: CursorProfileRowProps) {
  const handles = profile.handles || [];
  const hasHandles = handles.some(h => h.handle);
  
  if (!hasHandles && !profile.primaryModel) return null;

  const tenureLabel = getTenureLabel(profile.cursorSince);

  return (
    <div className="flex flex-col gap-2 font-body">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          {handles.map((h, i) => (
            h.handle && (
              <div key={i} className="flex items-center gap-1.5 text-fg">
                <PlatformIcon platform={h.platform} />
                <span className={i === 0 ? "font-display text-lg font-semibold" : "font-display text-sm font-medium text-fg-muted"}>
                  @{h.handle}
                </span>
              </div>
            )
          ))}
          {!hasHandles && (
            <span className="font-display text-lg font-semibold text-fg">@handle</span>
          )}
        </div>
        {profile.isMaxMode && (
          <div className="px-1.5 py-0.5 bg-accent text-white rounded-sm text-[8px] font-bold uppercase tracking-wider shrink-0">
            MAX
          </div>
        )}
      </div>

      {profile.projectType && (
        <div className="text-sm text-fg-muted line-clamp-1 overflow-hidden text-ellipsis" title={profile.projectType}>
          Building: {profile.projectType}
        </div>
      )}

      <div className="flex items-center gap-2 text-[11px] text-fg-muted flex-wrap">
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
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-accent/10 text-accent border border-accent/30 uppercase tracking-wide">
          <Sparkles className="w-2 h-2" />
          {getFeatureLabel(profile.favoriteFeature)}
        </span>

        {tenureLabel && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-card-01 text-fg-muted border border-border/50 font-mono">
            Since {tenureLabel}
          </span>
        )}

        {profile.extras?.slice(0, 2).map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-card-01 text-fg-muted border border-border/50 font-mono"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
