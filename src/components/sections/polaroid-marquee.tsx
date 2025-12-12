import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { clsx } from "clsx";
import { Wifi, WifiOff, RefreshCw, Sparkles, Github, Twitter } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useInfiniteCommunityPolaroids } from "@/hooks/use-polaroids-query";
import { useMarqueeRealtime, type ConnectionStatus } from "@/hooks/use-marquee-realtime";
import { useAuth } from "@/hooks/use-auth";
import { PolaroidModal } from "@/components/polaroid/polaroid-modal";
import type { PolaroidRecord } from "@/lib/polaroids";

interface PolaroidMarqueeSectionProps {
  showSignInOverlay?: boolean;
}

// Fixed thumbnail dimensions for deterministic scroll compensation
const THUMBNAIL_WIDTH = 220;
const THUMBNAIL_GAP = 16;
const ITEM_TOTAL_WIDTH = THUMBNAIL_WIDTH + THUMBNAIL_GAP;

// Auto-scroll speed (pixels per frame at ~60fps)
const AUTO_SCROLL_SPEED = 0.3;
// Time to wait after interaction before resuming auto-scroll (ms)
const AUTO_SCROLL_RESUME_DELAY = 2000;

function ConnectionIndicator({ status }: { status: ConnectionStatus }) {
  const { t } = useLanguage();

  const statusConfig = {
    connecting: {
      icon: <RefreshCw className="w-3 h-3 animate-spin" />,
      label: t.marquee.status.connecting,
      color: "text-fg-muted",
    },
    live: {
      icon: <Wifi className="w-3 h-3" />,
      label: t.marquee.status.live,
      color: "text-green-500",
    },
    updating: {
      icon: <RefreshCw className="w-3 h-3 animate-spin" />,
      label: t.marquee.status.updating,
      color: "text-accent",
    },
    offline: {
      icon: <WifiOff className="w-3 h-3" />,
      label: t.marquee.status.offline,
      color: "text-red-500",
    },
  };

  const config = statusConfig[status];

  return (
    <div className={clsx("flex items-center gap-1.5 text-xs font-medium", config.color)}>
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
}

function MarqueeThumbnail({ 
  item, 
  onClick 
}: { 
  item: PolaroidRecord;
  onClick: () => void;
}) {
  const imageUrl = item.image_url || item.source_image_url;
  const handle = item.profile?.handles?.[0]?.handle;

  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 bg-card border border-border rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] hover:border-accent/50 transition-all duration-200 cursor-pointer group text-left"
      style={{ width: THUMBNAIL_WIDTH }}
    >
      <div className="aspect-340/459 bg-card-02 overflow-hidden relative">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={handle || "Polaroid"}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center pb-4">
              <span className="text-white text-xs font-medium px-3 py-1 bg-black/40 rounded-full backdrop-blur-sm">
                View card
              </span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-fg-muted text-xs">
            No image
          </div>
        )}
      </div>
      {handle && (
        <div className="px-3 py-2.5 truncate bg-card">
          <span className="text-sm text-fg font-medium group-hover:text-accent transition-colors">@{handle}</span>
        </div>
      )}
    </button>
  );
}

function SkeletonThumbnail() {
  return (
    <div
      className="shrink-0 bg-card border border-border rounded-lg overflow-hidden shadow-sm animate-pulse"
      style={{ width: THUMBNAIL_WIDTH }}
    >
      <div className="aspect-340/459 bg-card-02" />
      <div className="px-3 py-2.5">
        <div className="h-4 bg-card-02 rounded w-24" />
      </div>
    </div>
  );
}

function NewItemsPill({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  const { t } = useLanguage();

  if (count === 0) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white text-xs font-medium rounded-full shadow-lg hover:bg-accent/90 transition-colors animate-pulse"
    >
      <Sparkles className="w-3 h-3" />
      {t.marquee.newItems} · {count}
    </button>
  );
}

