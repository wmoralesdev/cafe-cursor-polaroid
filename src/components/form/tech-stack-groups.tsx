import { type Control, Controller } from "react-hook-form";
import { clsx } from "clsx";
import type { PolaroidFormValues } from "@/types/form";
import { TECH_STACKS, type TechGroup } from "@/constants/tech-stack";

interface TechStackGroupsProps {
  control: Control<PolaroidFormValues>;
  index: number;
}

export function TechStackGroups({ control, index }: TechStackGroupsProps) {
  return (
    <div className="space-y-5">
      {(Object.keys(TECH_STACKS) as TechGroup[]).map((group) => (
        <div key={group} className="space-y-2.5">
          <h4 className="text-[10px] font-bold text-fg uppercase tracking-widest border-b border-black/5 pb-1">
            {group}
          </h4>
          <Controller
            control={control}
            name={`profiles.${index}.techStack`}
            render={({ field }) => {
              const currentStack = field.value || [];
              const groupOptions = TECH_STACKS[group];
              
              const toggleTech = (tech: string) => {
                if (currentStack.includes(tech)) {
                  field.onChange(currentStack.filter((t) => t !== tech));
                } else {
                  // limit to 2 selections per category
                  const selectedInGroup = currentStack.filter((t) =>
                    groupOptions.includes(t)
                  );
                  if (selectedInGroup.length >= 2) return;
                  field.onChange([...currentStack, tech]);
                }
              };

              return (
                <div className="flex flex-wrap gap-2">
                  {TECH_STACKS[group].map((tech) => {
                    const isSelected = currentStack.includes(tech);
                    const selectedInGroup = currentStack.filter((t) =>
                      groupOptions.includes(t)
                    );
                    const groupLimitReached =
                      !isSelected && selectedInGroup.length >= 2;
                    return (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => toggleTech(tech)}
                        className={clsx(
                          "px-3 py-1.5 rounded-md text-[11px] font-bold border-2 transition-all duration-100 active:scale-95 uppercase tracking-wide",
                          isSelected
                            ? "bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]"
                            : clsx(
                                "bg-white text-fg border-card-04 hover:border-black/40 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]",
                                groupLimitReached &&
                                  "opacity-40 cursor-not-allowed hover:shadow-none hover:border-card-04"
                              )
                        )}
                        disabled={groupLimitReached}
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
      ))}
    </div>
  );
}

