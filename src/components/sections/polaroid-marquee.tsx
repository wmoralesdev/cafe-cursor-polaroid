import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { clsx } from "clsx";
import { Wifi, WifiOff, RefreshCw, Sparkles, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useInfiniteCommunityPolaroids } from "@/hooks/use-polaroids-query";
import { useMarqueeRealtime, type ConnectionStatus } from "@/hooks/use-marquee-realtime";
import { PolaroidTile } from "@/components/polaroid/polaroid-tile";
import { PolaroidModal } from "@/components/polaroid/polaroid-modal";
import { SectionHeader } from "@/components/ui/section-header";

interface PolaroidMarqueeSectionProps {
  showSignInOverlay?: boolean;
}

// Fixed thumbnail dimensions for deterministic scroll compensation
const THUMBNAIL_WIDTH = 280;
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
    <div className={clsx(
      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
      "bg-card/80 backdrop-blur-sm border border-border/50",
      config.color
    )}>
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
}

function SkeletonThumbnail() {
  return (
    <div
      className="shrink-0 bg-card border border-border rounded-lg overflow-hidden shadow-sm animate-pulse"
      style={{ width: THUMBNAIL_WIDTH }}
    >
      <div className="aspect-340/459 bg-card-02" />
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

  return (
    <div className="absolute inset-0 z-20 flex items-end justify-center pb-8 pointer-events-none">
      {/* Subtle gradient overlay at bottom */}
      <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/40 to-transparent" />
      
      {/* Minimal prompt - scroll down to primary CTA */}
      <a 
        href="#join"
        className="relative pointer-events-auto bg-card/80 backdrop-blur-sm border border-border/50 rounded-full px-6 py-3 text-sm font-medium text-fg hover:bg-card hover:border-accent/50 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        {t.marquee.signedOut?.cta || "Join the wall"} →
      </a>
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
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
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
    setHasInteracted(true);
  }, []);

  const toggleAutoScroll = useCallback(() => {
    setIsPaused((prev) => {
      const next = !prev;
      isAutoScrollingRef.current = !next;
      return next;
    });
    markInteraction();
  }, [markInteraction]);

  const scrollByCards = useCallback(
    (dir: "left" | "right") => {
      const rail = railRef.current;
      if (!rail) return;
      markInteraction();
      const delta = (dir === "right" ? 1 : -1) * ITEM_TOTAL_WIDTH * 2.5;
      rail.scrollBy({ left: delta, behavior: "smooth" });
    },
    [markInteraction]
  );

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
    markInteraction();
    checkLoadMore();
  }, [checkLoadMore, markInteraction]);

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
    <section className="w-full py-12 border-t border-border/50 overflow-hidden">
      <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <SectionHeader
              kicker={
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-sm border border-border/50">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-xs uppercase tracking-wider text-accent font-semibold">Live</span>
                </div>
              }
              title={t.marquee.title}
              subtitle={t.marquee.subtitle}
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByCards("left")}
                className="hidden md:flex items-center justify-center w-9 h-9 rounded-full text-fg-muted hover:text-accent bg-card/80 backdrop-blur-sm border border-border/50 hover:border-border transition-all duration-150"
                aria-label="Scroll left"
                title="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => scrollByCards("right")}
                className="hidden md:flex items-center justify-center w-9 h-9 rounded-full text-fg-muted hover:text-accent bg-card/80 backdrop-blur-sm border border-border/50 hover:border-border transition-all duration-150"
                aria-label="Scroll right"
                title="Scroll right"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={toggleAutoScroll}
                className="flex items-center justify-center w-9 h-9 rounded-full text-fg-muted hover:text-accent bg-card/80 backdrop-blur-sm border border-border/50 hover:border-border transition-all duration-150"
                aria-label={isPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
                title={isPaused ? "Resume" : "Pause"}
              >
                {isPaused ? <Play className="w-4 h-4" strokeWidth={1.5} /> : <Pause className="w-4 h-4" strokeWidth={1.5} />}
              </button>
              <ConnectionIndicator status={status} />
            </div>
          </div>

          {/* Rail container */}
          <div className="relative">
            {showSignInOverlay && <SignInOverlayCTA />}
            <NewItemsPill count={pendingCount} onClick={handleMergePending} />

            {!hasInteracted && !isLoading && allItems.length > 0 ? (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-mono bg-card/80 text-fg backdrop-blur-sm border border-border/50">
                  Drag or scroll to browse
                </span>
              </div>
            ) : null}

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
              <div className="flex items-center justify-center py-16 text-fg-muted glass-panel-inner rounded-lg">
                <div className="text-center">
                  <Sparkles className="w-8 h-8 mx-auto mb-3 text-accent/50" />
                  <p className="font-body">No polaroids yet</p>
                  <p className="text-sm text-fg-muted/70 mt-1">Be the first to join the wall!</p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-linear-to-r from-bg via-bg/60 to-transparent z-10" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-bg via-bg/60 to-transparent z-10" />

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
                    <PolaroidTile 
                      key={item.id} 
                      polaroid={item} 
                      variant="public"
                      width={THUMBNAIL_WIDTH}
                      onSelect={() => setSelectedPolaroidId(item.id)}
                      className="shrink-0 cursor-pointer"
                    />
                  ))}

                  {isFetchingNextPage && (
                    <div className="shrink-0 flex items-center justify-center px-4">
                      <span className="text-xs text-fg-muted">{t.marquee.loadMore}</span>
                    </div>
                  )}

                  {!hasNextPage && !isFetchingNextPage && allItems.length > 0 && (
                    <div className="shrink-0 flex items-center justify-center px-8">
                      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50">
                        <div className="w-8 h-px bg-border/50" />
                        <span className="text-xs text-fg-muted font-mono whitespace-nowrap">{t.marquee.endReached}</span>
                        <div className="w-8 h-px bg-border/50" />
                      </div>
                    </div>
                  )}
                </section>
              </div>
            )}
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


