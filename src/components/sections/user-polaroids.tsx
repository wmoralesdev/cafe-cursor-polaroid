import { useAuth } from "@/hooks/use-auth";
import { PolaroidCard } from "@/components/polaroid/polaroid-card";
import { useLanguage } from "@/contexts/language-context";
import { useUserPolaroids } from "@/hooks/use-polaroids-query";
import type { PolaroidRecord } from "@/lib/polaroids";
import { Loader2, Plus } from "lucide-react";

interface UserPolaroidsProps {
  onSelectPolaroid?: (polaroid: PolaroidRecord) => void;
  onAddNew?: () => void;
  activePolaroidId?: string | null;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }
  const years = Math.floor(diffDays / 365);
  return `${years} ${years === 1 ? "year" : "years"} ago`;
}

function getUserDisplayInfo(polaroid: PolaroidRecord, userAvatarUrl?: string | null) {
  const firstHandle = polaroid.profile.handles[0];
  const handle = firstHandle ? `@${firstHandle.handle}` : "@user";
  const name = firstHandle?.handle || "You";
  
  const avatar = userAvatarUrl || (() => {
    const avatarSeed = firstHandle?.handle || polaroid.user_id;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarSeed)}`;
  })();
  
  return { name, handle, avatar };
}

export function UserPolaroids({ onSelectPolaroid, onAddNew, activePolaroidId }: UserPolaroidsProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { data: polaroids = [], isLoading: loading, error } = useUserPolaroids();
  
  const userAvatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;

  if (!user) {
    return null;
  }

  const errorMessage = error instanceof Error ? error.message : error ? "Failed to load polaroids" : null;

  return (
    <section className="w-full py-12 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="mb-8">
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-fg mb-2">
          {t.userPolaroids.title}
        </h2>
        <p className="text-fg-muted font-body text-sm md:text-base">
          {t.userPolaroids.subtitle}
        </p>
      </div>

      {user && onAddNew && (
        <div className="mb-6">
          <button
            type="button"
            onClick={onAddNew}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-sm font-medium text-sm hover:bg-accent/90 transition-colors duration-150"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            <span>New card</span>
          </button>
        </div>
      )}

      {loading ? (
        <div className="card-panel p-12 rounded-sm text-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-4" strokeWidth={1.5} />
          <p className="text-fg-muted font-body text-sm">Loading your cards...</p>
        </div>
      ) : errorMessage ? (
        <div className="card-panel p-12 rounded-sm text-center">
          <p className="text-fg-muted font-body text-lg mb-2">Error loading cards</p>
          <p className="text-fg-muted font-body text-sm">{errorMessage}</p>
        </div>
      ) : polaroids.length === 0 ? (
        <div className="card-panel p-12 rounded-sm text-center">
          <p className="text-fg-muted font-body text-lg mb-2">
            {t.userPolaroids.empty.title}
          </p>
          <p className="text-fg-muted font-body text-sm">
            {t.userPolaroids.empty.subtitle}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polaroids.map((polaroid) => {
            const { name, handle, avatar } = getUserDisplayInfo(polaroid, userAvatarUrl);
            const isActive = activePolaroidId === polaroid.id;
            return (
              <div
                key={polaroid.id}
                onClick={() => onSelectPolaroid?.(polaroid)}
                className={`card-panel p-4 rounded-sm shadow-sm transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? "ring-2 ring-accent shadow-md" 
                    : "hover:shadow-md hover:ring-1 hover:ring-accent/30"
                }`}
              >
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border/50">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-10 h-10 rounded-full border-2 border-accent/20"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-fg text-sm truncate">
                      {name}
                    </p>
                    <p className="font-mono text-xs text-fg-muted truncate">
                      {handle}
                    </p>
                  </div>
                  <span className="text-xs text-fg-muted font-body whitespace-nowrap">
                    {formatRelativeTime(polaroid.created_at)}
                  </span>
                </div>

                <div className="relative pointer-events-none">
                  <PolaroidCard
                    image={polaroid.image_url || null}
                    profile={polaroid.profile}
                    variant="preview"
                    className="pointer-events-none"
                    zoom={1}
                    position={{ x: 0, y: 0 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

