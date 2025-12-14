import { useMemo } from "react";
import { useCommunityAnalytics } from "@/hooks/use-community-analytics";
import { Loader2 } from "lucide-react";
import { PLAN_TIERS, CURSOR_FEATURES, CURSOR_MODELS } from "@/constants/cursor-data";
import { useLanguage } from "@/hooks/use-language";
import type { AnalyticsItem } from "@/types/analytics";

// Helper to get label from key
function getPlanLabel(key: string): string {
  return PLAN_TIERS.find((p) => p.id === key)?.label || key;
}

function getFeatureLabel(key: string): string {
  return CURSOR_FEATURES.find((f) => f.id === key)?.label || key;
}

// Mini bar chart component - all elements in SVG for proper alignment
function MiniBarChart({
  items,
  maxCount,
  getLabel,
  height = 60,
  noDataText,
}: {
  items: AnalyticsItem[];
  maxCount: number;
  getLabel: (key: string) => string;
  height?: number;
  noDataText: string;
}) {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60px] text-fg-muted text-xs">
        {noDataText}
      </div>
    );
  }

  const labelHeight = 20; // Space for labels at bottom
  const svgHeight = height + labelHeight;
  const barWidth = 100 / items.length;
  const maxBarHeight = height - 15; // Leave space for count labels on top

  return (
    <svg
      width="100%"
      height={svgHeight}
      className="overflow-visible"
      aria-label="Bar chart"
      style={{ display: "block" }}
    >
      <title>Bar chart</title>
      {items.map((item, index) => {
        const barHeight = maxCount > 0 ? (item.count / maxCount) * maxBarHeight : 0;
        const xCenter = (index * barWidth) + (barWidth / 2);
        const barY = height - barHeight - 5;
        const label = getLabel(item.key);

        return (
          <g key={item.key}>
            {/* Bar */}
            <rect
              x={`${xCenter - barWidth * 0.35}%`}
              y={barY}
              width={`${barWidth * 0.7}%`}
              height={Math.max(barHeight, 2)}
              fill="currentColor"
              className="text-accent"
              rx="2"
            />
            {/* Count label on top - always show */}
            <text
              x={`${xCenter}%`}
              y={Math.min(barY - 4, height - maxBarHeight - 8)}
              textAnchor="middle"
              className="fill-fg-muted"
              style={{ fontSize: "9px", fontFamily: "var(--font-mono)" }}
            >
              {item.count}
            </text>
            {/* Label below bar */}
            <text
              x={`${xCenter}%`}
              y={height + 12}
              textAnchor="middle"
              className="fill-fg-muted"
              style={{ fontSize: "9px", fontFamily: "var(--font-mono)" }}
            >
              {label.length > 10 ? label.substring(0, 10) + "…" : label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Stacked bar for plan tiers
function PlanTierChart({ items, noDataText }: { items: AnalyticsItem[]; noDataText: string }) {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  
  if (total === 0 || items.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60px] text-fg-muted text-xs">
        {noDataText}
      </div>
    );
  }

  const height = 40;
  
  // Calculate cumulative positions
  const positions = items.reduce((acc, item, index) => {
    const width = (item.count / total) * 100;
    const x = index === 0 ? 0 : acc[index - 1].x + acc[index - 1].width;
    acc.push({ x, width });
    return acc;
  }, [] as Array<{ x: number; width: number }>);

  return (
    <div className="relative" style={{ height: `${height}px` }}>
      <svg width="100%" height={height} className="overflow-visible" aria-label="Plan tier distribution chart">
        <title>Plan tier distribution chart</title>
        {items.map((item, index) => {
          const { x, width } = positions[index];

          return (
            <g key={item.key}>
              <rect
                x={`${x}%`}
                y="0"
                width={`${width}%`}
                height={height}
                fill="currentColor"
                className="text-accent"
                opacity={0.7 + (item.count / total) * 0.3}
                rx="2"
              />
              {width > 8 && (
                <text
                  x={`${x + width / 2}%`}
                  y={height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[9px] fill-fg font-semibold"
                  fontSize="9"
                >
                  {getPlanLabel(item.key)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {/* Legend below */}
      <div className="flex flex-wrap gap-2 mt-2 text-[9px] text-fg-muted font-mono">
        {items.map((item) => (
          <span key={item.key} className="flex items-center gap-1">
            <span
              className="inline-block w-2 h-2 rounded-sm"
              style={{
                backgroundColor: "currentColor",
                color: "var(--color-accent)",
                opacity: 0.7 + (item.count / total) * 0.3,
              }}
            />
            {getPlanLabel(item.key)} ({item.count})
          </span>
        ))}
      </div>
    </div>
  );
}

export function CommunityAnalytics() {
  const { t } = useLanguage();
  const { data, isLoading, error } = useCommunityAnalytics();

  const topExtras = useMemo(() => {
    if (!data?.top_extras) return [];
    return data.top_extras.slice(0, 6);
  }, [data]);

  const topFeatures = useMemo(() => {
    if (!data?.favorite_features) return [];
    return data.favorite_features.slice(0, 5);
  }, [data]);

  const topModels = useMemo(() => {
    if (!data?.primary_models) return [];
    return data.primary_models.slice(0, 5);
  }, [data]);

  const maxModelCount = useMemo(() => {
    return Math.max(...(topModels.map((m) => m.count) || [0]), 1);
  }, [topModels]);

  const maxFeatureCount = useMemo(() => {
    return Math.max(...(topFeatures.map((f) => f.count) || [0]), 1);
  }, [topFeatures]);

  const maxExtraCount = useMemo(() => {
    return Math.max(...(topExtras.map((e) => e.count) || [0]), 1);
  }, [topExtras]);

  if (isLoading) {
    return (
      <div className="glass-panel-inner p-8 rounded-sm text-center">
        <Loader2 className="w-6 h-6 animate-spin text-accent mx-auto mb-2" strokeWidth={1.5} />
        <p className="text-fg-muted font-body text-sm">{t.analytics.loading}</p>
      </div>
    );
  }

  if (error) {
    return null; // Fail silently - analytics are nice-to-have
  }

  if (!data || data.total_cards === 0) {
    return null;
  }

  return (
    <div className="glass-panel-inner p-6 rounded-sm border border-border/50 mb-8">
      {/* Top Row: Stats and Plan Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Stats */}
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium text-fg-muted uppercase tracking-wider font-display">
            {t.analytics.totalCards}
          </div>
          <div className="text-3xl font-bold text-fg font-display">
            {data.total_cards.toLocaleString()}
          </div>
          <div className="text-xs text-fg-muted font-mono">
            {data.max_mode_pct.toFixed(1)}% {t.analytics.maxModePct}
          </div>
        </div>

        {/* Plan Tiers */}
        <div className="md:col-span-2">
          <div className="text-xs font-medium text-fg-muted uppercase tracking-wider font-display mb-3">
            {t.analytics.planDistribution}
          </div>
          <PlanTierChart items={data.plan_tiers} noDataText={t.analytics.noData} />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Favorite Features */}
        <div>
          <div className="text-xs font-medium text-fg-muted uppercase tracking-wider font-display mb-3">
            {t.analytics.topFeatures}
          </div>
          <MiniBarChart
            items={topFeatures}
            maxCount={maxFeatureCount}
            getLabel={getFeatureLabel}
            height={100}
            noDataText={t.analytics.noData}
          />
        </div>

        {/* Top Models */}
        {topModels.length > 0 && (
          <div>
            <div className="text-xs font-medium text-fg-muted uppercase tracking-wider font-display mb-3">
              {t.analytics.topModels}
            </div>
            <MiniBarChart
              items={topModels}
              maxCount={maxModelCount}
              getLabel={(key: string) => {
                // Shorten model names for display
                const model = CURSOR_MODELS.find((m: { id: string; label: string }) => m.id === key);
                if (!model) return key;
                // Show shortened version for long names
                return model.label.length > 12 
                  ? model.label.replace(/GPT-|Codex|Codex-/g, '').substring(0, 12)
                  : model.label;
              }}
              height={100}
              noDataText={t.analytics.noData}
            />
          </div>
        )}

        {/* Top Tech Stack */}
        {topExtras.length > 0 && (
          <div>
            <div className="text-xs font-medium text-fg-muted uppercase tracking-wider font-display mb-3">
              {t.analytics.topTechStack}
            </div>
            <MiniBarChart
              items={topExtras}
              maxCount={maxExtraCount}
              getLabel={(key) => key}
              height={100}
              noDataText={t.analytics.noData}
            />
          </div>
        )}
      </div>
    </div>
  );
}

