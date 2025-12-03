import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { PolaroidRecord } from "@/lib/polaroids";

export function useCommunityRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("community-polaroids")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "polaroids",
        },
        (payload) => {
          const newPolaroid = payload.new as PolaroidRecord;
          queryClient.setQueryData<PolaroidRecord[]>(
            ["polaroids", "community", 20],
            (old = []) => {
              if (old.some((p) => p.id === newPolaroid.id)) return old;
              return [newPolaroid, ...old];
            }
          );
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
          queryClient.setQueryData<PolaroidRecord[]>(
            ["polaroids", "community", 20],
            (old = []) => {
              const exists = old.some((p) => p.id === updatedPolaroid.id);
              if (exists) {
                return old.map((p) =>
                  p.id === updatedPolaroid.id ? updatedPolaroid : p
                );
              }
              return [updatedPolaroid, ...old];
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
          queryClient.setQueryData<PolaroidRecord[]>(
            ["polaroids", "community", 20],
            (old = []) => old.filter((p) => p.id !== deletedId)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}

