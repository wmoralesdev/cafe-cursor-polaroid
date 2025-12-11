import { UserCheck, UserX } from "lucide-react";
import { HistoryCard } from "./history-card";
import { HistoryFilterButtons } from "./history-filter-buttons";
import { useLanguage } from "@/contexts/language-context";
import type { SwipeHistoryItem } from "@/lib/polaroids";

interface HistoryTabProps {
  isLoading: boolean;
  connected: SwipeHistoryItem[];
  passed: SwipeHistoryItem[];
  filter: "connected" | "passed";
  onFilterChange: (filter: "connected" | "passed") => void;
}

export function HistoryTab({ isLoading, connected, passed, filter, onFilterChange }: HistoryTabProps) {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16 text-fg-muted">
        {t.community.history?.loading || "Loading history..."}
      </div>
    );
  }

  const currentList = filter === "connected" ? connected : passed;

  return (
    <div className="space-y-5">
      <HistoryFilterButtons
        filter={filter}
        onFilterChange={onFilterChange}
        connectedCount={connected.length}
        passedCount={passed.length}
      />

      {currentList.length === 0 ? (
        <div className="card-panel p-10 rounded-xl text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-4">
            {filter === "connected" ? (
              <UserCheck className="w-7 h-7 text-accent" strokeWidth={1.5} />
            ) : (
              <UserX className="w-7 h-7 text-accent" strokeWidth={1.5} />
            )}
          </div>
          <p className="text-fg font-body text-lg mb-2 font-semibold">
            {filter === "connected"
              ? t.community.history?.emptyConnected || "No connections yet"
              : t.community.history?.emptyPassed || "No passed cards yet"}
          </p>
          <p className="text-fg-muted font-body text-sm max-w-xs mx-auto">
            {filter === "connected"
              ? t.community.history?.emptyConnectedSubtitle || "Swipe right on cards to connect"
              : t.community.history?.emptyPassedSubtitle || "Passed cards will appear here"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentList.map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

