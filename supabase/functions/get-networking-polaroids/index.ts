import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

interface CursorProfile {
  primaryModel?: string;
  secondaryModel?: string;
  favoriteFeature?: string;
  extras?: string[];
  handles?: { handle: string }[];
}

interface GetNetworkingRequest {
  limit?: number;
  profileHint?: CursorProfile | null;
}

interface LikeRecord {
  polaroid_id: string;
  user_id: string;
  liker_name: string | null;
  liker_avatar_url: string | null;
  created_at: string;
}

interface RecentLiker {
  actor_name: string;
  actor_avatar_url: string | null;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function computeMatchScore(
  profileHint: CursorProfile | null | undefined,
  candidate: { profile?: CursorProfile }
): number {
  if (!profileHint) return 0;
  const user = profileHint;
  const other = candidate.profile || {};
  let score = 0;
  if (user.primaryModel && other.primaryModel && user.primaryModel === other.primaryModel) score += 2;
  if (user.secondaryModel && other.secondaryModel && user.secondaryModel === other.secondaryModel) score += 1;
  if (user.favoriteFeature && other.favoriteFeature && user.favoriteFeature === other.favoriteFeature) score += 1;

  if (Array.isArray(user.extras) && Array.isArray(other.extras)) {
    const set = new Set(user.extras);
    const overlap = other.extras.filter((e: string) => set.has(e));
    score += Math.min(overlap.length, 3) * 0.5;
  }

  return score;
}

function enrichPolaroidsWithLikes(
  polaroids: Record<string, unknown>[],
  likes: LikeRecord[],
  viewerId: string | null
) {
  const likesByPolaroid = new Map<string, LikeRecord[]>();
  for (const like of likes) {
    const existing = likesByPolaroid.get(like.polaroid_id) || [];
    existing.push(like);
    likesByPolaroid.set(like.polaroid_id, existing);
  }

  return polaroids.map((polaroid) => {
    const polaroidId = polaroid.id as string;
    const polaroidLikes = likesByPolaroid.get(polaroidId) || [];

    const sortedLikes = [...polaroidLikes].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const recentLikers: RecentLiker[] = sortedLikes.slice(0, 3).map((like) => ({
      actor_name: like.liker_name || "User",
      actor_avatar_url: like.liker_avatar_url,
    }));

    return {
      ...polaroid,
      like_count: polaroidLikes.length,
      viewer_has_liked: viewerId ? polaroidLikes.some((l) => l.user_id === viewerId) : false,
      recent_likers: recentLikers,
    };
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { limit = 20, profileHint = null }: GetNetworkingRequest = await req.json();

    // Resolve viewer ID if provided
    let viewerId: string | null = null;
    if (authHeader) {
      const userSupabase = createClient(supabaseUrl, supabaseServiceKey, {
        global: {
          headers: { Authorization: authHeader },
        },
      });
      const { data: userData } = await userSupabase.auth.getUser();
      if (userData?.user) {
        viewerId = userData.user.id;
      }
    }

    // Collect already-decided polaroids for the viewer
    let excludedIds: string[] = [];
    if (viewerId) {
      const { data: swipes } = await supabase
        .from("polaroid_swipes")
        .select("polaroid_id")
        .eq("user_id", viewerId);
      excludedIds = (swipes || []).map((s) => s.polaroid_id);
    }

    // Fetch a larger pool to allow sorting + exclusions
    const poolSize = Math.max(limit * 3, 30);
    const { data, error } = await supabase
      .from("polaroids")
      .select("*")
      .not("image_url", "is", null)
      .order("created_at", { ascending: false })
      .limit(poolSize);

    if (error) {
      throw new Error(`Failed to get networking polaroids: ${error.message}`);
    }

    const filtered = (data || []).filter((polaroid) => {
      const hasHandle =
        polaroid.profile?.handles &&
        Array.isArray(polaroid.profile.handles) &&
        polaroid.profile.handles.length > 0 &&
        polaroid.profile.handles[0]?.handle?.trim();

      const isSelf = viewerId ? polaroid.user_id === viewerId : false;
      const alreadySeen = excludedIds.includes(polaroid.id);
      return hasHandle && !isSelf && !alreadySeen;
    });

    const scored = filtered.map((p) => ({
      ...p,
      matchScore: computeMatchScore(profileHint, p),
    }));

    const ordered = scored
      .map((p) => ({
        ...p,
        sortScore: (p.matchScore ?? 0) + Math.random() * 0.5,
      }))
      .sort((a, b) => {
        const diff = (b.sortScore ?? 0) - (a.sortScore ?? 0);
        if (diff !== 0) return diff;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      })
      .slice(0, limit);

    // Enrich with likes
    let enriched = ordered;
    if (ordered.length > 0) {
      const polaroidIds = ordered.map((p) => p.id);
      const { data: likes } = await supabase
        .from("polaroid_likes")
        .select("polaroid_id, user_id, liker_name, liker_avatar_url, created_at")
        .in("polaroid_id", polaroidIds);
      enriched = enrichPolaroidsWithLikes(ordered, likes || [], viewerId);
    }

    return new Response(JSON.stringify({ data: enriched }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in get-networking-polaroids:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

