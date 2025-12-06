import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import type { PolaroidFormValues, CursorProfile, HandleEntry } from "@/types/form";

const DEFAULT_HANDLE: HandleEntry = {
  handle: "",
  platform: "x",
};

function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

export function getDefaultProfile(): CursorProfile {
  return {
    handles: [{ ...DEFAULT_HANDLE }],
    primaryModel: "composer-1",
    secondaryModel: "gpt-5.1",
    favoriteFeature: "agent",
    planTier: "pro",
    projectType: "",
    extras: [],
    isMaxMode: false,
    cursorSince: "2024",
    generatedAt: getTodayDateString(),
  };
}

interface UsePolaroidFormOptions {
  initialProfile?: CursorProfile | null;
}

export function usePolaroidForm(options: UsePolaroidFormOptions = {}) {
  const {
    control,
    register,
    watch,
    formState: { errors },
    reset,
  } = useForm<PolaroidFormValues>({
    defaultValues: {
      profile: options.initialProfile ?? getDefaultProfile(),
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (options.initialProfile) {
      reset({ profile: options.initialProfile });
    }
  }, [options.initialProfile, reset]);

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
