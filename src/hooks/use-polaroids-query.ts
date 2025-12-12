import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { PolaroidRecord, CreatePolaroidParams, UpdatePolaroidParams } from "@/lib/polaroids";

const MARQUEE_PAGE_SIZE = 20;

export function useUserPolaroids(enabled: boolean = true) {
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
    enabled,
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

/**
 * Infinite query for the marquee feed. Fetches complete polaroids (with image_url and valid handles)
 * ordered by created_at desc with deterministic paging via range().
 */
export function useInfiniteCommunityPolaroids(pageSize: number = MARQUEE_PAGE_SIZE) {
  return useInfiniteQuery({
    queryKey: ["polaroids", "community", "infinite"],
    queryFn: async ({ pageParam = 0 }) => {
      const offset = pageParam * pageSize;

      const { data, error } = await supabase.functions.invoke("get-polaroids", {
        body: { type: "community", limit: pageSize, offset },
      });

      if (error) {
        throw new Error(`Failed to get infinite community polaroids: ${error.message}`);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const items = (data?.data || []) as PolaroidRecord[];

      return {
        items,
        nextPage: items.length === pageSize ? pageParam + 1 : undefined,
        pageParam,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
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

export function useTogglePolaroidLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (polaroidId: string) => {
      const { togglePolaroidLike } = await import("@/lib/polaroids");
      return await togglePolaroidLike(polaroidId);
    },
    onMutate: async (polaroidId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["polaroids", "community"] });
      await queryClient.cancelQueries({ queryKey: ["polaroids", "user"] });

      // Snapshot the previous values
      const previousCommunity = queryClient.getQueriesData<PolaroidRecord[]>({ 
        queryKey: ["polaroids", "community"] 
      });
      const previousUser = queryClient.getQueryData<PolaroidRecord[]>(["polaroids", "user"]);

      // Helper to optimistically update a polaroid
      const updatePolaroid = (polaroid: PolaroidRecord): PolaroidRecord => {
        if (polaroid.id !== polaroidId) return polaroid;
        const currentlyLiked = polaroid.viewer_has_liked ?? false;
        const currentCount = polaroid.like_count ?? 0;
        return {
          ...polaroid,
          viewer_has_liked: !currentlyLiked,
          like_count: currentlyLiked ? Math.max(0, currentCount - 1) : currentCount + 1,
        };
      };

      // Optimistically update community queries
      previousCommunity.forEach(([queryKey]) => {
        queryClient.setQueryData(queryKey, (old: unknown) => {
          const isArray = Array.isArray(old);
          if (isArray) return (old as PolaroidRecord[]).map(updatePolaroid);
          return old;
        });
      });

      // Optimistically update user query
      if (previousUser) {
        queryClient.setQueryData<PolaroidRecord[]>(["polaroids", "user"], (old = []) =>
          old.map(updatePolaroid)
        );
      }

      return { previousCommunity, previousUser };
    },
    onError: (_err, _polaroidId, context) => {
      // Rollback on error
      if (context?.previousCommunity) {
        context.previousCommunity.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousUser) {
        queryClient.setQueryData(["polaroids", "user"], context.previousUser);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure sync
      queryClient.invalidateQueries({ queryKey: ["polaroids", "community"] });
      queryClient.invalidateQueries({ queryKey: ["polaroids", "user"] });
    },
  });
}


