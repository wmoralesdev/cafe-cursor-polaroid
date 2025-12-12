import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

interface ToggleLikeRequest {
  polaroidId: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    
    // Create client with user's auth to get their identity
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

    // Service role client for database operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { polaroidId }: ToggleLikeRequest = await req.json();

    if (!polaroidId) {
      return new Response(
        JSON.stringify({ error: "Missing required field: polaroidId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the polaroid exists and get owner's user_id
    const { data: polaroid, error: polaroidError } = await supabase
      .from("polaroids")
      .select("id, user_id")
      .eq("id", polaroidId)
      .single();

    if (polaroidError || !polaroid) {
      return new Response(
        JSON.stringify({ error: "Polaroid not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user already liked this polaroid
    const { data: existingLike } = await supabase
      .from("polaroid_likes")
      .select("id")
      .eq("polaroid_id", polaroidId)
      .eq("user_id", user.id)
      .single();

    let liked: boolean;

    // Extract liker info from user metadata
    const likerName = user.user_metadata?.name || 
                      user.user_metadata?.full_name || 
                      user.user_metadata?.user_name ||
                      user.user_metadata?.preferred_username ||
                      user.email?.split("@")[0] || 
                      "User";
    const likerAvatarUrl = user.user_metadata?.avatar_url || 
                          user.user_metadata?.picture || 
                          null;

    if (existingLike) {
      // Unlike: delete the existing like
      const { error: deleteError } = await supabase
        .from("polaroid_likes")
        .delete()
        .eq("id", existingLike.id);

      if (deleteError) {
        throw new Error(`Failed to unlike: ${deleteError.message}`);
      }

      liked = false;
    } else {
      // Like: insert a new like
      const { error: insertError } = await supabase
        .from("polaroid_likes")
        .insert({
          polaroid_id: polaroidId,
          user_id: user.id,
          liker_name: likerName,
          liker_avatar_url: likerAvatarUrl,
        });

      if (insertError) {
        throw new Error(`Failed to like: ${insertError.message}`);
      }

      liked = true;

      // Create notification for polaroid owner (only if it's not the user liking their own)
      if (polaroid.user_id !== user.id) {
        await supabase
          .from("polaroid_like_notifications")
          .insert({
            polaroid_id: polaroidId,
            recipient_id: polaroid.user_id,
            actor_id: user.id,
            actor_name: likerName,
            actor_avatar_url: likerAvatarUrl,
          });
      }
    }

    // Get updated like count
    const { count } = await supabase
      .from("polaroid_likes")
      .select("*", { count: "exact", head: true })
      .eq("polaroid_id", polaroidId);

    return new Response(
      JSON.stringify({ 
        data: {
          liked,
          likeCount: count || 0,
        }
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in toggle-polaroid-like function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});











