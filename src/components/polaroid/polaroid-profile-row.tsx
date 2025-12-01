import { Sparkles, Cpu, Zap, Brain, Flame } from "lucide-react";
import type { CursorProfile, CursorModel, CursorFeature, PlanTier } from "@/types/form";
import { CURSOR_MODELS, CURSOR_FEATURES, PLAN_TIERS } from "@/constants/cursor-data";

interface CursorProfileRowProps {
  profile: CursorProfile;
}

const getModelLabel = (id: CursorModel) => CURSOR_MODELS.find(m => m.id === id)?.label || id;
const getFeatureLabel = (id: CursorFeature) => CURSOR_FEATURES.find(f => f.id === id)?.label || id;
const getPlanLabel = (id: PlanTier) => PLAN_TIERS.find(p => p.id === id)?.label || id;

export function CursorProfileRow({ profile }: CursorProfileRowProps) {
  // Ensure we have data to show
  if (!profile.projectType && !profile.primaryModel) return null;

  return (
    <div className="flex flex-col gap-3 border-b border-border/50 last:border-0 pb-4 last:pb-0 mb-4 last:mb-0 font-body">
      {/* Primary Line: Project */}
      <div className="text-fg">
        <div className="flex items-center justify-between mb-1">
          <div className="text-[10px] font-mono uppercase tracking-widest text-fg-muted opacity-80">
            Building
          </div>
          {profile.isMaxMode && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-black text-white rounded-sm text-[9px] font-bold uppercase tracking-wider shadow-sm animate-pulse">
              <Flame className="w-2.5 h-2.5 text-gold fill-gold" />
              <span>Max Mode</span>
            </div>
          )}
        </div>
        <div className="font-display text-xl font-semibold leading-tight text-fg line-clamp-2 overflow-hidden text-ellipsis" title={profile.projectType}>
          {profile.projectType || "Something amazing..."}
        </div>
      </div>

      {/* Secondary Line: Context */}
      <div className="flex flex-col gap-1.5 text-sm text-fg-muted">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5" title="Coding Model">
            <Cpu className="w-3.5 h-3.5 opacity-70" />
            <span className="font-medium">{getModelLabel(profile.primaryModel)}</span>
          </div>
          <span className="opacity-30 text-[10px]">•</span>
          <div className="flex items-center gap-1.5" title="Thinking Model">
            <Brain className="w-3.5 h-3.5 opacity-70" />
            <span className="font-medium">{getModelLabel(profile.secondaryModel)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap mt-0.5">
           <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 opacity-70" />
            <span>{getPlanLabel(profile.planTier)} Plan</span>
          </div>
        </div>
      </div>
      
      {/* Tertiary Line: Feature & Extras */}
      <div className="flex flex-wrap gap-1.5 mt-1">
        {/* Favorite Feature Pill */}
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold/10 text-gold border border-gold/30 uppercase tracking-wide shadow-sm">
          <Sparkles className="w-2.5 h-2.5" />
          {getFeatureLabel(profile.favoriteFeature)}
        </span>

        {/* Tech Extras Pills */}
        {profile.extras?.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-linen text-fg-muted border border-border/50 shadow-sm font-mono"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

// Merged view for multiple profiles (Team View)
export function MergedCursorRow({ profiles }: { profiles: CursorProfile[] }) {
    // Just stack them for simplicity
    return (
      <div className="flex flex-col gap-6">
        {profiles.map((p, i) => (
          <CursorProfileRow key={i} profile={p} />
        ))}
      </div>
    );
}
