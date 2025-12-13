import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

interface SetMarkForPrintingRequest {
  polaroidId: string;
  marked: boolean;
  override?: boolean;
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

    const body: SetMarkForPrintingRequest = await req.json();
    const { polaroidId, marked, override = false } = body;

    if (!polaroidId || typeof marked !== "boolean") {
      return new Response(
        JSON.stringify({ error: "Missing required fields: polaroidId, marked" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (!marked) {
      // Unmark: clear the mark on this polaroid (only if owned by user)
      const { data, error } = await supabase
        .from("polaroids")
        .update({
          marked_for_printing: false,
          marked_for_printing_at: null,
        })
        .eq("id", polaroidId)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return new Response(
            JSON.stringify({ error: "Polaroid not found or not owned by user" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        throw new Error(`Failed to unmark polaroid: ${error.message}`);
      }

      return new Response(
        JSON.stringify({ data }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mark: use RPC function to handle the logic
    const { data: rpcResult, error: rpcError } = await supabase.rpc(
      "set_user_marked_for_printing",
      {
        target_polaroid_id: polaroidId,
        requesting_user_id: user.id,
        override,
      }
    );

    if (rpcError) {
      throw new Error(`Failed to mark polaroid: ${rpcError.message}`);
    }

    // Check if RPC returned an error (already marked without override)
    if (rpcResult?.error === "User already has a marked polaroid") {
      return new Response(
        JSON.stringify({
          error: "User already has a marked polaroid",
          existingMarkedPolaroidId: rpcResult.existingMarkedPolaroidId,
        }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch the updated polaroid
    const { data: updatedPolaroid, error: fetchError } = await supabase
      .from("polaroids")
      .select("*")
      .eq("id", polaroidId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch updated polaroid: ${fetchError.message}`);
    }

    return new Response(
      JSON.stringify({ data: updatedPolaroid }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in set-mark-for-printing function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

