import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { PolaroidRecord, CreatePolaroidParams, UpdatePolaroidParams } from "@/lib/polaroids";

export function useUserPolaroids() {
  return useQuery({
    queryKey: ["polaroids", "user"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("get-polaroids", {
        body: { type: "user" },
      });

      if (error) {
        throw new Error(`Failed to list polaroids: ${error.message}`);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return (data?.data || []) as PolaroidRecord[];
    },
    enabled: true,
  });
}

export function useCommunityPolaroids(limit: number = 20) {
  return useQuery({
    queryKey: ["polaroids", "community", limit],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("get-polaroids", {
        body: { type: "community", limit },
      });

      if (error) {
        throw new Error(`Failed to get community polaroids: ${error.message}`);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return (data?.data || []) as PolaroidRecord[];
    },
  });
}

export function useCreatePolaroid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreatePolaroidParams) => {
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

      return data?.data as PolaroidRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polaroids", "user"] });
      queryClient.invalidateQueries({ queryKey: ["polaroids", "community"] });
    },
  });
}

export function useUpdatePolaroid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, params }: { id: string; params: UpdatePolaroidParams }) => {
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

      return data?.data as PolaroidRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polaroids", "user"] });
      queryClient.invalidateQueries({ queryKey: ["polaroids", "community"] });
    },
  });
}

export function usePolaroid(id: string | null) {
  return useQuery({
    queryKey: ["polaroids", id],
    queryFn: async () => {
      if (!id) return null;
      const { getPolaroid } = await import("@/lib/polaroids");
      return await getPolaroid(id);
    },
    enabled: !!id,
  });
}

export function useDeletePolaroid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { deletePolaroid } = await import("@/lib/polaroids");
      await deletePolaroid(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polaroids", "user"] });
      queryClient.invalidateQueries({ queryKey: ["polaroids", "community"] });
    },
  });
}

