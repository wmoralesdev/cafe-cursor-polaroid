import { useState } from "react";
import { type Control, type UseFormRegister, type FieldErrors, type UseFieldArrayReturn } from "react-hook-form";
import { Plus, Trash2, User, ChevronLeft, ChevronRight } from "lucide-react";
import type { PolaroidFormValues } from "@/types/form";
import { CodingModelSelector, ThinkingModelSelector, FeatureSelector, PlanSelector, MaxModeToggle } from "./cursor-selectors";
import { ProjectInput } from "./project-input";
import { TechExtras } from "./tech-extras";

interface ProfileArrayFieldsProps {
  control: Control<PolaroidFormValues>;
  register: UseFormRegister<PolaroidFormValues>;
  errors: FieldErrors<PolaroidFormValues>;
  fields: UseFieldArrayReturn<PolaroidFormValues, "profiles", "id">["fields"];
  append: () => void;
  remove: (index: number) => void;
}

export function ProfileArrayFields({
  control,
  register,
  errors,
  fields,
  append,
  remove,
}: ProfileArrayFieldsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleAppend = () => {
    append();
    setTimeout(() => setActiveIndex(fields.length), 0);
  };

  const handleRemove = (index: number) => {
    remove(index);
    if (index === activeIndex && index > 0) {
      setActiveIndex(index - 1);
    } else if (index < activeIndex) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const currentField = fields[activeIndex];

  if (!currentField) return null;

  return (
    <div className="space-y-6">
      {/* Header with navigation */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
           <div className="bg-gold text-cream px-2.5 py-1 font-mono text-xs font-medium rounded-sm">
             {activeIndex + 1}/{fields.length}
           </div>
           <h3 className="text-lg font-display font-semibold text-fg">Cursor Profile</h3>
        </div>
        <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className="p-2 rounded-sm border border-border bg-cream hover:bg-parchment hover:border-border-strong disabled:opacity-40 disabled:hover:bg-cream disabled:hover:border-border transition-all duration-150"
            >
               <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex(Math.min(fields.length - 1, activeIndex + 1))}
              disabled={activeIndex === fields.length - 1}
              className="p-2 rounded-sm border border-border bg-cream hover:bg-parchment hover:border-border-strong disabled:opacity-40 disabled:hover:bg-cream disabled:hover:border-border transition-all duration-150"
            >
               <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="relative min-h-[300px]">
          <div
            key={currentField.id}
            className="warm-panel p-6 space-y-6 relative"
          >
            {/* Card header */}
            <div className="flex items-center justify-between mb-2 border-b border-border pb-3">
              <div className="flex items-center gap-2.5 text-fg">
                <div className="w-8 h-8 bg-gold/10 text-gold flex items-center justify-center rounded-sm">
                  <User className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <span className="font-mono text-sm font-medium text-fg-muted">User {activeIndex + 1}</span>
              </div>
              <div className="flex items-center gap-2">
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemove(activeIndex)}
                      className="text-burgundy hover:bg-burgundy/10 p-2 rounded-sm transition-all duration-150 flex items-center gap-1.5 text-sm font-medium"
                      aria-label={`Remove Person ${activeIndex + 1}`}
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
               <div className="sm:col-span-8">
                 <PlanSelector control={control} index={activeIndex} />
               </div>
               <div className="sm:col-span-4">
                 <div className="space-y-2">
                    <label className="block text-xs font-medium text-fg-muted uppercase tracking-[0.08em] font-display">
                      Options
                    </label>
                    <MaxModeToggle control={control} index={activeIndex} />
                 </div>
               </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <CodingModelSelector control={control} index={activeIndex} />
               <ThinkingModelSelector control={control} index={activeIndex} />
            </div>
            
            <FeatureSelector control={control} index={activeIndex} />
            
            <ProjectInput
              register={register}
              errors={errors}
              index={activeIndex}
            />
            
            <TechExtras control={control} index={activeIndex} />
          </div>
      </div>
      
      {/* Add user button */}
      <div className="pt-2 flex justify-center">
         <button
          type="button"
          onClick={handleAppend}
          disabled={fields.length >= 4}
          className="flex items-center gap-2 text-sm font-medium text-fg bg-cream border border-border px-5 py-2.5 rounded-sm hover:bg-parchment hover:border-border-strong transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed w-full justify-center sm:w-auto font-body"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Add Another Profile
        </button>
      </div>
    </div>
  );
}
