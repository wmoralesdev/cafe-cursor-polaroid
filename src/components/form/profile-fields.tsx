import type { Control, UseFormRegister, FieldErrors, UseFieldArrayReturn } from "react-hook-form";
import { useController } from "react-hook-form";
import { Plus, Trash2, AtSign } from "lucide-react";
import type { PolaroidFormValues, PolaroidTheme } from "@/types/form";
import { polaroidThemes } from "@/constants/polaroid-themes";
import { useLanguage } from "@/hooks/use-language";
import { CodingModelSelector, ThinkingModelSelector, FeatureSelector, PlanSelector, MaxModeToggle, TenureSelector, HandlePlatformSelector } from "./cursor-selectors";
import { ProjectInput } from "./project-input";
import { TechExtras } from "./tech-extras";
import { clsx } from "clsx";

interface ProfileFieldsProps {
  control: Control<PolaroidFormValues>;
  register: UseFormRegister<PolaroidFormValues>;
  errors: FieldErrors<PolaroidFormValues>;
  handleFields: UseFieldArrayReturn<PolaroidFormValues, "profile.handles", "id">["fields"];
  appendHandle: () => void;
  removeHandle: (index: number) => void;
  onInteraction?: () => void;
}

// Dynamically get all available themes from polaroidThemes
const AVAILABLE_THEMES = Object.keys(polaroidThemes) as PolaroidTheme[];

// Helper to get stamp shape from badge style
function getStampShape(theme: PolaroidTheme): "circle" | "square" | "rect" {
  const config = polaroidThemes[theme];
  if (config.featureBadgeStyle === "square" || config.techBadgeStyle === "square") return "square";
  if (config.featureBadgeStyle === "minimal") return "square";
  return "circle";
}

