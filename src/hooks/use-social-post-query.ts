import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useSocialPostPolaroid() {
  return useMutation({
    mutationFn: async (polaroidId: string) => {
      const { data, error } = await supabase.functions.invoke("post-polaroid", {
        body: { polaroidId },
      });

      if (error) {
        throw new Error(error.message || "Failed to post polaroid");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return data;
    },
  });
}