function SignInOverlayCTA() {
  const { t } = useLanguage();
  const { signInWithGitHub, signInWithTwitter } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleGitHubLogin = async () => {
    setIsLoading("github");
    try {
      await signInWithGitHub();
    } catch (error) {
      console.error("GitHub login failed:", error);
      setIsLoading(null);
    }
  };

  const handleTwitterLogin = async () => {
    setIsLoading("twitter");
    try {
      await signInWithTwitter();
    } catch (error) {
      console.error("Twitter login failed:", error);
      setIsLoading(null);
    }
  };

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
      {/* Gradient overlay - lighter/more transparent at top to see content */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
      
      {/* CTA Card - Glassmorphism, less boxy */}
      <div className="relative pointer-events-auto mt-12 bg-card/60 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-8 max-w-sm mx-4 text-center">
        <h3 className="font-display text-2xl font-semibold text-fg mb-2">
          {t.marquee.signedOut?.title || "Get on the wall"}
        </h3>
        <p className="text-fg-muted font-body text-sm mb-6 leading-relaxed">
          {t.marquee.signedOut?.subtitle || "Sign in to create your dev card and join the community"}
        </p>
        
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleGitHubLogin}
            disabled={isLoading !== null}
            className={clsx(
              "w-full py-2.5 px-4 rounded-md font-medium text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 font-body",
              "bg-[#24292e] text-white hover:bg-[#1a1e22] hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            )}
          >
            <Github className="w-4 h-4" strokeWidth={1.5} />
            {isLoading === "github" ? t.editor.auth.connecting : t.editor.auth.github}
          </button>

          <button
            type="button"
            onClick={handleTwitterLogin}
            disabled={isLoading !== null}
            className={clsx(
              "w-full py-2.5 px-4 rounded-md font-medium text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 font-body",
              "bg-black text-white hover:bg-gray-900 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            )}
          >
            <Twitter className="w-4 h-4" strokeWidth={1.5} />
            {isLoading === "twitter" ? t.editor.auth.connecting : t.editor.auth.twitter}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PolaroidMarqueeSection({ showSignInOverlay = false }: PolaroidMarqueeSectionProps) {
  const { t } = useLanguage();
  const railRef = useRef<HTMLElement>(null);
  const autoScrollRef = useRef<number | null>(null);
  const lastInteractionRef = useRef<number>(0);
  const isAutoScrollingRef = useRef(true);

  const [isDragging, setIsDragging] = useState(false);
  const [selectedPolaroidId, setSelectedPolaroidId] = useState<string | null>(null);
  const dragStartRef = useRef({ x: 0, scrollLeft: 0 });

  // Data
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteCommunityPolaroids();

  // Realtime
  const { status, pendingCount, mergePendingItems } = useMarqueeRealtime();

  // Flatten pages into a single array
  const allItems = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.items);
  }, [data]);

  // Mark interaction (pauses auto-scroll)
  const markInteraction = useCallback(() => {
    lastInteractionRef.current = Date.now();
  }, []);

  // Check if we should load more (near end of rail)
  const checkLoadMore = useCallback(() => {
    const rail = railRef.current;
    if (!rail || !hasNextPage || isFetchingNextPage) return;

    const threshold = rail.clientWidth * 1.5;
    const distanceFromEnd = rail.scrollWidth - rail.scrollLeft - rail.clientWidth;

    if (distanceFromEnd < threshold) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Handle wheel events (map vertical to horizontal)
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      const rail = railRef.current;
      if (!rail) return;

      // Only hijack if hovering over rail
      if (!rail.contains(e.target as Node)) return;

      e.preventDefault();
      markInteraction();

      // Apply both deltaY and deltaX for trackpad support
      rail.scrollLeft += e.deltaY + e.deltaX;
      checkLoadMore();
    },
    [markInteraction, checkLoadMore]
  );

  // Drag-to-pan handlers
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const rail = railRef.current;
      if (!rail) return;

      setIsDragging(true);
      markInteraction();
      dragStartRef.current = {
        x: e.clientX,
        scrollLeft: rail.scrollLeft,
      };
      rail.setPointerCapture(e.pointerId);
    },
    [markInteraction]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const rail = railRef.current;
      if (!rail) return;

      const dx = e.clientX - dragStartRef.current.x;
      rail.scrollLeft = dragStartRef.current.scrollLeft - dx;
      checkLoadMore();
    },
    [isDragging, checkLoadMore]
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    const rail = railRef.current;
    if (rail) {
      rail.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
  }, []);

  // Handle scroll event for infinite loading
  const handleScroll = useCallback(() => {
    checkLoadMore();
  }, [checkLoadMore]);

  // Handle "New" pill click - merge pending items with scroll compensation
  const handleMergePending = useCallback(() => {
    const rail = railRef.current;
    if (!rail) {
      mergePendingItems();
      return;
    }

    const prevScrollLeft = rail.scrollLeft;
    const insertedCount = mergePendingItems();
    const insertedWidth = insertedCount * ITEM_TOTAL_WIDTH;

    // After React re-renders, compensate scroll position
    requestAnimationFrame(() => {
      rail.scrollLeft = prevScrollLeft + insertedWidth;
    });
  }, [mergePendingItems]);

  // Auto-scroll loop
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const autoScroll = () => {
      const now = Date.now();
      const timeSinceInteraction = now - lastInteractionRef.current;

      // Only auto-scroll if enough time has passed since last interaction
      if (timeSinceInteraction > AUTO_SCROLL_RESUME_DELAY && isAutoScrollingRef.current) {
        // Check if we've reached the end
        const maxScroll = rail.scrollWidth - rail.clientWidth;
        if (rail.scrollLeft >= maxScroll - 1) {
          // Loop back to start
          rail.scrollLeft = 0;
        } else {
          rail.scrollLeft += AUTO_SCROLL_SPEED;
        }
        checkLoadMore();
      }

      autoScrollRef.current = requestAnimationFrame(autoScroll);
    };

    autoScrollRef.current = requestAnimationFrame(autoScroll);

    return () => {
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
      }
    };
  }, [checkLoadMore]);

  // Attach wheel listener with passive: false to allow preventDefault
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    rail.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      rail.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  // Pause auto-scroll on hover
  const handleMouseEnter = useCallback(() => {
    markInteraction();
  }, [markInteraction]);

  return (
    <section className="w-full py-12 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Carded container */}
        <div className="bg-card/30 border border-border/50 rounded-xl p-6 sm:p-8 backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs uppercase tracking-wider text-accent font-semibold">Live</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-fg tracking-tight leading-tight">
                {t.marquee.title}
              </h2>
              <p className="text-fg-muted font-body text-lg mt-3 max-w-xl leading-relaxed">
                {t.marquee.subtitle}
              </p>
            </div>
            <ConnectionIndicator status={status} />
          </div>

          {/* Rail container */}
          <div className="relative">
            {showSignInOverlay && <SignInOverlayCTA />}
            <NewItemsPill count={pendingCount} onClick={handleMergePending} />

            {isLoading ? (
              <div className="flex gap-4 overflow-hidden py-2">
                <SkeletonThumbnail />
                <SkeletonThumbnail />
                <SkeletonThumbnail />
                <SkeletonThumbnail />
                <SkeletonThumbnail />
                <SkeletonThumbnail />
              </div>
            ) : allItems.length === 0 ? (
              <div className="flex items-center justify-center py-16 text-fg-muted bg-card/50 rounded-lg border border-border/50">
                <div className="text-center">
                  <Sparkles className="w-8 h-8 mx-auto mb-3 text-accent/50" />
                  <p className="font-body">No polaroids yet</p>
                  <p className="text-sm text-fg-muted/70 mt-1">Be the first to join the wall!</p>
                </div>
              </div>
            ) : (
              <section
                ref={railRef}
                aria-label="Polaroid gallery"
                className={clsx(
                  "flex gap-4 overflow-x-auto scrollbar-hide py-2 -mx-2 px-2 outline-none",
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                )}
                style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onScroll={handleScroll}
                onMouseEnter={handleMouseEnter}
              >
                {allItems.map((item) => (
                  <MarqueeThumbnail 
                    key={item.id} 
                    item={item} 
                    onClick={() => setSelectedPolaroidId(item.id)}
                  />
                ))}

                {/* Loading indicator at end */}
                {isFetchingNextPage && (
                  <div className="shrink-0 flex items-center justify-center px-4">
                    <span className="text-xs text-fg-muted">{t.marquee.loadMore}</span>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {selectedPolaroidId && (
        <PolaroidModal 
          polaroidId={selectedPolaroidId} 
          onClose={() => setSelectedPolaroidId(null)} 
        />
      )}
    </section>
  );
}
