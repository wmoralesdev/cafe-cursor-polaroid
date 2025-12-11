import { X, Check, Users } from "lucide-react";
import { DiscoverCard } from "./discover-card";
import { useLanguage } from "@/contexts/language-context";
import type { PolaroidRecord } from "@/lib/polaroids";

interface DiscoverTabProps {
  isLoading: boolean;
  deck: (PolaroidRecord & { matchScore?: number })[];
  currentIndex: number;
  dragX: number;
  isAnimating: boolean;
  current: (PolaroidRecord & { matchScore?: number }) | undefined;
  onDecide: (decision: "connect" | "pass") => void;
  onRefresh: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

export function DiscoverTab({
  isLoading,
  deck,
  currentIndex,
  dragX,
  isAnimating,
  current,
  onDecide,
  onRefresh,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: DiscoverTabProps) {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16 text-fg-muted">
        {t.community.swipe?.loading}
      </div>
    );
  }

  if (deck.length === 0) {
    return (
      <div className="card-panel p-12 rounded-sm text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
          <Users className="w-8 h-8 text-accent" strokeWidth={1.5} />
        </div>
        <p className="text-fg font-body text-lg mb-2 font-semibold">
          {t.community.empty}
        </p>
        <p className="text-fg-muted font-body text-sm">
          {t.community.emptySubtitle}
        </p>
      </div>
    );
  }

  if (currentIndex >= deck.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-fg-muted">
        <p>{t.community.swipe?.caughtUp}</p>
        <button
          type="button"
          onClick={onRefresh}
          className="px-4 py-2 bg-card border border-border rounded-sm text-sm hover:bg-card-01 transition-colors"
        >
          {t.community.swipe?.seeAgain}
        </button>
      </div>
    );
  }

  return (
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
          <DiscoverCard item={current!} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onDecide("pass")}
          className="flex items-center gap-2 px-4 py-3 rounded-full border border-border bg-card hover:bg-card-01 text-fg transition-colors"
          disabled={!current || isAnimating}
        >
          <X className="w-5 h-5" strokeWidth={1.75} />
          {t.community.swipe?.pass}
        </button>
        <button
          type="button"
          onClick={() => onDecide("connect")}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-accent text-white hover:opacity-90 transition-opacity"
          disabled={!current || isAnimating}
        >
          <Check className="w-5 h-5" strokeWidth={1.75} />
          {t.community.swipe?.connect}
        </button>
      </div>
    </div>
  );
}

