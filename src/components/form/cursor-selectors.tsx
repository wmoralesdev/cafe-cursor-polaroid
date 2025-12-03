import { type Control, Controller } from "react-hook-form";
import { clsx } from "clsx";
import { ChevronDown, Zap } from "lucide-react";
import type { PolaroidFormValues, SocialPlatform } from "@/types/form";
import { useLanguage } from "@/contexts/language-context";
import { CURSOR_MODELS, CURSOR_FEATURES, PLAN_TIERS, CURSOR_TENURES } from "@/constants/cursor-data";
import { XIcon } from "@/components/ui/x-icon";
import { Linkedin } from "lucide-react";

const SOCIAL_PLATFORMS: { id: SocialPlatform; label: string; icon: React.ReactNode }[] = [
  { id: "x", label: "X", icon: <XIcon className="w-3.5 h-3.5" /> },
  { id: "linkedin", label: "LinkedIn", icon: <Linkedin className="w-3.5 h-3.5" strokeWidth={1.5} /> },
];

interface SelectorProps {
  control: Control<PolaroidFormValues>;
  onInteraction?: () => void;
}

interface HandlePlatformSelectorProps {
  control: Control<PolaroidFormValues>;
  handleIndex: number;
  onInteraction?: () => void;
}

function BaseModelSelector({ control, name, labelKey, onInteraction }: { control: Control<PolaroidFormValues>; name: "primaryModel" | "secondaryModel"; labelKey: "codingModel" | "thinkingModel"; onInteraction?: () => void }) {
  const { t } = useLanguage();
  const selectId = `select-${name}`;
  return (
    <div className="space-y-2">
      <label htmlFor={selectId} className="block text-xs font-medium text-fg-muted uppercase tracking-[0.08em] font-display">
        {t.form[labelKey]}
      </label>
      <Controller
        control={control}
        name={`profile.${name}`}
        render={({ field }) => (
          <div className="relative">
            <select
              id={selectId}
              {...field}
              onChange={(e) => {
                onInteraction?.();
                field.onChange(e);
              }}
              onFocus={onInteraction}
              className="block w-full appearance-none bg-card border border-border rounded-sm py-2.5 pl-3 pr-10 text-sm font-body text-fg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors cursor-pointer"
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

export function CodingModelSelector({ control, onInteraction }: SelectorProps) {
  return <BaseModelSelector control={control} name="primaryModel" labelKey="codingModel" onInteraction={onInteraction} />;
}

export function ThinkingModelSelector({ control, onInteraction }: SelectorProps) {
  return <BaseModelSelector control={control} name="secondaryModel" labelKey="thinkingModel" onInteraction={onInteraction} />;
}

export function MaxModeToggle({ control, onInteraction }: SelectorProps) {
  const { t } = useLanguage();
  return (
    <Controller
      control={control}
      name="profile.isMaxMode"
      render={({ field: { value, onChange } }) => (
        <button
          type="button"
          onClick={() => {
            onInteraction?.();
            onChange(!value);
          }}
          className={clsx(
            "flex items-center gap-2 px-3 py-2 rounded-sm border transition-all duration-200 w-full justify-center text-xs font-medium font-body uppercase tracking-wider",
            "hover:scale-[1.02] active:scale-[0.98]",
            value
              ? "bg-accent/10 text-accent border-accent shadow-sm animate-[pulse-soft_2s_ease-in-out_infinite]"
              : "bg-card text-fg-muted border-border hover:border-border-strong hover:bg-card-02"
          )}
          aria-pressed={value}
        >
          <Zap className={clsx("w-3.5 h-3.5 transition-transform", value ? "fill-accent scale-110" : "")} strokeWidth={1.5} />
          <span>{t.form.maxMode}</span>
        </button>
      )}
    />
  );
}

export function FeatureSelector({ control, onInteraction }: SelectorProps) {
  const { t } = useLanguage();
  return (
    <div className="space-y-2">
      <div className="block text-xs font-medium text-fg-muted uppercase tracking-[0.08em] font-display">
        {t.form.favoriteFeature} <span className="text-accent">*</span>
      </div>
      <Controller
        control={control}
        name="profile.favoriteFeature"
        render={({ field }) => (
          <fieldset className="flex flex-wrap gap-2 border-0 p-0 m-0">
            <legend className="sr-only">{t.form.favoriteFeature}</legend>
            {CURSOR_FEATURES.map((feature) => {
              const isSelected = field.value === feature.id;
              return (
                <button
                  key={feature.id}
                  type="button"
                  onClick={() => {
                    onInteraction?.();
                    field.onChange(feature.id);
                  }}
                  className={clsx(
                    "px-3 py-1.5 rounded-sm text-xs font-medium transition-all duration-150 font-body border",
                    "hover:scale-[1.03] active:scale-[0.97]",
                    isSelected
                      ? "bg-accent/10 text-accent border-accent shadow-sm scale-[1.02]"
                      : "bg-card text-fg-muted border-border hover:border-border-strong hover:bg-card-02"
                  )}
                  aria-pressed={isSelected}
                >
                  {feature.label}
                </button>
              );
            })}
          </fieldset>
        )}
      />
    </div>
  );
}

export function PlanSelector({ control, onInteraction }: SelectorProps) {
  const { t } = useLanguage();
  return (
    <div className="space-y-2">
      <div className="block text-xs font-medium text-fg-muted uppercase tracking-[0.08em] font-display">
        {t.form.planTier} <span className="text-accent">*</span>
      </div>
      <Controller
        control={control}
        name="profile.planTier"
        render={({ field }) => (
          <fieldset className="flex flex-wrap gap-2 border-0 p-0 m-0">
            <legend className="sr-only">{t.form.planTier}</legend>
            {PLAN_TIERS.map((plan) => {
              const isSelected = field.value === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => {
                    onInteraction?.();
                    field.onChange(plan.id);
                  }}
                  className={clsx(
                    "flex-1 min-w-[60px] py-2 px-3 rounded-sm text-xs font-medium transition-all duration-150 font-body border text-center whitespace-nowrap flex items-center justify-center",
                    "hover:scale-[1.02] active:scale-[0.98]",
                    isSelected
                      ? "bg-accent/10 text-accent border-accent shadow-sm scale-[1.01]"
                      : "bg-card text-fg-muted border-border hover:border-border-strong hover:bg-card-02"
                  )}
                  aria-pressed={isSelected}
                >
                  {plan.label}
                </button>
              );
            })}
          </fieldset>
        )}
      />
    </div>
  );
}

export function TenureSelector({ control, onInteraction }: SelectorProps) {
  const { t } = useLanguage();
  return (
    <div className="space-y-2">
      <div className="block text-xs font-medium text-fg-muted uppercase tracking-[0.08em] font-display">
        {t.form.cursorSince} <span className="text-accent">*</span>
      </div>
      <Controller
        control={control}
        name="profile.cursorSince"
        render={({ field }) => (
          <fieldset className="flex flex-wrap gap-2 border-0 p-0 m-0">
            <legend className="sr-only">{t.form.cursorSince}</legend>
            {CURSOR_TENURES.map((tenure) => {
              const isSelected = field.value === tenure.id;
              return (
                <button
                  key={tenure.id}
                  type="button"
                  onClick={() => {
                    onInteraction?.();
                    field.onChange(tenure.id);
                  }}
                  className={clsx(
                    "px-3 py-1.5 rounded-sm text-xs font-medium transition-all duration-150 font-body border",
                    "hover:scale-[1.03] active:scale-[0.97]",
                    isSelected
                      ? "bg-accent/10 text-accent border-accent shadow-sm scale-[1.02]"
                      : "bg-card text-fg-muted border-border hover:border-border-strong hover:bg-card-02"
                  )}
                  aria-pressed={isSelected}
                >
                  {tenure.label}
                </button>
              );
            })}
          </fieldset>
        )}
      />
    </div>
  );
}

export function HandlePlatformSelector({ control, handleIndex, onInteraction }: HandlePlatformSelectorProps) {
  return (
    <Controller
      control={control}
      name={`profile.handles.${handleIndex}.platform`}
      render={({ field }) => (
        <div className="flex gap-1">
          {SOCIAL_PLATFORMS.map((platform) => {
            const isSelected = field.value === platform.id;
            return (
              <button
                key={platform.id}
                type="button"
                onClick={() => {
                  onInteraction?.();
                  field.onChange(platform.id);
                }}
                className={clsx(
                  "p-2 rounded-sm border transition-all duration-150",
                  "hover:scale-[1.05] active:scale-[0.95]",
                  isSelected
                    ? "bg-accent text-white border-accent shadow-sm"
                    : "bg-card text-fg-muted border-border hover:border-border-strong"
                )}
                aria-pressed={isSelected}
                title={platform.label}
              >
                {platform.icon}
              </button>
            );
          })}
        </div>
      )}
    />
  );
}
