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
    const { id, profile, imageDataUrl, ogImageDataUrl, title, provider } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Missing required field: id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const updateData: Record<string, unknown> = {};
    
    if (profile !== undefined) {
      updateData.profile = profile;
    }
    
    if (title !== undefined) {
      updateData.title = title || null;
    }
    
    if (provider !== undefined) {
      updateData.provider = provider || null;
    }

    if (imageDataUrl) {
      const { data: currentPolaroid } = await supabase
        .from("polaroids")
        .select("source_image_url, image_url")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      const hasExistingSourceImage = currentPolaroid?.source_image_url && 
                                     currentPolaroid.source_image_url.trim() !== "";

      if (imageDataUrl.startsWith("http://") || imageDataUrl.startsWith("https://")) {
        updateData.image_url = imageDataUrl;
        if (!hasExistingSourceImage) {
          updateData.source_image_url = imageDataUrl;
        }
      } else {
        if (currentPolaroid?.image_url && currentPolaroid.image_url !== currentPolaroid.source_image_url) {
          const oldPath = currentPolaroid.image_url.split("/polaroids/")[1];
          if (oldPath) {
            await supabase.storage.from("polaroids").remove([oldPath]);
          }
        }

        const response = await fetch(imageDataUrl);
        const blob = await response.blob();
        const isJpeg = imageDataUrl.startsWith("data:image/jpeg");
        const ext = isJpeg ? "jpg" : "png";
        const contentType = isJpeg ? "image/jpeg" : "image/png";
        const filename = `${user.id}/${id}.${ext}`;
        
        const { error: uploadError } = await supabase.storage
          .from("polaroids")
          .upload(filename, blob, {
            contentType,
            upsert: true,
          });

        if (uploadError) {
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from("polaroids")
          .getPublicUrl(filename);
        updateData.image_url = urlData.publicUrl;
        if (!hasExistingSourceImage) {
          updateData.source_image_url = urlData.publicUrl;
        }
      }
    }

    if (ogImageDataUrl && !ogImageDataUrl.startsWith("http")) {
      const { data: currentPolaroid } = await supabase
        .from("polaroids")
        .select("og_image_url")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (currentPolaroid?.og_image_url) {
        const oldPath = currentPolaroid.og_image_url.split("/polaroids/")[1];
        if (oldPath) {
          await supabase.storage.from("polaroids").remove([oldPath]);
        }
      }

      const ogResponse = await fetch(ogImageDataUrl);
      const ogBlob = await ogResponse.blob();
      const ogFilename = `${user.id}/og-${id}.png`;
      
      const { error: ogUploadError } = await supabase.storage
        .from("polaroids")
        .upload(ogFilename, ogBlob, {
          contentType: "image/png",
          upsert: true,
        });

      if (ogUploadError) {
        console.error("Failed to upload OG image:", ogUploadError.message);
      } else {
        const { data: ogUrlData } = supabase.storage
          .from("polaroids")
          .getPublicUrl(ogFilename);
        updateData.og_image_url = ogUrlData.publicUrl;
      }
    }

    const { data, error } = await supabase
      .from("polaroids")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return new Response(
          JSON.stringify({ error: "Polaroid not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`Failed to update polaroid: ${error.message}`);
    }

    return new Response(
      JSON.stringify({ data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in update-polaroid function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

