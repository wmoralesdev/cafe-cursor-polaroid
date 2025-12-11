import { Sparkles } from "lucide-react";
import { HistoryCard } from "./history-card";
import { useLanguage } from "@/contexts/language-context";
import type { MatchItem } from "@/lib/polaroids";

interface MatchesTabProps {
  isLoading: boolean;
  matches: MatchItem[];
}

export function MatchesTab({ isLoading, matches }: MatchesTabProps) {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16 text-fg-muted">
        {t.community.history?.loading || "Loading matches..."}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="card-panel p-12 rounded-sm text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
          <Sparkles className="w-8 h-8 text-accent" strokeWidth={1.5} />
        </div>
        <p className="text-fg font-body text-lg mb-2 font-semibold">
          {t.community.history?.emptyMatches || "No matches yet"}
        </p>
        <p className="text-fg-muted font-body text-sm">
          {t.community.history?.emptyMatchesSubtitle || "When someone you connect with also connects with you, they'll appear here"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {matches.map((item) => (
        <HistoryCard key={item.id} item={item} showMatchBadge={true} />
      ))}
    </div>
  );
}

