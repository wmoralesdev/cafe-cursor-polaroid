import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

interface GetAdminPolaroidsRequest {
  page?: number;
  pageSize?: number;
  search?: string;
  provider?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  dateRange?: "24h" | "7d" | "30d" | "all";
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

// Helper function to check if user is admin
async function isAdmin(userId: string, supabaseUrl: string, supabaseServiceKey: string): Promise<boolean> {
  try {
    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: user, error } = await adminSupabase.auth.admin.getUserById(userId);
    
    if (error || !user?.user) return false;
    
    // Check for admin role in app_metadata or user_metadata
    const role = user.user.app_metadata?.role || user.user.user_metadata?.role;
    if (role === "admin") return true;
    
    // Fallback: check email and username
    const email = user.user.email;
    const username = user.user.user_metadata?.user_name || user.user.user_metadata?.preferred_username;
    
    if (email === "walterrafael26@gmail.com" || username === "wmoralesdev") {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

// Helper function to enrich polaroids with like data
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
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    const userSupabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    const { data: { user } } = await userSupabase.auth.getUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check admin access
    const admin = await isAdmin(user.id, supabaseUrl, supabaseServiceKey);
    if (!admin) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: GetAdminPolaroidsRequest = await req.json().catch(() => ({}));
    const {
      page = 1,
      pageSize = 20,
      search = "",
      provider,
      sortBy = "created_at",
      sortOrder = "desc",
      dateRange = "all",
    } = body;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let query = supabase.from("polaroids").select("*", { count: "exact" });

    if (search) {
      const searchPattern = `%${search}%`;
      query = query.or(
        `title.ilike.${searchPattern},slug.ilike.${searchPattern},profile->handles->0->handle.ilike.${searchPattern}`
      );
    }

    if (provider) {
      query = query.eq("provider", provider);
    }
    if (dateRange !== "all") {
      const now = new Date();
      let startDate: Date;
      switch (dateRange) {
        case "24h":
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "7d":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0);
      }
      query = query.gte("created_at", startDate.toISOString());
    }

    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    const offset = (page - 1) * pageSize;
    query = query.range(offset, offset + pageSize - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to get admin polaroids: ${error.message}`);
    }

    const polaroids = data || [];

    if (polaroids.length > 0) {
      const polaroidIds = polaroids.map((p) => p.id);
      const { data: likes } = await supabase
        .from("polaroid_likes")
        .select("polaroid_id, user_id, liker_name, liker_avatar_url, created_at")
        .in("polaroid_id", polaroidIds);

      const enrichedPolaroids = enrichPolaroidsWithLikes(polaroids, likes || [], null);
      
      return new Response(
        JSON.stringify({
          data: enrichedPolaroids,
          pagination: {
            page,
            pageSize,
            totalCount: count || 0,
            totalPages: Math.ceil((count || 0) / pageSize),
          },
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        data: [],
        pagination: {
          page,
          pageSize,
          totalCount: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize),
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in get-admin-polaroids function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

