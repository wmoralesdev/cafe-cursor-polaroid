import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

interface PostPolaroidRequest {
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
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { polaroidId }: PostPolaroidRequest = await req.json();
    if (!polaroidId) {
      return new Response(
        JSON.stringify({ error: "Missing polaroidId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: polaroid, error: polaroidError } = await supabase
      .from("polaroids")
      .select("*")
      .eq("id", polaroidId)
      .eq("user_id", user.id)
      .single();

    if (polaroidError || !polaroid) {
      return new Response(
        JSON.stringify({ error: "Polaroid not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const provider = user.app_metadata?.provider || user.identities?.[0]?.provider;
    
    if (!provider || (provider !== "twitter" && provider !== "linkedin_oidc")) {
      return new Response(
        JSON.stringify({ error: "No valid social provider found" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let apiResponse;
    
    if (provider === "twitter") {
      const bearerToken = Deno.env.get("TWITTER_BEARER_TOKEN");
      const apiKey = Deno.env.get("TWITTER_API_KEY");
      const apiSecret = Deno.env.get("TWITTER_API_SECRET");
      const accessToken = Deno.env.get("TWITTER_ACCESS_TOKEN");
      const accessTokenSecret = Deno.env.get("TWITTER_ACCESS_TOKEN_SECRET");

      if (!bearerToken && (!apiKey || !apiSecret || !accessToken || !accessTokenSecret)) {
        return new Response(
          JSON.stringify({ error: "Twitter API credentials not configured" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      apiResponse = {
        success: true,
        message: "Twitter posting not yet implemented. Configure Twitter API credentials.",
        provider: "twitter",
      };
    } else if (provider === "linkedin_oidc") {
      const linkedinAccessToken = Deno.env.get("LINKEDIN_ACCESS_TOKEN");
      const linkedinClientId = Deno.env.get("LINKEDIN_CLIENT_ID");
      const linkedinClientSecret = Deno.env.get("LINKEDIN_CLIENT_SECRET");

      if (!linkedinAccessToken && (!linkedinClientId || !linkedinClientSecret)) {
        return new Response(
          JSON.stringify({ error: "LinkedIn API credentials not configured" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      apiResponse = {
        success: true,
        message: "LinkedIn posting not yet implemented. Configure LinkedIn API credentials.",
        provider: "linkedin",
      };
    } else {
      return new Response(
        JSON.stringify({ error: "Unsupported provider" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(apiResponse),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in post-polaroid function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

