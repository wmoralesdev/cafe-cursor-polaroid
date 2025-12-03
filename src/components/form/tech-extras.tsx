import { type Control, Controller } from "react-hook-form";
import { clsx } from "clsx";
import type { PolaroidFormValues } from "@/types/form";
import { useLanguage } from "@/contexts/language-context";
import { TECH_EXTRAS } from "@/constants/cursor-data";

interface TechExtrasProps {
  control: Control<PolaroidFormValues>;
  onInteraction?: () => void;
}

export function TechExtras({ control, onInteraction }: TechExtrasProps) {
  const { t } = useLanguage();
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-fg-muted uppercase tracking-[0.08em] font-display">
        {t.form.techStack}
      </label>
      <Controller
        control={control}
        name="profile.extras"
        render={({ field }) => {
          const currentExtras = field.value || [];
          
          const toggleExtra = (tech: string) => {
            onInteraction?.();
            if (currentExtras.includes(tech)) {
              field.onChange(currentExtras.filter((t) => t !== tech));
            } else {
              if (currentExtras.length >= 4) return;
              field.onChange([...currentExtras, tech]);
            }
          };

          return (
            <div className="flex flex-wrap gap-2">
              {TECH_EXTRAS.map((tech) => {
                const isSelected = currentExtras.includes(tech);
                const limitReached = !isSelected && currentExtras.length >= 4;
                
                return (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleExtra(tech)}
                    className={clsx(
                      "px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all duration-150 font-mono",
                      isSelected
                        ? "bg-accent text-white border-accent"
                        : clsx(
                            "bg-card text-fg-muted border-border hover:border-fg-muted hover:bg-card-02",
                            limitReached && "opacity-40 cursor-not-allowed hover:border-border hover:bg-card"
                          )
                    )}
                    disabled={limitReached}
                    aria-pressed={isSelected}
                  >
                    {tech}
                  </button>
                );
              })}
            </div>
          );
        }}
      />
    </div>
  );
}
