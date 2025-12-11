import { Users, History, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { useLanguage } from "@/contexts/language-context";

type TabId = "discover" | "history" | "matches";

interface CommunityTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  matchesCount?: number;
}

export function CommunityTabs({ activeTab, onTabChange, matchesCount = 0 }: CommunityTabsProps) {
  const { t } = useLanguage();

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "discover", label: t.community.tabs?.discover || "Discover", icon: <Users className="w-4 h-4" /> },
    { id: "history", label: t.community.tabs?.history || "History", icon: <History className="w-4 h-4" /> },
    { id: "matches", label: t.community.tabs?.matches || "Matches", icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-card border border-border rounded-lg w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
            activeTab === tab.id
              ? "bg-accent text-white"
              : "text-fg-muted hover:text-fg hover:bg-card-01"
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.id === "matches" && matchesCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-white/20">
              {matchesCount}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

