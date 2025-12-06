import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useState, useMemo } from "react";
import { PolaroidCard } from "@/components/polaroid/polaroid-card";
import { useLanguage } from "@/contexts/language-context";
import { useCommunityPolaroids, useTogglePolaroidLike } from "@/hooks/use-polaroids-query";
import { useCommunityRealtime } from "@/hooks/use-community-realtime";
import type { PolaroidRecord } from "@/lib/polaroids";
import { Loader2, Heart, ChevronDown, Check } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { LoginModal } from "@/components/auth/login-modal";
import { clsx } from "clsx";

function getUserDisplayInfo(polaroid: PolaroidRecord, userAvatarUrl?: string | null) {
  const firstHandle = polaroid.profile.handles[0];
  const handle = firstHandle ? `@${firstHandle.handle}` : "@user";
  const name = firstHandle?.handle || "User";
  
  const avatar = userAvatarUrl || (() => {
    const avatarSeed = firstHandle?.handle || polaroid.user_id;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarSeed)}`;
  })();
  
  return { name, handle, avatar };
}

function formatLikerText(
  recentLikers: { actor_name: string; actor_avatar_url: string | null }[] | undefined,
  likeCount: number | undefined,
  t: { likedBy: string; andOthers: string }
): string | null {
  if (!likeCount || likeCount === 0) return null;
  if (!recentLikers || recentLikers.length === 0) return null;

  const names = recentLikers.slice(0, 2).map((l) => l.actor_name);
  const remaining = likeCount - names.length;

  if (remaining > 0) {
    return `${t.likedBy} ${names.join(", ")} ${t.andOthers.replace("{count}", String(remaining))}`;
  }
  return `${t.likedBy} ${names.join(", ")}`;
}

type SortOption = "recent" | "mostLiked";

export function CommunityMarquee() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { data: polaroids = [], isLoading: loading } = useCommunityPolaroids(20);
  const toggleLikeMutation = useTogglePolaroidLike();
  useCommunityRealtime();
  
  const locale = lang === "es" ? es : enUS;
  const userAvatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;

  // Sorting and filtering state
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [maxOnly, setMaxOnly] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Apply sorting and filtering
  const processedPolaroids = useMemo(() => {
    let result = [...polaroids];
    
    // Filter MAX only
    if (maxOnly) {
      result = result.filter((p) => p.profile.isMaxMode);
    }

    // Sort
    if (sortBy === "mostLiked") {
      result.sort((a, b) => (b.like_count ?? 0) - (a.like_count ?? 0));
    }
    // "recent" is already the default order from API

    return result;
  }, [polaroids, sortBy, maxOnly]);

  const handleLikeClick = (e: React.MouseEvent, polaroidId: string) => {
    e.stopPropagation();
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    toggleLikeMutation.mutate(polaroidId);
  };

  const duplicationFactor = processedPolaroids.length > 0 && processedPolaroids.length < 10 ? 10 : 5;
  const duplicatedPolaroids = processedPolaroids.length > 0 
    ? Array(duplicationFactor).fill(processedPolaroids).flat()
    : [];

  return (
    <section id="community" className="w-full py-8 overflow-hidden bg-gradient-to-b from-transparent via-card/30 to-transparent">
      <div className="mb-6 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-fg mb-2">
              {t.community.title}
            </h2>
            <p className="text-fg-muted font-body text-sm md:text-base">
              {t.community.subtitle}
            </p>
          </div>
          
          {/* Sorting and filtering controls */}
          <div className="flex items-center gap-3">
            {/* Sort dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-body text-fg-muted hover:text-fg bg-card-02 hover:bg-card-03 rounded-sm transition-colors border border-border/50"
              >
                <span>{t.community.sort.label}:</span>
                <span className="text-fg font-medium">
                  {sortBy === "recent" ? t.community.sort.recent : t.community.sort.mostLiked}
                </span>
                <ChevronDown className="w-4 h-4" strokeWidth={1.5} />
              </button>
              
              {showSortMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowSortMenu(false)} 
                  />
                  <div className="absolute right-0 mt-1 z-50 bg-card border border-border rounded-sm shadow-lg py-1 min-w-[140px]">
                    <button
                      type="button"
                      onClick={() => { setSortBy("recent"); setShowSortMenu(false); }}
                      className={clsx(
                        "w-full px-3 py-2 text-sm font-body text-left flex items-center justify-between hover:bg-card-02 transition-colors",
                        sortBy === "recent" ? "text-accent" : "text-fg"
                      )}
                    >
                      {t.community.sort.recent}
                      {sortBy === "recent" && <Check className="w-4 h-4" strokeWidth={2} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSortBy("mostLiked"); setShowSortMenu(false); }}
                      className={clsx(
                        "w-full px-3 py-2 text-sm font-body text-left flex items-center justify-between hover:bg-card-02 transition-colors",
                        sortBy === "mostLiked" ? "text-accent" : "text-fg"
                      )}
                    >
                      {t.community.sort.mostLiked}
                      {sortBy === "mostLiked" && <Check className="w-4 h-4" strokeWidth={2} />}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* MAX filter */}
            <button
              type="button"
              onClick={() => setMaxOnly(!maxOnly)}
              className={clsx(
                "px-3 py-1.5 text-sm font-body rounded-sm transition-colors border",
                maxOnly
                  ? "bg-accent text-white border-accent"
                  : "bg-card-02 text-fg-muted hover:text-fg hover:bg-card-03 border-border/50"
              )}
            >
              {t.community.filter.maxOnly}
            </button>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" strokeWidth={1.5} />
          </div>
        ) : duplicatedPolaroids.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-fg-muted font-body text-sm">{t.community.empty}</p>
          </div>
        ) : (
          <div 
            className="flex gap-6 group" 
            style={{ animation: "marquee 60s linear infinite" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.animationPlayState = "paused";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.animationPlayState = "running";
            }}
          >
            {duplicatedPolaroids.map((polaroid, index) => {
              const isCurrentUser = user && polaroid.user_id === user.id;
              const avatarUrl = isCurrentUser ? userAvatarUrl : null;
              const { name, handle, avatar } = getUserDisplayInfo(polaroid, avatarUrl);
              const likerText = formatLikerText(
                polaroid.recent_likers,
                polaroid.like_count,
                t.community.likes
              );
              const hasLiked = polaroid.viewer_has_liked ?? false;
              const likeCount = polaroid.like_count ?? 0;

              return (
                <div
                  key={`${polaroid.id}-${index}`}
                  className="flex-shrink-0 w-[280px] md:w-[320px]"
                >
                  <div className="card-panel p-4 rounded-sm shadow-sm hover:shadow-md transition-shadow duration-200">
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
                        {formatDistanceToNow(new Date(polaroid.created_at), { addSuffix: true, locale })}
                      </span>
                    </div>

                    <div className="relative">
                      <PolaroidCard
                        image={polaroid.source_image_url || polaroid.image_url || null}
                        profile={polaroid.profile}
                        variant="preview"
                        className="pointer-events-none"
                        zoom={1}
                        position={{ x: 0, y: 0 }}
                        source={polaroid.source}
                      />
                    </div>

                    {/* Like section */}
                    <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={(e) => handleLikeClick(e, polaroid.id)}
                        disabled={toggleLikeMutation.isPending}
                        className={clsx(
                          "flex items-center gap-1.5 px-2 py-1 rounded-sm transition-all duration-200",
                          hasLiked
                            ? "text-red-500 hover:text-red-600"
                            : "text-fg-muted hover:text-red-500"
                        )}
                        title={user ? t.community.likes.like : t.community.likes.loginToLike}
                      >
                        <Heart
                          className={clsx(
                            "w-4 h-4 transition-transform duration-200",
                            hasLiked && "fill-current scale-110"
                          )}
                          strokeWidth={hasLiked ? 0 : 1.5}
                        />
                        {likeCount > 0 && (
                          <span className="text-xs font-medium font-mono">{likeCount}</span>
                        )}
                      </button>
                      
                      {likerText && (
                        <p className="text-[10px] text-fg-muted font-body truncate max-w-[180px]" title={likerText}>
                          {likerText}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Login modal for unauthenticated like attempts */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </section>
  );
}