function ThemeSelector({ 
  control, 
  onInteraction 
}: { 
  control: Control<PolaroidFormValues>; 
  onInteraction?: () => void;
}) {
  const { t } = useLanguage();
  const { field } = useController({
    name: "profile.polaroidTheme",
    control,
    defaultValue: "classic",
  });

  return (
    <div className="space-y-2">
      <div className="block text-xs font-medium text-fg-muted uppercase tracking-[0.08em] font-display">
        {t.form.polaroidTheme.label}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {AVAILABLE_THEMES.map((theme) => {
          const config = polaroidThemes[theme];
          const stampShape = getStampShape(theme);
          const isSelected = field.value === theme;
          const themeLabel = t.form.polaroidTheme.themes[theme];
          
          return (
            <button
              key={theme}
              type="button"
              onClick={() => {
                field.onChange(theme);
                onInteraction?.();
              }}
              className={clsx(
                "relative flex flex-col items-center gap-1.5 p-2 rounded-sm border transition-all duration-200",
                isSelected
                  ? "border-accent bg-accent/5 ring-1 ring-accent"
                  : "glass-panel-inner border-border hover:border-border-strong"
              )}
            >
              {/* Mini polaroid preview */}
              <div className="relative w-8 h-10 bg-white rounded-[1px] shadow-sm overflow-hidden">
                {/* Mini tape */}
                <div 
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-4 h-1 rounded-[0.5px] z-10"
                  style={{ background: config.tapeGradient }}
                />
                {/* Mini image area with filter */}
                <div 
                  className="absolute top-1 left-0.5 right-0.5 h-5 bg-gray-300 rounded-[0.5px]"
                  style={{ filter: config.imageFilter }}
                />
                {/* Mini stamp */}
                <div 
                  className={clsx(
                    "absolute bottom-0.5 right-0.5 border opacity-60",
                    stampShape === "square" && "w-3 h-3 rounded-none",
                    stampShape === "circle" && "w-3 h-3 rounded-full",
                    stampShape === "rect" && "w-2.5 h-3.5 rounded-none"
                  )}
                  style={{ borderColor: config.accent }}
                >
                  <div 
                    className={clsx(
                      "absolute inset-0.5",
                      stampShape === "circle" && "rounded-full"
                    )}
                    style={{ backgroundColor: `${config.accent}20` }}
                  />
                </div>
              </div>
              <span className={clsx(
                "text-xs font-medium uppercase tracking-wide",
                isSelected ? "text-accent" : "text-fg-muted"
              )}>
                {themeLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ProfileFields({
  control,
  register,
  errors,
  handleFields,
  appendHandle,
  removeHandle,
  onInteraction,
}: ProfileFieldsProps) {
  const { t } = useLanguage();
  
  const handleInputInteraction = () => {
    onInteraction?.();
  };
  
  return (
    <div className="space-y-8">
      {/* Identity Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border/40">
          <span className="text-xs font-bold text-accent uppercase tracking-wider font-mono">01</span>
          <h3 className="text-sm font-semibold text-fg font-body uppercase tracking-wide">{t.form.sections?.identity || "Identity"}</h3>
        </div>
        
        <div className="space-y-3">
          <div className="block text-xs font-medium text-fg-muted uppercase tracking-[0.08em] font-display">
            {t.form.socialHandles.label} <span className="text-accent">*</span>
          </div>
          
          {handleFields.map((field, index) => {
            const inputId = `handle-${index}`;
            const registerResult = register(`profile.handles.${index}.handle`, { required: t.form.socialHandles.errorRequired });
            return (
              <div key={field.id} className="flex gap-2 items-center">
                <HandlePlatformSelector control={control} handleIndex={index} onInteraction={handleInputInteraction} />
                <div className="flex-1 relative">
                  <label htmlFor={inputId} className="sr-only">
                    {t.form.socialHandles.label}
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-fg-muted">
                    <AtSign className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <input
                    id={inputId}
                    {...registerResult}
                    placeholder={t.form.socialHandles.placeholder}
                    onFocus={handleInputInteraction}
                    onInput={handleInputInteraction}
                    className="block w-full pl-9 pr-4 py-2.5 glass-panel-inner rounded-sm text-sm font-mono font-medium text-fg placeholder:text-fg-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>
              {handleFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeHandle(index)}
                  className="p-2 text-accent glass-panel-inner hover:bg-accent/10 rounded-sm transition-all duration-150"
                  aria-label={t.form.socialHandles.removeHandle}
                >
                  <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                </button>
              )}
              </div>
            );
          })}
          
          {errors.profile?.handles && (
            <p className="text-xs text-accent font-medium">{t.form.socialHandles.errorRequired}</p>
          )}

          {handleFields.length < 4 && (
            <button
              type="button"
              onClick={appendHandle}
              className="flex items-center gap-1.5 text-xs font-medium text-fg-muted hover:text-accent transition-colors"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
              {t.form.socialHandles.addAnother}
            </button>
          )}
        </div>
      </section>

      {/* Profile Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border/40">
          <span className="text-xs font-bold text-accent uppercase tracking-wider font-mono">02</span>
          <h3 className="text-sm font-semibold text-fg font-body uppercase tracking-wide">{t.form.sections?.profile || "Profile"}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
          <div className="sm:col-span-8">
            <PlanSelector control={control} onInteraction={handleInputInteraction} />
          </div>
          <div className="sm:col-span-4">
            <div className="space-y-2">
              <div className="block text-xs font-medium text-fg-muted uppercase tracking-[0.08em] font-display">
                {t.form.options}
              </div>
              <MaxModeToggle control={control} onInteraction={handleInputInteraction} />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <CodingModelSelector control={control} onInteraction={handleInputInteraction} />
          <ThinkingModelSelector control={control} onInteraction={handleInputInteraction} />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FeatureSelector control={control} onInteraction={handleInputInteraction} />
          <TenureSelector control={control} onInteraction={handleInputInteraction} />
        </div>
      </section>

      {/* Project Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border/40">
          <span className="text-xs font-bold text-accent uppercase tracking-wider font-mono">03</span>
          <h3 className="text-sm font-semibold text-fg font-body uppercase tracking-wide">{t.form.sections?.project || "Project"}</h3>
        </div>

        <ProjectInput
          register={register}
          errors={errors}
          onInteraction={handleInputInteraction}
        />
      </section>
      
      {/* Style Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border/40">
          <span className="text-xs font-bold text-accent uppercase tracking-wider font-mono">04</span>
          <h3 className="text-sm font-semibold text-fg font-body uppercase tracking-wide">{t.form.sections?.style || "Style"}</h3>
        </div>

        <TechExtras control={control} onInteraction={handleInputInteraction} />
        
        <ThemeSelector control={control} onInteraction={handleInputInteraction} />
      </section>
    </div>
  );
}



