import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { clsx } from "clsx";
import type { PolaroidFormValues } from "@/types/form";

interface ProjectInputProps {
  register: UseFormRegister<PolaroidFormValues>;
  errors: FieldErrors<PolaroidFormValues>;
  index: number;
}

export function ProjectInput({ register, errors, index }: ProjectInputProps) {
  const error = errors.profiles?.[index]?.projectType;

  return (
    <div className="space-y-2">
      <label htmlFor={`project-${index}`} className="block text-xs font-medium text-fg-muted uppercase tracking-[0.08em] font-display">
        What are you building?
      </label>
      <textarea
        id={`project-${index}`}
        {...register(`profiles.${index}.projectType`, { required: "Tell us what you're building" })}
        className={clsx(
          "block w-full px-4 py-3 bg-white border rounded-sm text-sm font-body placeholder-fg-subtle/70 shadow-inner focus:outline-none focus:border-border-strong focus:shadow-focus transition-all duration-150 min-h-[80px] resize-none",
          error ? "border-burgundy focus:border-burgundy" : "border-border hover:border-border-strong"
        )}
        placeholder="e.g. An AI-powered design system generator..."
      />
      {error && <p className="text-xs text-burgundy font-medium">{error.message}</p>}
    </div>
  );
}
