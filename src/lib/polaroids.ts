import { supabase } from "./supabase";
import type { CursorProfile } from "@/types/form";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "http://localhost:64321";

export interface RecentLiker {
  actor_name: string;
  actor_avatar_url: string | null;
}

export interface PolaroidRecord {
  id: string;
  user_id: string;
  image_url: string | null;
  source_image_url: string | null;
  og_image_url: string | null;
  profile: CursorProfile;
  title: string | null;
  provider: string | null;
  source: string | null;
  referred_by: string | null;
  slug: string | null;
  created_at: string;
  updated_at: string;
  // Like metadata (computed by API, not stored in table)
  like_count?: number;
  viewer_has_liked?: boolean;
  recent_likers?: RecentLiker[];
}

export interface CreatePolaroidParams {
  profile: CursorProfile;
  imageDataUrl?: string | null;
  ogImageDataUrl?: string | null;
  title?: string;
  provider?: string;
  source?: string;
  referred_by?: string | null;
}

export interface UpdatePolaroidParams {
  profile?: CursorProfile;
  imageDataUrl?: string | null;
  ogImageDataUrl?: string | null;
  title?: string;
  provider?: string;
}


export async function createPolaroid(params: CreatePolaroidParams): Promise<PolaroidRecord> {
  const { data, error } = await supabase.functions.invoke("create-polaroid", {
    body: {
      profile: params.profile,
      imageDataUrl: params.imageDataUrl,
      ogImageDataUrl: params.ogImageDataUrl,
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
      ogImageDataUrl: params.ogImageDataUrl,
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
  // Use Edge Function instead of direct REST API
  const functionsUrl = `${supabaseUrl}/functions/v1/get-polaroid-by-id`;
  const response = await fetch(
    `${functionsUrl}?id=${encodeURIComponent(id)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY || "",
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    if (response.status === 404 || result?.error === "Polaroid not found") {
      return null;
    }
    throw new Error(result?.error || `Failed to get polaroid: ${response.statusText}`);
  }

  return result?.data || null;
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

export interface ToggleLikeResult {
  liked: boolean;
  likeCount: number;
}

export interface SwipeHistoryItem extends PolaroidRecord {
  swiped_at: string;
  decision: "pass" | "connect";
}

export interface MatchItem extends PolaroidRecord {
  swiped_at: string;
  decision: "connect";
  matched_at: string;
}

export interface NetworkingHistoryResult {
  passed: SwipeHistoryItem[];
  connected: SwipeHistoryItem[];
  matches: MatchItem[];
}

export async function getNetworkingPolaroids(
  limit: number = 20,
  profileHint?: CursorProfile | null
): Promise<PolaroidRecord[]> {
  const { data, error } = await supabase.functions.invoke("get-networking-polaroids", {
    body: { limit, profileHint: profileHint || null },
  });

  if (error) {
    throw new Error(`Failed to get networking polaroids: ${error.message}`);
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return (data?.data || []) as PolaroidRecord[];
}

export async function recordNetworkingSwipe(
  polaroidId: string,
  decision: "pass" | "connect"
): Promise<void> {
  const { error, data } = await supabase.functions.invoke("record-networking-swipe", {
    body: { polaroid_id: polaroidId, decision },
  });

  if (error) {
    throw new Error(`Failed to record swipe: ${error.message}`);
  }

  if (data?.error) {
    throw new Error(data.error);
  }
}

/**
 * Toggle like on a polaroid
 */
export async function togglePolaroidLike(polaroidId: string): Promise<ToggleLikeResult> {
  const { data, error } = await supabase.functions.invoke("toggle-polaroid-like", {
    body: { polaroidId },
  });

  if (error) {
    throw new Error(`Failed to toggle like: ${error.message}`);
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data?.data;
}

/**
 * Get networking history (passed/connected cards and matches) for the current user
 */
export async function getNetworkingHistory(): Promise<NetworkingHistoryResult> {
  const { data, error } = await supabase.functions.invoke("get-networking-history");

  if (error) {
    throw new Error(`Failed to get networking history: ${error.message}`);
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data?.data || { passed: [], connected: [], matches: [] };
}

