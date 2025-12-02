import { useForm, useFieldArray } from "react-hook-form";
import type { PolaroidFormValues, CursorProfile, HandleEntry } from "@/types/form";

const DEFAULT_HANDLE: HandleEntry = {
  handle: "",
  platform: "x",
};

const DEFAULT_PROFILE: CursorProfile = {
  handles: [DEFAULT_HANDLE],
  primaryModel: "composer-1",
  secondaryModel: "gpt-5.1",
  favoriteFeature: "agent",
  planTier: "pro",
  projectType: "",
  extras: [],
  isMaxMode: false,
  cursorSince: "2024",
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
      profile: DEFAULT_PROFILE,
    },
    mode: "onChange",
  });

  const { fields: handleFields, append: appendHandle, remove: removeHandle } = useFieldArray({
    control,
    name: "profile.handles",
  });

  return {
    control,
    register,
    watch,
    errors,
    handleFields,
    appendHandle: () => appendHandle({ ...DEFAULT_HANDLE }),
    removeHandle,
    reset,
  };
}

export type UsePolaroidFormReturn = ReturnType<typeof usePolaroidForm>;
