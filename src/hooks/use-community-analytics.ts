import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { CommunityAnalytics } from "@/types/analytics";

export function useCommunityAnalytics() {
  return useQuery({
    queryKey: ["community-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_community_analytics");

      if (error) {
        throw new Error(`Failed to get community analytics: ${error.message}`);
      }

      return (data || {
        total_cards: 0,
        max_mode_pct: 0,
        plan_tiers: [],
        favorite_features: [],
        primary_models: [],
        themes: [],
        cursor_since: [],
        top_extras: [],
      }) as CommunityAnalytics;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false,
  });
}

