import { useForm, useFieldArray } from "react-hook-form";
import type { PolaroidFormValues, CursorProfile } from "@/types/form";

const DEFAULT_PROFILE: CursorProfile = {
  primaryModel: "gpt-5",
  secondaryModel: "o3",
  favoriteFeature: "agent",
  planTier: "pro",
  projectType: "",
  extras: [],
  isMaxMode: false,
};

export function usePolaroidForm() {
  const {
    control,
    register,
    watch,
    formState: { errors },
    reset,
  } = useForm<PolaroidFormValues>({
    defaultValues: {
      profiles: [DEFAULT_PROFILE],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "profiles",
  });

  return {
    control,
    register,
    watch,
    errors,
    fields,
    append: () => append({ ...DEFAULT_PROFILE }),
    remove,
    reset,
  };
}

export type UsePolaroidFormReturn = ReturnType<typeof usePolaroidForm>;
