import { useMemo, useRef, useEffect, useState } from "react";
import { useInfinitePublicPolaroids } from "@/hooks/use-polaroids-query";
import { PolaroidTile } from "@/components/polaroid/polaroid-tile";
import { PolaroidModal } from "@/components/polaroid/polaroid-modal";
import { PolaroidRerenderQueue } from "@/components/polaroid/polaroid-rerender-queue";
import { SectionHeader } from "@/components/ui/section-header";
import { CommunityAnalytics } from "@/components/sections/community-analytics";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import type { PolaroidRecord } from "@/lib/polaroids";

const GRID_PAGE_SIZE = 24;

export function PublicPolaroidGridSection() {
  const { t } = useLanguage();
  const [selectedPolaroidId, setSelectedPolaroidId] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfinitePublicPolaroids(GRID_PAGE_SIZE);

  // Flatten pages into a single array
  const allItems = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.items);
  }, [data]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const errorMessage = error instanceof Error ? error.message : error ? t.gallery.errorTitle : null;

  return (
    <section className="w-full py-12 overflow-hidden">
      <div className="container mx-auto px-4">
        <SectionHeader
          className="mb-8"
          title={t.gallery.title}
          subtitle={t.gallery.subtitle}
        />

        <CommunityAnalytics />

        {isLoading ? (
          <div className="glass-panel-inner p-12 rounded-sm text-center">
            <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-4" strokeWidth={1.5} />
            <p className="text-fg-muted font-body text-sm">{t.gallery.loading}</p>
          </div>
        ) : errorMessage ? (
          <div className="glass-panel-inner p-12 rounded-sm text-center">
            <p className="text-fg-muted font-body text-lg mb-2">{t.gallery.errorTitle}</p>
            <p className="text-fg-muted font-body text-sm">{errorMessage}</p>
          </div>
        ) : allItems.length === 0 ? (
          <div className="glass-panel-inner p-12 rounded-sm text-center">
            <p className="text-fg-muted font-body text-lg mb-2">{t.gallery.emptyTitle}</p>
            <p className="text-fg-muted font-body text-sm">{t.gallery.emptySubtitle}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {allItems.map((polaroid: PolaroidRecord) => (
                <PolaroidTile
                  key={polaroid.id}
                  polaroid={polaroid}
                  variant="public"
                  onSelect={() => setSelectedPolaroidId(polaroid.id)}
                  className="cursor-pointer"
                />
              ))}
            </div>

            {/* Sentinel for infinite scroll */}
            <div ref={sentinelRef} className="h-4 flex items-center justify-center py-8">
              {isFetchingNextPage && (
                <div className="flex items-center gap-2 text-fg-muted">
                  <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                  <span className="text-sm font-body">{t.gallery.loadingMore}</span>
                </div>
              )}
              {!hasNextPage && allItems.length > 0 && (
                <div className="text-sm text-fg-muted font-mono">
                  {t.gallery.allLoaded}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Preview modal */}
      {selectedPolaroidId && (
        <PolaroidModal
          polaroidId={selectedPolaroidId}
          onClose={() => setSelectedPolaroidId(null)}
        />
      )}

      {/* Auto re-render queue for incorrectly stored polaroids */}
      <PolaroidRerenderQueue polaroids={allItems} enabled={!isLoading} />
    </section>
  );
}

