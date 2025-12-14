export interface AnalyticsItem {
  key: string;
  count: number;
}

export interface CommunityAnalytics {
  total_cards: number;
  max_mode_pct: number;
  plan_tiers: AnalyticsItem[];
  favorite_features: AnalyticsItem[];
  primary_models: AnalyticsItem[];
  themes: AnalyticsItem[];
  cursor_since: AnalyticsItem[];
  top_extras: AnalyticsItem[];
}

