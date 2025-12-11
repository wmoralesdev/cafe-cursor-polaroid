import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Heart } from "lucide-react";
import { clsx } from "clsx";
import type { PolaroidRecord } from "@/lib/polaroids";
import { useLanguage } from "@/contexts/language-context";

interface DiscoverCardProps {
  item: PolaroidRecord & { matchScore?: number };
}

export function DiscoverCard({ item }: DiscoverCardProps) {
  const { t, lang } = useLanguage();
  const locale = lang === "es" ? es : enUS;
  const imageUrl = item.image_url || item.source_image_url;
  const matchScore = item.matchScore ?? 0;
  const matchLabel =
    matchScore >= 3
      ? t.community.swipe?.matchGreat
      : matchScore >= 1.5
        ? t.community.swipe?.matchGood
        : matchScore > 0
          ? t.community.swipe?.matchSome
          : null;

  return (
    <div className="relative w-full max-w-md mx-auto bg-card border border-border rounded-lg shadow-xl overflow-hidden select-none">
      {imageUrl ? (
        <div className="w-full aspect-340/459 bg-card-02">
          <img src={imageUrl} alt={item.title || "Polaroid"} className="w-full h-full object-cover" loading="lazy" />
        </div>
      ) : (
        <div className="w-full aspect-340/459 bg-card-02 flex items-center justify-center text-fg-muted text-sm">
          {t.imageUpload.noImage}
        </div>
      )}

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-fg font-semibold truncate">
              {item.profile.handles?.[0]?.handle ? `@${item.profile.handles[0].handle}` : "Unknown"}
            </p>
            <p className="text-xs text-fg-muted truncate">
              {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale })}
            </p>
          </div>
          {matchLabel && (
            <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-medium whitespace-nowrap">
              {matchLabel}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-fg-muted">
          {item.profile.primaryModel && (
            <span className="px-2 py-1 bg-card-02 rounded-sm">
              {t.community.swipe?.modelLabel}: {item.profile.primaryModel}
            </span>
          )}
          {item.profile.extras?.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-1 bg-card-02 rounded-sm">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-fg-muted">
          <div className="flex items-center gap-1">
            <Heart
              className={clsx("w-4 h-4", (item.viewer_has_liked || item.like_count) && "text-red-500")}
              strokeWidth={1.5}
              fill={item.viewer_has_liked ? "currentColor" : "none"}
            />
            {item.like_count ? <span className="text-xs font-medium">{item.like_count}</span> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

