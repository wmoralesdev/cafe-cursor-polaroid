import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

interface GetPolaroidsRequest {
  type: "user" | "community";
  limit?: number;
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { type, limit = 20 }: GetPolaroidsRequest = await req.json();

    if (type === "user") {
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: "Missing authorization header" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

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

      const { data, error } = await supabase
        .from("polaroids")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Failed to get user polaroids: ${error.message}`);
      }

      return new Response(
        JSON.stringify({ data: data || [] }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else if (type === "community") {
      // Public polaroids: have image_url AND at least one non-empty handle
      const { data, error } = await supabase
        .from("polaroids")
        .select("*")
        .not("image_url", "is", null)
        .order("created_at", { ascending: false })
        .limit(limit * 2);

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

      const shuffled = filtered.sort(() => Math.random() - 0.5);
      const result = shuffled.slice(0, limit);

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

