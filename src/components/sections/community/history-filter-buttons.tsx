import { UserCheck, UserX } from "lucide-react";
import { clsx } from "clsx";
import { useLanguage } from "@/contexts/language-context";

interface HistoryFilterButtonsProps {
  filter: "connected" | "passed";
  onFilterChange: (filter: "connected" | "passed") => void;
  connectedCount: number;
  passedCount: number;
}

export function HistoryFilterButtons({ filter, onFilterChange, connectedCount, passedCount }: HistoryFilterButtonsProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onFilterChange("connected")}
        className={clsx(
          "group flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
          filter === "connected"
            ? "bg-accent text-white shadow-md shadow-accent/25"
            : "bg-card border border-border text-fg hover:border-accent/50 hover:bg-card-01"
        )}
      >
        <UserCheck className={clsx(
          "w-4 h-4 transition-transform",
          filter === "connected" ? "" : "group-hover:scale-110"
        )} />
        <span>{t.community.history?.connected || "Connected"}</span>
        <span className={clsx(
          "px-1.5 py-0.5 rounded text-xs font-semibold",
          filter === "connected" 
            ? "bg-white/20" 
            : "bg-accent/10 text-accent"
        )}>
          {connectedCount}
        </span>
      </button>
      <button
        type="button"
        onClick={() => onFilterChange("passed")}
        className={clsx(
          "group flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
          filter === "passed"
            ? "bg-accent text-white shadow-md shadow-accent/25"
            : "bg-card border border-border text-fg hover:border-accent/50 hover:bg-card-01"
        )}
      >
        <UserX className={clsx(
          "w-4 h-4 transition-transform",
          filter === "passed" ? "" : "group-hover:scale-110"
        )} />
        <span>{t.community.history?.passed || "Passed"}</span>
        <span className={clsx(
          "px-1.5 py-0.5 rounded text-xs font-semibold",
          filter === "passed" 
            ? "bg-white/20" 
            : "bg-fg-muted/10 text-fg-muted"
        )}>
          {passedCount}
        </span>
      </button>
    </div>
  );
}



