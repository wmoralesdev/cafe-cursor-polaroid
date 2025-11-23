import { type Control, Controller } from "react-hook-form";
import { Github, Instagram } from "lucide-react";
import { XIcon } from "@/components/ui/x-icon";
import { clsx } from "clsx";
import type { PolaroidFormValues, Platform } from "@/types/form";

interface PlatformSelectorProps {
  control: Control<PolaroidFormValues>;
  index: number;
}

const PLATFORMS: { id: Platform; label: string; icon: React.ElementType }[] = [
  { id: "github", label: "GitHub", icon: Github },
  { id: "x", label: "X", icon: XIcon },
  { id: "instagram", label: "Instagram", icon: Instagram },
];

export function PlatformSelector({ control, index }: PlatformSelectorProps) {
  return (
    <Controller
      control={control}
      name={`profiles.${index}.platform`}
      render={({ field }) => (
        <div className="flex p-1 bg-card-02 rounded-lg gap-1 border border-black/5">
          {PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            const isSelected = field.value === platform.id;
            
            return (
              <button
                key={platform.id}
                type="button"
                onClick={() => field.onChange(platform.id)}
                className={clsx(
                  "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-[4px] text-xs font-bold uppercase tracking-wider transition-all duration-200",
                  isSelected
                    ? "bg-white text-black shadow-sm border border-black/10 ring-1 ring-black/5"
                    : "text-fg/50 hover:text-fg hover:bg-white/50"
                )}
                aria-pressed={isSelected}
              >
                <Icon className={clsx("w-3.5 h-3.5", isSelected && "scale-110")} />
                <span className="hidden sm:inline">{platform.label}</span>
              </button>
            );
          })}
        </div>
      )}
    />
  );
}


