import { useState } from "react";
import { type Control, type UseFormRegister, type FieldErrors, type UseFieldArrayReturn } from "react-hook-form";
import { Plus, Trash2, User, ChevronLeft, ChevronRight } from "lucide-react";
import type { PolaroidFormValues } from "@/types/form";
import { PlatformSelector } from "./platform-selector";
import { HandleInput } from "./handle-input";
import { TechStackGroups } from "./tech-stack-groups";

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
    // Wait for state update then switch to new index
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
      <div className="flex items-center justify-between border-b-4 border-black pb-4">
        <div className="flex items-center gap-3">
           <div className="bg-accent text-white px-2 py-1 font-mono text-xs font-bold border-2 border-black uppercase">
             User {activeIndex + 1}/{fields.length}
           </div>
           <div className="h-6 w-[2px] bg-black/20" />
           <h3 className="text-lg font-black text-fg tracking-tighter uppercase">Profile Data</h3>
        </div>
        <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-fg transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            >
               <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex(Math.min(fields.length - 1, activeIndex + 1))}
              disabled={activeIndex === fields.length - 1}
              className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-fg transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            >
               <ChevronRight className="w-4 h-4" />
            </button>
        </div>
      </div>

      <div className="relative min-h-[300px]">
          <div
            key={currentField.id}
            className="bg-white border-4 border-black p-6 space-y-6 relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
             {/* Decorative corner accent */}
             <div className="absolute -top-1 -right-1 w-8 h-8 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#000_5px,#000_10px)] border-l-4 border-b-4 border-black" />
             
            <div className="flex items-center justify-between mb-2 border-b-2 border-black pb-3">
              <div className="flex items-center gap-2 text-fg">
                <div className="w-8 h-8 bg-black text-white flex items-center justify-center border-2 border-black">
                  <User className="w-4 h-4" />
                </div>
                <span className="font-mono text-sm font-bold uppercase tracking-wide">User {activeIndex + 1} ID</span>
              </div>
              <div className="flex items-center gap-2">
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemove(activeIndex)}
                      className="text-red-600 hover:bg-red-50 p-2 border-2 border-transparent hover:border-red-600 transition-all uppercase font-bold text-xs tracking-wider flex items-center gap-1"
                      aria-label={`Remove Person ${activeIndex + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  )}
              </div>
            </div>

            <PlatformSelector control={control} index={activeIndex} />
            <HandleInput
              register={register}
              control={control}
              errors={errors}
              index={activeIndex}
            />
            <TechStackGroups control={control} index={activeIndex} />
          </div>
      </div>
      
      <div className="pt-2 flex justify-center">
         <button
          type="button"
          onClick={handleAppend}
          disabled={fields.length >= 4}
          className="flex items-center gap-2 text-sm font-black text-white bg-accent px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-[4px] active:translate-x-[4px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none uppercase tracking-widest w-full justify-center sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          Add Another User
        </button>
      </div>
    </div>
  );
}
