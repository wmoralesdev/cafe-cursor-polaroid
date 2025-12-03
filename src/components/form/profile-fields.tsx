import type { Control, UseFormRegister, FieldErrors, UseFieldArrayReturn } from "react-hook-form";
import { Plus, Trash2, AtSign } from "lucide-react";
import type { PolaroidFormValues } from "@/types/form";
import { useLanguage } from "@/contexts/language-context";
import { CodingModelSelector, ThinkingModelSelector, FeatureSelector, PlanSelector, MaxModeToggle, TenureSelector, HandlePlatformSelector } from "./cursor-selectors";
import { ProjectInput } from "./project-input";
import { TechExtras } from "./tech-extras";

interface ProfileFieldsProps {
  control: Control<PolaroidFormValues>;
  register: UseFormRegister<PolaroidFormValues>;
  errors: FieldErrors<PolaroidFormValues>;
  handleFields: UseFieldArrayReturn<PolaroidFormValues, "profile.handles", "id">["fields"];
  appendHandle: () => void;
  removeHandle: (index: number) => void;
  onInteraction?: () => void;
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
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h3 className="text-lg font-display font-semibold text-fg">{t.form.header}</h3>
      </div>

      <div className="card-panel p-6 space-y-6">
        <div className="space-y-3">
          <div className="block text-xs font-medium text-fg-muted uppercase tracking-[0.08em] font-display">
            {t.form.socialHandles.label} <span className="text-accent">*</span>
          </div>
          
          {handleFields.map((field, index) => {
            const inputId = `handle-${index}`;
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
                    {...register(`profile.handles.${index}.handle`, { required: t.form.socialHandles.errorRequired })}
                    placeholder={t.form.socialHandles.placeholder}
                    onFocus={handleInputInteraction}
                    onChange={(e) => {
                      handleInputInteraction();
                      register(`profile.handles.${index}.handle`).onChange(e);
                    }}
                    className="block w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-sm text-sm font-mono font-medium text-fg placeholder:text-fg-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>
              {handleFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeHandle(index)}
                  className="p-2 text-accent hover:bg-accent/10 rounded-sm transition-all duration-150"
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
        
        <ProjectInput
          register={register}
          errors={errors}
          onInteraction={handleInputInteraction}
        />
        
        <TechExtras control={control} onInteraction={handleInputInteraction} />
      </div>
    </div>
  );
}



