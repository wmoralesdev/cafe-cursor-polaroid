import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

interface GetNotificationsRequest {
  limit?: number;
  markAsRead?: boolean;
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

    const { limit = 20, markAsRead = false }: GetNotificationsRequest = await req.json().catch(() => ({}));

    // Get notifications for the current user
    const { data: notifications, error } = await supabase
      .from("polaroid_like_notifications")
      .select("id, polaroid_id, actor_name, actor_avatar_url, created_at, read_at")
      .eq("recipient_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to get notifications: ${error.message}`);
    }

    // Count unread notifications
    const { count: unreadCount } = await supabase
      .from("polaroid_like_notifications")
      .select("*", { count: "exact", head: true })
      .eq("recipient_id", user.id)
      .is("read_at", null);

    // Optionally mark fetched notifications as read
    if (markAsRead && notifications && notifications.length > 0) {
      const unreadIds = notifications
        .filter(n => n.read_at === null)
        .map(n => n.id);
      
      if (unreadIds.length > 0) {
        await supabase
          .from("polaroid_like_notifications")
          .update({ read_at: new Date().toISOString() })
          .in("id", unreadIds);
      }
    }

    return new Response(
      JSON.stringify({ 
        data: notifications || [],
        unreadCount: unreadCount || 0,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in get-like-notifications function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});









