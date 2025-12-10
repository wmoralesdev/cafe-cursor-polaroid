import { useEffect, useRef, useState, useCallback } from "react";
import { useLanguage } from "@/contexts/language-context";
import {
  useNetworkingPolaroids,
  useRecordNetworkingSwipe,
  useTogglePolaroidLike,
} from "@/hooks/use-polaroids-query";
import { useAuth } from "@/hooks/use-auth";
import { useUIStore } from "@/stores/ui-store";
import { usePolaroidStore } from "@/stores/polaroid-store";
import type { PolaroidRecord } from "@/lib/polaroids";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Heart, X, Check } from "lucide-react";
import { clsx } from "clsx";
import { LoginModal } from "@/components/auth/login-modal";

type Decision = "connect" | "pass";

interface DeckItem extends PolaroidRecord {
  matchScore?: number;
}

export function CommunitySwipeSection() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const locale = lang === "es" ? es : enUS;
  const activePolaroid = usePolaroidStore((state) => state.activePolaroid);
  const { data: networkingPolaroids = [], isLoading } = useNetworkingPolaroids(50, activePolaroid?.profile);
  const recordSwipe = useRecordNetworkingSwipe();
  const toggleLikeMutation = useTogglePolaroidLike();
  const setShowLoginModal = useUIStore((state) => state.setShowLoginModal);
  const showLoginModal = useUIStore((state) => state.showLoginModal);

  const [deck, setDeck] = useState<DeckItem[]>([]);
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    setDeck(networkingPolaroids as DeckItem[]);
    setIndex(0);
    setDragX(0);
  }, [networkingPolaroids]);

  const current = deck[index];

  const decide = useCallback(
    (decision: Decision) => {
      if (!current || isAnimating) return;
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
    [current, index, isAnimating, recordSwipe, setShowLoginModal, toggleLikeMutation, user]
  );

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const delta = e.touches[0].clientX - touchStart.current;
    setDragX(delta);
  };

  const onTouchEnd = () => {
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
      if (e.key === "ArrowLeft") {
        decide("pass");
      } else if (e.key === "ArrowRight") {
        decide("connect");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [decide]);

  const renderCard = (item: DeckItem | undefined) => {
    if (!item) return null;
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
      <div
        className={clsx(
          "relative w-full max-w-md mx-auto bg-card border border-border rounded-lg shadow-xl overflow-hidden select-none"
        )}
      >
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
  };

  return (
    <section
      id="community"
      className="w-full py-10 px-4 sm:px-6 bg-linear-to-b from-transparent via-card/30 to-transparent"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-fg">
            {t.community.title}
          </h2>
          <p className="text-fg-muted font-body text-sm md:text-base">
            {t.community.subtitle}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16 text-fg-muted">
            {t.community.swipe?.loading}
          </div>
        ) : deck.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-fg-muted">
            <p>{t.community.empty}</p>
          </div>
        ) : index >= deck.length ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-fg-muted">
            <p>{t.community.swipe?.caughtUp}</p>
            <button
              type="button"
              onClick={refreshDeck}
              className="px-4 py-2 bg-card border border-border rounded-sm text-sm hover:bg-card-01 transition-colors"
            >
              {t.community.swipe?.seeAgain}
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-6">
            <div
              className="w-full max-w-md"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div
                className="transition-transform duration-200 ease-out"
                style={{
                  transform: `translateX(${dragX}px) rotate(${dragX / 25}deg)`,
                  opacity: Math.max(0, 1 - Math.abs(dragX) / 300),
                }}
              >
                {renderCard(current)}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => decide("pass")}
                className="flex items-center gap-2 px-4 py-3 rounded-full border border-border bg-card hover:bg-card-01 text-fg transition-colors"
                disabled={!current || isAnimating}
              >
                <X className="w-5 h-5" strokeWidth={1.75} />
                {t.community.swipe?.pass}
              </button>
              <button
                type="button"
                onClick={() => decide("connect")}
                className="flex items-center gap-2 px-4 py-3 rounded-full bg-accent text-white hover:opacity-90 transition-opacity"
                disabled={!current || isAnimating}
              >
                <Check className="w-5 h-5" strokeWidth={1.75} />
                {t.community.swipe?.connect}
              </button>
            </div>
          </div>
        )}
      </div>
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </section>
  );
}

