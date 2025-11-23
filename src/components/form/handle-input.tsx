import { type UseFormRegister, type FieldErrors, type Control, useWatch } from "react-hook-form";
import { Github, Instagram, Twitter, AtSign } from "lucide-react";
import { clsx } from "clsx";
import type { PolaroidFormValues } from "@/types/form";

interface HandleInputProps {
  register: UseFormRegister<PolaroidFormValues>;
  control: Control<PolaroidFormValues>;
  errors: FieldErrors<PolaroidFormValues>;
  index: number;
}

export function HandleInput({ register, control, errors, index }: HandleInputProps) {
  const platform = useWatch({
    control,
    name: `profiles.${index}.platform`,
  });

  const getIcon = () => {
    switch (platform) {
      case "github": return Github;
      case "x": return Twitter;
      case "instagram": return Instagram;
      default: return AtSign;
    }
  };

  const Icon = getIcon();
  const error = errors.profiles?.[index]?.handle;

  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-fg/70 uppercase tracking-wider">
        Handle
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-4 w-4 text-fg/40" />
        </div>
        <input
          type="text"
          {...register(`profiles.${index}.handle`, { required: "Handle is required" })}
          className={clsx(
            "block w-full pl-10 pr-3 py-2 bg-white/50 border rounded-lg text-sm placeholder-fg/30 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all duration-200",
            error ? "border-red-300 focus:border-red-500" : "border-card-03 focus:border-accent hover:border-card-04"
          )}
          placeholder="username"
        />
      </div>
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  );
}

