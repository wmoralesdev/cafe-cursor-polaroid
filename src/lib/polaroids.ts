import { supabase } from "./supabase";
import type { CursorProfile } from "@/types/form";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "http://localhost:64321";

export interface PolaroidRecord {
  id: string;
  user_id: string;
  image_url: string | null;
  source_image_url: string | null;
  profile: CursorProfile;
  title: string | null;
  provider: string | null;
  source: string | null;
  referred_by: string | null;
  slug: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePolaroidParams {
  profile: CursorProfile;
  imageDataUrl?: string | null;
  title?: string;
  provider?: string;
  source?: string;
  referred_by?: string | null;
}

export interface UpdatePolaroidParams {
  profile?: CursorProfile;
  imageDataUrl?: string | null;
  title?: string;
  provider?: string;
}


export async function createPolaroid(params: CreatePolaroidParams): Promise<PolaroidRecord> {
  const { data, error } = await supabase.functions.invoke("create-polaroid", {
    body: {
      profile: params.profile,
      imageDataUrl: params.imageDataUrl,
      title: params.title,
      provider: params.provider,
      source: params.source,
      referred_by: params.referred_by,
    },
  });

  if (error) {
    throw new Error(`Failed to create polaroid: ${error.message}`);
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data?.data;
}

export async function updatePolaroid(
  id: string,
  params: UpdatePolaroidParams
): Promise<PolaroidRecord> {
  const { data, error } = await supabase.functions.invoke("update-polaroid", {
    body: {
      id,
      profile: params.profile,
      imageDataUrl: params.imageDataUrl,
      title: params.title,
      provider: params.provider,
    },
  });

  if (error) {
    throw new Error(`Failed to update polaroid: ${error.message}`);
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data?.data;
}

export async function listUserPolaroids(): Promise<PolaroidRecord[]> {
  const { data, error } = await supabase.functions.invoke("get-polaroids", {
    body: { type: "user" },
  });

  if (error) {
    throw new Error(`Failed to list polaroids: ${error.message}`);
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data?.data || [];
}

/**
 * Get a single polaroid by ID
 */
export async function getPolaroid(id: string): Promise<PolaroidRecord | null> {
  const { data, error } = await supabase
    .from("polaroids")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // Not found
    }
    throw new Error(`Failed to get polaroid: ${error.message}`);
  }

  return data;
}

/**
 * Get a single polaroid by slug
 */
export async function getPolaroidBySlug(slug: string): Promise<PolaroidRecord | null> {
  // Use fetch directly since supabase.functions.invoke doesn't support query params well
  const functionsUrl = `${supabaseUrl}/functions/v1/get-polaroid-by-slug`;
  const response = await fetch(
    `${functionsUrl}?slug=${encodeURIComponent(slug)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY || "",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 404 || data?.error === "Polaroid not found") {
      return null;
    }
    throw new Error(data?.error || `Failed to get polaroid by slug: ${response.statusText}`);
  }

  return data?.data || null;
}

export async function getRandomCommunityPolaroids(limit: number = 20): Promise<PolaroidRecord[]> {
  const { data, error } = await supabase.functions.invoke("get-polaroids", {
    body: { type: "community", limit },
  });

  if (error) {
    throw new Error(`Failed to get community polaroids: ${error.message}`);
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data?.data || [];
}

/**
 * Delete a polaroid
 */
export async function deletePolaroid(id: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke("delete-polaroid", {
    body: { id },
  });

  if (error) {
    throw new Error(`Failed to delete polaroid: ${error.message}`);
  }

  if (data?.error) {
    throw new Error(data.error);
  }
}

