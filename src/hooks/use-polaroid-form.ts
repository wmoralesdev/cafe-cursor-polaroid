import { useForm, useFieldArray } from "react-hook-form";
import type { PolaroidFormValues, Profile } from "@/types/form";

const DEFAULT_PROFILE: Profile = {
  platform: "github",
  handle: "",
  techStack: [],
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

