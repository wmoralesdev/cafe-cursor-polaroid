import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

interface GetPolaroidsRequest {
  type: "user" | "community";
  limit?: number;
  offset?: number;
  shuffle_first_page?: boolean;
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

// Helper function to enrich polaroids with like data
function enrichPolaroidsWithLikes(
  polaroids: Record<string, unknown>[],
  likes: LikeRecord[],
  viewerId: string | null
) {
  // Group likes by polaroid_id
  const likesByPolaroid = new Map<string, LikeRecord[]>();
  for (const like of likes) {
    const existing = likesByPolaroid.get(like.polaroid_id) || [];
    existing.push(like);
    likesByPolaroid.set(like.polaroid_id, existing);
  }

  return polaroids.map((polaroid) => {
    const polaroidId = polaroid.id as string;
    const polaroidLikes = likesByPolaroid.get(polaroidId) || [];
    
    // Sort likes by created_at descending to get recent likers
    const sortedLikes = [...polaroidLikes].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const recentLikers: RecentLiker[] = sortedLikes
      .slice(0, 3)
      .map((like) => ({
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

    const { type, limit = 20, offset = 0, shuffle_first_page = true }: GetPolaroidsRequest = await req.json();

    // Try to get viewer ID if auth header is present
    let viewerId: string | null = null;
    if (authHeader) {
      const userSupabase = createClient(supabaseUrl, supabaseServiceKey, {
        global: {
          headers: { Authorization: authHeader },
        },
      });
      const { data: { user } } = await userSupabase.auth.getUser();
      if (user) {
        viewerId = user.id;
      }
    }

    if (type === "user") {
      if (!authHeader || !viewerId) {
        return new Response(
          JSON.stringify({ error: "Missing authorization header" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data, error } = await supabase
        .from("polaroids")
        .select("*")
        .eq("user_id", viewerId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new Error(`Failed to get user polaroids: ${error.message}`);
      }

      const polaroids = data || [];

      // Enrich with like data
      if (polaroids.length > 0) {
        const polaroidIds = polaroids.map((p) => p.id);
        const { data: likes } = await supabase
          .from("polaroid_likes")
          .select("polaroid_id, user_id, liker_name, liker_avatar_url, created_at")
          .in("polaroid_id", polaroidIds);

        const enrichedPolaroids = enrichPolaroidsWithLikes(polaroids, likes || [], viewerId);
        return new Response(
          JSON.stringify({ data: enrichedPolaroids }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ data: [] }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else if (type === "community") {
      // Public polaroids: have image_url AND at least one non-empty handle
      // For pagination, we fetch more than needed to account for filtering
      const fetchLimit = offset === 0 ? limit * 2 : limit * 3;
      const { data, error } = await supabase
        .from("polaroids")
        .select("*")
        .not("image_url", "is", null)
        .order("created_at", { ascending: false })
        .range(offset, offset + fetchLimit - 1);

      if (error) {
        throw new Error(`Failed to get community polaroids: ${error.message}`);
      }

      // Filter to only include polaroids with at least one non-empty handle
      const filtered = (data || []).filter(
        (polaroid) =>
          polaroid.profile?.handles &&
          Array.isArray(polaroid.profile.handles) &&
          polaroid.profile.handles.length > 0 &&
          polaroid.profile.handles[0]?.handle?.trim()
      );

      // Only shuffle on first page (offset === 0) if shuffle_first_page is true, otherwise maintain order for pagination
      const result = offset === 0 && shuffle_first_page
        ? filtered.sort(() => Math.random() - 0.5).slice(0, limit)
        : filtered.slice(0, limit);

      // Enrich with like data
      if (result.length > 0) {
        const polaroidIds = result.map((p) => p.id);
        const { data: likes } = await supabase
          .from("polaroid_likes")
          .select("polaroid_id, user_id, liker_name, liker_avatar_url, created_at")
          .in("polaroid_id", polaroidIds);

        const enrichedPolaroids = enrichPolaroidsWithLikes(result, likes || [], viewerId);
        return new Response(
          JSON.stringify({ data: enrichedPolaroids }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ data: result }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid type. Must be 'user' or 'community'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error in get-polaroids function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
