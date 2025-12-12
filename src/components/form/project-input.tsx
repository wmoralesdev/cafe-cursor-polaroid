import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { clsx } from "clsx";
import { useMemo } from "react";
import type { PolaroidFormValues } from "@/types/form";
import { useLanguage } from "@/contexts/language-context";

interface ProjectInputProps {
  register: UseFormRegister<PolaroidFormValues>;
  errors: FieldErrors<PolaroidFormValues>;
  onInteraction?: () => void;
}

export function ProjectInput({ register, errors, onInteraction }: ProjectInputProps) {
  const { t } = useLanguage();
  const error = errors.profile?.projectType;
  
  const placeholder = useMemo(() => {
    const placeholders = t.form.currentProject.placeholders;
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  }, [t]);

  const registerResult = register("profile.projectType", { required: t.form.currentProject.errorRequired });

  return (
    <div className="space-y-2">
      <label htmlFor="project" className="block text-xs font-medium text-fg-muted uppercase tracking-[0.08em] font-display">
        {t.form.currentProject.label} <span className="text-accent">*</span>
      </label>
      <input
        type="text"
        id="project"
        maxLength={60}
        {...registerResult}
        onFocus={onInteraction}
        onInput={onInteraction}
        className={clsx(
          "block w-full px-4 py-2.5 glass-panel-inner rounded-sm text-sm font-body placeholder-fg-muted/70 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-150",
          error ? "border-accent focus:border-accent" : "border-border hover:border-border-strong"
        )}
        placeholder={placeholder}
      />
      {error && <p className="text-xs text-accent font-medium">{error.message}</p>}
    </div>
  );
}
