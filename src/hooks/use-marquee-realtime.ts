import { useEffect, useState, useCallback, useRef } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { PolaroidRecord } from "@/lib/polaroids";

export type ConnectionStatus = "connecting" | "live" | "updating" | "offline";

interface MarqueePageData {
  items: PolaroidRecord[];
  nextPage: number | undefined;
  pageParam: number;
}

const INFINITE_QUERY_KEY = ["polaroids", "community", "infinite"];

/**
 * Realtime subscription for the marquee feed.
 * - Buffers INSERTs instead of auto-prepending (no scroll jump)
 * - Updates in-place for UPDATEs
 * - Removes items for DELETEs
 * - Tracks connection status
 */
export function useMarqueeRealtime() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [pendingItems, setPendingItems] = useState<PolaroidRecord[]>([]);
  const updateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Helper to check if a polaroid is "complete" (has image_url and valid handle)
  const isCompletePolaroid = useCallback((polaroid: PolaroidRecord): boolean => {
    return (
      !!polaroid.image_url &&
      !!polaroid.profile?.handles &&
      Array.isArray(polaroid.profile.handles) &&
      polaroid.profile.handles.length > 0 &&
      !!polaroid.profile.handles[0]?.handle?.trim()
    );
  }, []);

  // Show "updating" status briefly
  const flashUpdating = useCallback(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    setStatus("updating");
    updateTimeoutRef.current = setTimeout(() => {
      setStatus("live");
    }, 800);
  }, []);

  useEffect(() => {
    if (retryCount > 0) {
      console.log(`Reconnecting to marquee channel (attempt ${retryCount})...`);
    }

    const channel = supabase
      .channel("marquee-polaroids")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "polaroids",
        },
        (payload) => {
          const newPolaroid = payload.new as PolaroidRecord;
          // Only buffer complete polaroids
          if (isCompletePolaroid(newPolaroid)) {
            flashUpdating();
            setPendingItems((prev) => {
              // Avoid duplicates
              if (prev.some((p) => p.id === newPolaroid.id)) return prev;
              return [newPolaroid, ...prev];
            });
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "polaroids",
        },
        (payload) => {
          const updatedPolaroid = payload.new as PolaroidRecord;
          flashUpdating();

          // Update in pending items if present
          setPendingItems((prev) =>
            prev.map((p) => (p.id === updatedPolaroid.id ? updatedPolaroid : p))
          );

          // Update in infinite query cache if present
          queryClient.setQueryData<InfiniteData<MarqueePageData>>(
            INFINITE_QUERY_KEY,
            (oldData) => {
              if (!oldData) return oldData;
              return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                  ...page,
                  items: page.items.map((item) =>
                    item.id === updatedPolaroid.id ? updatedPolaroid : item
                  ),
                })),
              };
            }
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "polaroids",
        },
        (payload) => {
          const deletedId = payload.old.id as string;
          flashUpdating();

          // Remove from pending items
          setPendingItems((prev) => prev.filter((p) => p.id !== deletedId));

          // Remove from infinite query cache
          queryClient.setQueryData<InfiniteData<MarqueePageData>>(
            INFINITE_QUERY_KEY,
            (oldData) => {
              if (!oldData) return oldData;
              return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                  ...page,
                  items: page.items.filter((item) => item.id !== deletedId),
                })),
              };
            }
          );
        }
      )
      .subscribe((subscriptionStatus) => {
        if (subscriptionStatus === "SUBSCRIBED") {
          setStatus("live");
        } else if (subscriptionStatus === "CLOSED" || subscriptionStatus === "CHANNEL_ERROR") {
          setStatus("offline");
          // Attempt reconnection after delay
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
          }, 5000);
        }
      });

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [queryClient, isCompletePolaroid, flashUpdating, retryCount]);

  /**
   * Merge pending items into the infinite query cache (prepend to first page).
   * Returns the number of items merged for scroll compensation.
   */
  const mergePendingItems = useCallback((): number => {
    const itemsToMerge = [...pendingItems];
    if (itemsToMerge.length === 0) return 0;

    queryClient.setQueryData<InfiniteData<MarqueePageData>>(
      INFINITE_QUERY_KEY,
      (oldData) => {
        if (!oldData || oldData.pages.length === 0) {
          // If no data yet, create initial page with pending items
          return {
            pages: [
              {
                items: itemsToMerge,
                nextPage: 1,
                pageParam: 0,
              },
            ],
            pageParams: [0],
          };
        }

        // Prepend to first page, avoiding duplicates
        const firstPage = oldData.pages[0];
        const existingIds = new Set(firstPage.items.map((item) => item.id));
        const newItems = itemsToMerge.filter((item) => !existingIds.has(item.id));

        return {
          ...oldData,
          pages: [
            {
              ...firstPage,
              items: [...newItems, ...firstPage.items],
            },
            ...oldData.pages.slice(1),
          ],
        };
      }
    );

    setPendingItems([]);
    return itemsToMerge.length;
  }, [pendingItems, queryClient]);

  return {
    status,
    pendingCount: pendingItems.length,
    mergePendingItems,
  };
}
