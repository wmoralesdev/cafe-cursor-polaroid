import { type Control, Controller } from "react-hook-form";
import { clsx } from "clsx";
import { ChevronDown, Zap } from "lucide-react";
import type { PolaroidFormValues } from "@/types/form";
import { CURSOR_MODELS, CURSOR_FEATURES, PLAN_TIERS } from "@/constants/cursor-data";

interface SelectorProps {
  control: Control<PolaroidFormValues>;
  index: number;
}

function BaseModelSelector({ control, index, name, label }: { control: Control<PolaroidFormValues>; index: number; name: "primaryModel" | "secondaryModel"; label: string }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-fg-muted uppercase tracking-[0.08em] font-display">
        {label}
      </label>
      <Controller
        control={control}
        name={`profiles.${index}.${name}`}
        render={({ field }) => (
          <div className="relative">
            <select
              {...field}
              className="block w-full appearance-none bg-white border border-border rounded-sm py-2.5 pl-3 pr-10 text-sm font-body focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors cursor-pointer"
            >
              {CURSOR_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-fg-muted">
              <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
            </div>
          </div>
        )}
      />
    </div>
  );
}

export function CodingModelSelector({ control, index }: SelectorProps) {
  return <BaseModelSelector control={control} index={index} name="primaryModel" label="Coding Model" />;
}

export function ThinkingModelSelector({ control, index }: SelectorProps) {
  return <BaseModelSelector control={control} index={index} name="secondaryModel" label="Thinking Model" />;
}

export function MaxModeToggle({ control, index }: SelectorProps) {
  return (
    <Controller
      control={control}
      name={`profiles.${index}.isMaxMode`}
      render={({ field: { value, onChange } }) => (
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={clsx(
            "flex items-center gap-2 px-3 py-2 rounded-sm border transition-all duration-200 w-full justify-center text-xs font-medium font-body uppercase tracking-wider",
            value
              ? "bg-gold/10 text-gold border-gold shadow-sm"
              : "bg-white text-fg-muted border-border hover:border-border-strong hover:bg-parchment"
          )}
          aria-pressed={value}
        >
          <Zap className={clsx("w-3.5 h-3.5", value ? "fill-gold" : "")} strokeWidth={1.5} />
          <span>Max Mode</span>
        </button>
      )}
    />
  );
}

export function FeatureSelector({ control, index }: SelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-fg-muted uppercase tracking-[0.08em] font-display">
        Favorite Feature
      </label>
      <Controller
        control={control}
        name={`profiles.${index}.favoriteFeature`}
        render={({ field }) => (
          <div className="flex flex-wrap gap-2">
            {CURSOR_FEATURES.map((feature) => {
              const isSelected = field.value === feature.id;
              return (
                <button
                  key={feature.id}
                  type="button"
                  onClick={() => field.onChange(feature.id)}
                  className={clsx(
                    "px-3 py-1.5 rounded-sm text-xs font-medium transition-all duration-150 font-body border",
                    isSelected
                      ? "bg-gold/10 text-gold border-gold shadow-sm"
                      : "bg-white text-fg-muted border-border hover:border-border-strong hover:bg-parchment"
                  )}
                  aria-pressed={isSelected}
                >
                  {feature.label}
                </button>
              );
            })}
          </div>
        )}
      />
    </div>
  );
}

export function PlanSelector({ control, index }: SelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-fg-muted uppercase tracking-[0.08em] font-display">
        Plan Tier
      </label>
      <Controller
        control={control}
        name={`profiles.${index}.planTier`}
        render={({ field }) => (
          <div className="flex flex-wrap gap-2">
            {PLAN_TIERS.map((plan) => {
              const isSelected = field.value === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => field.onChange(plan.id)}
                  className={clsx(
                    "flex-1 min-w-[60px] py-2 px-3 rounded-sm text-xs font-medium transition-all duration-150 font-body border text-center whitespace-nowrap",
                    isSelected
                      ? "bg-gold/10 text-gold border-gold shadow-sm"
                      : "bg-white text-fg-muted border-border hover:border-border-strong hover:bg-parchment"
                  )}
                  aria-pressed={isSelected}
                >
                  {plan.label}
                </button>
              );
            })}
          </div>
        )}
      />
    </div>
  );
}
