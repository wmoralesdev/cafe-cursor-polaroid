import { type Control, Controller } from "react-hook-form";
import { clsx } from "clsx";
import type { PolaroidFormValues } from "@/types/form";
import { TECH_EXTRAS } from "@/constants/cursor-data";

interface TechExtrasProps {
  control: Control<PolaroidFormValues>;
  index: number;
}

export function TechExtras({ control, index }: TechExtrasProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-fg-muted uppercase tracking-[0.08em] font-display">
        Tech Stack (Max 2)
      </label>
      <Controller
        control={control}
        name={`profiles.${index}.extras`}
        render={({ field }) => {
          const currentExtras = field.value || [];
          
          const toggleExtra = (tech: string) => {
            if (currentExtras.includes(tech)) {
              field.onChange(currentExtras.filter((t) => t !== tech));
            } else {
              if (currentExtras.length >= 2) return; // Limit to 2
              field.onChange([...currentExtras, tech]);
            }
          };

          return (
            <div className="flex flex-wrap gap-2">
              {TECH_EXTRAS.map((tech) => {
                const isSelected = currentExtras.includes(tech);
                const limitReached = !isSelected && currentExtras.length >= 2;
                
                return (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleExtra(tech)}
                    className={clsx(
                      "px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all duration-150 font-mono",
                      isSelected
                        ? "bg-fg text-white border-fg"
                        : clsx(
                            "bg-transparent text-fg-muted border-border hover:border-fg-muted",
                            limitReached && "opacity-40 cursor-not-allowed hover:border-border"
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
