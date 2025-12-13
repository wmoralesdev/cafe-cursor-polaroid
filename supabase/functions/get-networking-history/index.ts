import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

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

interface SwipeRecord {
  id: string;
  polaroid_id: string;
  user_id: string;
  decision: "pass" | "connect";
  created_at: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    const userSupabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData } = await userSupabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const viewerId = user.id;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Fetch all swipes made by the current user
    const { data: userSwipes, error: swipesError } = await supabase
      .from("polaroid_swipes")
      .select("*")
      .eq("user_id", viewerId)
      .order("created_at", { ascending: false });

    if (swipesError) {
      throw new Error(`Failed to get user swipes: ${swipesError.message}`);
    }

    const swipes = (userSwipes || []) as SwipeRecord[];
    const passedSwipes = swipes.filter((s) => s.decision === "pass");
    const connectedSwipes = swipes.filter((s) => s.decision === "connect");

    const passedPolaroidIds = passedSwipes.map((s) => s.polaroid_id);
    const connectedPolaroidIds = connectedSwipes.map((s) => s.polaroid_id);
    const allSwipedPolaroidIds = [...passedPolaroidIds, ...connectedPolaroidIds];

    // 2. Fetch the polaroids corresponding to swipes
    let passedPolaroids: Record<string, unknown>[] = [];
    let connectedPolaroids: Record<string, unknown>[] = [];

    if (allSwipedPolaroidIds.length > 0) {
      const { data: polaroidsData, error: polaroidsError } = await supabase
        .from("polaroids")
        .select("*")
        .in("id", allSwipedPolaroidIds);

      if (polaroidsError) {
        throw new Error(`Failed to get polaroids: ${polaroidsError.message}`);
      }

      const polaroidsById = new Map<string, Record<string, unknown>>();
      for (const p of polaroidsData || []) {
        polaroidsById.set(p.id, p);
      }

      // Build passed and connected arrays with swipe metadata
      passedPolaroids = passedSwipes
        .map((swipe) => {
          const polaroid = polaroidsById.get(swipe.polaroid_id);
          if (!polaroid) return null;
          return {
            ...polaroid,
            swiped_at: swipe.created_at,
            decision: swipe.decision,
          };
        })
        .filter(Boolean) as Record<string, unknown>[];

      connectedPolaroids = connectedSwipes
        .map((swipe) => {
          const polaroid = polaroidsById.get(swipe.polaroid_id);
          if (!polaroid) return null;
          return {
            ...polaroid,
            swiped_at: swipe.created_at,
            decision: swipe.decision,
          };
        })
        .filter(Boolean) as Record<string, unknown>[];
    }

    // 3. Find matches: polaroids where the current user swiped "connect" AND the owner of that
    //    polaroid has also swiped "connect" on ANY of the current user's polaroids.
    let matches: Record<string, unknown>[] = [];

    if (connectedPolaroids.length > 0) {
      // Get the user_ids of the polaroids the current user connected to
      const connectedOwnerIds = connectedPolaroids
        .map((p) => p.user_id as string)
        .filter((id) => id && id !== viewerId);

      if (connectedOwnerIds.length > 0) {
        // Get the current user's polaroid IDs
        const { data: userPolaroids } = await supabase
          .from("polaroids")
          .select("id")
          .eq("user_id", viewerId);

        const userPolaroidIds = (userPolaroids || []).map((p) => p.id);

        if (userPolaroidIds.length > 0) {
          // Find swipes where these owners connected to the current user's polaroids
          const { data: incomingConnects } = await supabase
            .from("polaroid_swipes")
            .select("user_id, polaroid_id, created_at")
            .in("user_id", connectedOwnerIds)
            .in("polaroid_id", userPolaroidIds)
            .eq("decision", "connect");

          // Set of owner IDs who have connected back to any of the user's polaroids
          const mutualOwnerIds = new Set((incomingConnects || []).map((s) => s.user_id));

          // Filter connected polaroids to only those whose owners are in mutualOwnerIds
          matches = connectedPolaroids
            .filter((p) => mutualOwnerIds.has(p.user_id as string))
            .map((p) => {
              const incoming = (incomingConnects || []).find(
                (s) => s.user_id === (p.user_id as string)
              );
              return {
                ...p,
                matched_at: incoming?.created_at || p.swiped_at,
              };
            });
        }
      }
    }

    // 4. Enrich all polaroids with likes
    const allPolaroidIds = [
      ...passedPolaroids.map((p) => p.id as string),
      ...connectedPolaroids.map((p) => p.id as string),
    ];

    let enrichedPassed = passedPolaroids;
    let enrichedConnected = connectedPolaroids;
    let enrichedMatches = matches;

    if (allPolaroidIds.length > 0) {
      const { data: likes } = await supabase
        .from("polaroid_likes")
        .select("polaroid_id, user_id, liker_name, liker_avatar_url, created_at")
        .in("polaroid_id", allPolaroidIds);

      enrichedPassed = enrichPolaroidsWithLikes(passedPolaroids, likes || [], viewerId);
      enrichedConnected = enrichPolaroidsWithLikes(connectedPolaroids, likes || [], viewerId);
      enrichedMatches = enrichPolaroidsWithLikes(matches, likes || [], viewerId);
    }

    return new Response(
      JSON.stringify({
        data: {
          passed: enrichedPassed,
          connected: enrichedConnected,
          matches: enrichedMatches,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in get-networking-history:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});






