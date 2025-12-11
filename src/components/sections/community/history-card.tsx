import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Heart, Sparkles, ExternalLink } from "lucide-react";
import type { SwipeHistoryItem, MatchItem } from "@/lib/polaroids";
import { useLanguage } from "@/contexts/language-context";

interface HistoryCardProps {
  item: SwipeHistoryItem | MatchItem;
  showMatchBadge?: boolean;
}

function getSocialUrl(handle: string, platform: "x" | "linkedin"): string {
  if (platform === "x") {
    return `https://x.com/${handle.replace("@", "")}`;
  }
  return `https://linkedin.com/in/${handle.replace("@", "")}`;
}

export function HistoryCard({ item, showMatchBadge }: HistoryCardProps) {
  const { t, lang } = useLanguage();
  const locale = lang === "es" ? es : enUS;
  const imageUrl = item.image_url || item.source_image_url;
  const handleEntry = item.profile.handles?.[0];
  const handle = handleEntry?.handle;
  const platform = handleEntry?.platform || "x";
  const swipedAt = "swiped_at" in item ? item.swiped_at : null;
  const matchedAt = "matched_at" in item ? item.matched_at : null;
  const techStack = item.profile.extras?.slice(0, 3) || [];
  const project = item.title || item.profile.projectType;
  const socialUrl = handle ? getSocialUrl(handle, platform) : null;

  return (
    <div className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 transition-all duration-200">
      {/* Image Section */}
      <div className="relative aspect-[3/4] bg-card-02 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={item.title || "Polaroid"} 
            className="w-full h-full object-contain object-bottom group-hover:scale-105 transition-transform duration-300" 
            loading="lazy" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-fg-muted text-sm">
            {t.imageUpload.noImage}
          </div>
        )}
        
        {/* Match badge */}
        {showMatchBadge && (
          <div className="absolute top-3 right-3 z-10">
            <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-green-500 text-white shadow-lg">
              <Sparkles className="w-3 h-3" />
              {t.community.history?.mutualMatch || "Match"}
            </span>
          </div>
        )}
      </div>
      
      {/* User info section - moved outside image */}
      <div className="px-4 pt-3 pb-2 bg-card border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-fg font-semibold text-sm truncate">
              {handle ? `@${handle}` : "Unknown"}
            </p>
            {item.profile.primaryModel && (
              <p className="text-fg-muted text-xs truncate mt-0.5">{item.profile.primaryModel}</p>
            )}
          </div>
          {item.profile.isMaxMode && (
            <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded bg-accent/10 text-accent whitespace-nowrap">
              MAX
            </span>
          )}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Project */}
        {project && (
          <div>
            <p className="text-xs text-fg-muted mb-1">{t.community.history?.buildingLabel || "Building"}</p>
            <p className="text-fg text-sm font-medium line-clamp-2 leading-snug">{project}</p>
          </div>
        )}
        
        {/* Tech stack tags */}
        {techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {techStack.map((tech) => (
              <span 
                key={tech} 
                className="px-2 py-0.5 text-xs bg-card-02 text-fg-muted rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        
        {/* Footer with time, likes, and connect button */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <p className="text-xs text-fg-muted">
            {matchedAt
              ? formatDistanceToNow(new Date(matchedAt), { addSuffix: true, locale })
              : swipedAt
                ? formatDistanceToNow(new Date(swipedAt), { addSuffix: true, locale })
                : null}
          </p>
          <div className="flex items-center gap-2">
            {item.like_count ? (
              <span className="flex items-center gap-1 text-xs text-fg-muted">
                <Heart className="w-3.5 h-3.5 text-red-500" fill="currentColor" />
                {item.like_count}
              </span>
            ) : null}
            {socialUrl && (
              <a
                href={socialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-accent text-white hover:opacity-90 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <span>{t.community.history?.connectButton || "Connect"}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

