import { supabase } from "./supabase";
import type { CursorProfile } from "@/types/form";

export interface PolaroidRecord {
  id: string;
  user_id: string;
  image_url: string | null;
  profile: CursorProfile;
  title: string | null;
  provider: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePolaroidParams {
  profile: CursorProfile;
  imageDataUrl?: string | null;
  title?: string;
  provider?: string;
  is_published?: boolean;
}

export interface UpdatePolaroidParams {
  profile?: CursorProfile;
  imageDataUrl?: string | null;
  title?: string;
  provider?: string;
  is_published?: boolean;
}


export async function createPolaroid(params: CreatePolaroidParams): Promise<PolaroidRecord> {
  const { data, error } = await supabase.functions.invoke("create-polaroid", {
    body: {
      profile: params.profile,
      imageDataUrl: params.imageDataUrl,
      title: params.title,
      provider: params.provider,
      is_published: params.is_published,
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
      is_published: params.is_published,
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
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User must be authenticated to delete a polaroid");
  }

  const { error } = await supabase
    .from("polaroids")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to delete polaroid: ${error.message}`);
  }
}

