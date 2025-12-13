import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

interface MarkPolaroidPrintedRequest {
  polaroidId: string;
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

    const body: MarkPolaroidPrintedRequest = await req.json();
    const { polaroidId } = body;

    if (!polaroidId) {
      return new Response(
        JSON.stringify({ error: "Missing required field: polaroidId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch polaroid to get owner and marked status
    const { data: polaroid, error: fetchError } = await supabase
      .from("polaroids")
      .select("id, user_id, marked_for_printing")
      .eq("id", polaroidId)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return new Response(
          JSON.stringify({ error: "Polaroid not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`Failed to fetch polaroid: ${fetchError.message}`);
    }

    // Insert print event
    const { error: insertError } = await supabase
      .from("polaroid_print_events")
      .insert({
        polaroid_id: polaroidId,
        user_id: polaroid.user_id,
        printed_by: user.id,
      });

    if (insertError) {
      throw new Error(`Failed to create print event: ${insertError.message}`);
    }

    // If the polaroid was marked for printing, clear the mark
    if (polaroid.marked_for_printing) {
      const { error: updateError } = await supabase
        .from("polaroids")
        .update({
          marked_for_printing: false,
          marked_for_printing_at: null,
        })
        .eq("id", polaroidId);

      if (updateError) {
        console.error("Failed to clear marked_for_printing:", updateError);
        // Don't fail the request, print event was already created
      }
    }

    // Fetch updated polaroid with all fields
    const { data: updatedPolaroid, error: updatedFetchError } = await supabase
      .from("polaroids")
      .select("*")
      .eq("id", polaroidId)
      .single();

    if (updatedFetchError) {
      throw new Error(`Failed to fetch updated polaroid: ${updatedFetchError.message}`);
    }

    return new Response(
      JSON.stringify({ data: updatedPolaroid }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in mark-polaroid-printed function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});


