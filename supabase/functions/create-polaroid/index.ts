import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

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
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { profile, imageDataUrl, title, provider, is_published, source, referred_by } = body;

    if (!profile) {
      return new Response(
        JSON.stringify({ error: "Missing required field: profile" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let imageUrl: string | null = null;
    if (imageDataUrl) {
      if (imageDataUrl.startsWith("http://") || imageDataUrl.startsWith("https://")) {
        imageUrl = imageDataUrl;
      } else {
        const response = await fetch(imageDataUrl);
        const blob = await response.blob();
        const filename = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
        
        const { error: uploadError } = await supabase.storage
          .from("polaroids")
          .upload(filename, blob, {
            contentType: "image/png",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from("polaroids")
          .getPublicUrl(filename);
        imageUrl = urlData.publicUrl;
      }
    }

    // Generate slug from first handle + random suffix
    const firstHandle = profile?.handles?.[0]?.handle || "user";
    const sanitizedHandle = firstHandle.toLowerCase().replace(/[^a-z0-9]/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    let slug = `${sanitizedHandle}-${randomSuffix}`;
    
    // Ensure slug is unique by checking and appending counter if needed
    let slugExists = true;
    let counter = 0;
    while (slugExists && counter < 10) {
      const { count } = await supabase
        .from("polaroids")
        .select("*", { count: "exact", head: true })
        .eq("slug", slug);
      
      if (count === 0) {
        slugExists = false;
      } else {
        slug = `${sanitizedHandle}-${randomSuffix}${counter}`;
        counter++;
      }
    }

    const { data, error } = await supabase
      .from("polaroids")
      .insert({
        user_id: user.id,
        profile,
        image_url: imageUrl,
        source_image_url: imageUrl,
        title: title || null,
        provider: provider || null,
        is_published: is_published ?? false,
        source: source || "direct",
        referred_by: referred_by || null,
        slug,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create polaroid: ${error.message}`);
    }

    return new Response(
      JSON.stringify({ data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in create-polaroid function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

