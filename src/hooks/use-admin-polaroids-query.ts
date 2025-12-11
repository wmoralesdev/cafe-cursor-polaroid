import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { PolaroidRecord } from "@/lib/polaroids";

export interface AdminPolaroidsFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  provider?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  dateRange?: "24h" | "7d" | "30d" | "all";
}

export interface AdminPolaroidsResponse {
  data: PolaroidRecord[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export function useAdminPolaroidsQuery(filters: AdminPolaroidsFilters = {}) {
  return useQuery({
    queryKey: ["admin-polaroids", filters],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("get-admin-polaroids", {
        body: filters,
      });

      if (error) {
        throw new Error(`Failed to get admin polaroids: ${error.message}`);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return data as AdminPolaroidsResponse;
    },
  });
}







