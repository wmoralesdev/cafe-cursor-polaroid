import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useLanguage } from "@/contexts/language-context";
import {
  useNetworkingPolaroids,
  useRecordNetworkingSwipe,
  useTogglePolaroidLike,
  useNetworkingHistory,
} from "@/hooks/use-polaroids-query";
import { useAuth } from "@/hooks/use-auth";
import { useUIStore } from "@/stores/ui-store";
import { usePolaroidStore } from "@/stores/polaroid-store";
import type { PolaroidRecord } from "@/lib/polaroids";
import { Users } from "lucide-react";
import { LoginModal } from "@/components/auth/login-modal";
import { CommunityTabs } from "./community/community-tabs";
import { DiscoverTab } from "./community/discover-tab";
import { HistoryTab } from "./community/history-tab";
import { MatchesTab } from "./community/matches-tab";

type Decision = "connect" | "pass";
type TabId = "discover" | "history" | "matches";

interface DeckItem extends PolaroidRecord {
  matchScore?: number;
}

export function CommunitySwipeSection() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const activePolaroid = usePolaroidStore((state) => state.activePolaroid);
  const isNetworkingEnabled = !!user;
  const { data: networkingPolaroids, isLoading } = useNetworkingPolaroids(50, activePolaroid?.profile, isNetworkingEnabled);
  const { data: historyData, isLoading: historyLoading } = useNetworkingHistory(isNetworkingEnabled);
  const recordSwipe = useRecordNetworkingSwipe();
  const toggleLikeMutation = useTogglePolaroidLike();
  const setShowLoginModal = useUIStore((state) => state.setShowLoginModal);
  const showLoginModal = useUIStore((state) => state.showLoginModal);
  const networkingList = useMemo(() => networkingPolaroids ?? [], [networkingPolaroids]);

  const [activeTab, setActiveTab] = useState<TabId>("discover");
  const [historyFilter, setHistoryFilter] = useState<"connected" | "passed">("connected");
  const [deck, setDeck] = useState<DeckItem[]>([]);
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    setDeck(networkingList as DeckItem[]);
    setIndex(0);
    setDragX(0);
  }, [networkingList]);

  const current = deck[index];

  const decide = useCallback(
    (decision: Decision) => {
      if (!current || isAnimating || activeTab !== "discover") return;
      setIsAnimating(true);
      const delta = decision === "connect" ? 300 : -300;
      setDragX(delta);

      if (decision === "connect") {
        if (!user) {
          setShowLoginModal(true);
          setTimeout(() => {
            setDragX(0);
            setIsAnimating(false);
          }, 150);
          return;
        }

        recordSwipe.mutate({ polaroidId: current.id, decision: "connect" });
        setDeck((prev) =>
          prev.map((item, idx) =>
            idx === index
              ? {
                  ...item,
                  viewer_has_liked: true,
                  like_count: (item.like_count || 0) + 1,
                }
              : item
          )
        );
        toggleLikeMutation.mutate(current.id);
      } else if (user) {
        recordSwipe.mutate({ polaroidId: current.id, decision: "pass" });
      }

      setTimeout(() => {
        setIndex((prev) => prev + 1);
        setDragX(0);
        setIsAnimating(false);
      }, 220);
    },
    [current, index, isAnimating, recordSwipe, setShowLoginModal, toggleLikeMutation, user, activeTab]
  );

  const onTouchStart = (e: React.TouchEvent) => {
    if (activeTab !== "discover") return;
    touchStart.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (activeTab !== "discover") return;
    if (touchStart.current === null) return;
    const delta = e.touches[0].clientX - touchStart.current;
    setDragX(delta);
  };

  const onTouchEnd = () => {
    if (activeTab !== "discover") return;
    const threshold = 60;
    if (Math.abs(dragX) > threshold) {
      decide(dragX > 0 ? "connect" : "pass");
    } else {
      setDragX(0);
    }
    touchStart.current = null;
  };

  const refreshDeck = () => {
    setIndex(0);
    setDragX(0);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (activeTab !== "discover") return;
      if (e.key === "ArrowLeft") {
        decide("pass");
      } else if (e.key === "ArrowRight") {
        decide("connect");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [decide, activeTab]);

  const renderTabContent = () => {
    if (!user) {
      // Return null - signed-out users see this section differently
      return null;
    }

    if (activeTab === "discover") {
      return (
        <DiscoverTab
          isLoading={isLoading}
          deck={deck}
          currentIndex={index}
          dragX={dragX}
          isAnimating={isAnimating}
          current={current}
          onDecide={decide}
          onRefresh={refreshDeck}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        />
      );
    }

    if (activeTab === "history") {
      return (
        <HistoryTab
          isLoading={historyLoading}
          connected={historyData?.connected || []}
          passed={historyData?.passed || []}
          filter={historyFilter}
          onFilterChange={setHistoryFilter}
        />
      );
    }

    if (activeTab === "matches") {
      return (
        <MatchesTab
          isLoading={historyLoading}
          matches={historyData?.matches || []}
        />
      );
    }

    return null;
  };

  // For signed-out users, hide this section completely (content merged into SignedOutHero)
  if (!user) {
    return null;
  }

  return (
    <section
      id="community"
      className="w-full py-10 px-4 sm:px-6 bg-linear-to-b from-transparent via-card/30 to-transparent border-t border-border/50"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-fg tracking-tight leading-tight">
            {t.community.title}
          </h2>
          <p className="text-fg-muted font-body text-lg mt-3 max-w-xl leading-relaxed">
            {t.community.subtitle}
          </p>
        </div>

        <CommunityTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          matchesCount={historyData?.matches?.length || 0}
        />

        {renderTabContent()}
      </div>
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </section>
  );
}
