import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface LikeNotification {
  id: string;
  polaroid_id: string;
  actor_name: string | null;
  actor_avatar_url: string | null;
  created_at: string;
  read_at: string | null;
}

interface NotificationsResponse {
  data: LikeNotification[];
  unreadCount: number;
}

export function useLikeNotifications(enabled: boolean = true, limit: number = 20) {
  return useQuery({
    queryKey: ["notifications", "likes", limit],
    queryFn: async (): Promise<NotificationsResponse> => {
      const { data, error } = await supabase.functions.invoke("get-like-notifications", {
        body: { limit, markAsRead: false },
      });

      if (error) {
        throw new Error(`Failed to get notifications: ${error.message}`);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return {
        data: data?.data || [],
        unreadCount: data?.unreadCount || 0,
      };
    },
    enabled,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("get-like-notifications", {
        body: { limit: 100, markAsRead: true },
      });

      if (error) {
        throw new Error(`Failed to mark notifications as read: ${error.message}`);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "likes"] });
    },
  });
}

