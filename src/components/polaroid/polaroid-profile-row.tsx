import { Github, Instagram, AtSign } from "lucide-react";
import { XIcon } from "@/components/ui/x-icon";
import type { Profile } from "@/types/form";
import { TECH_STACKS, type TechGroup } from "@/constants/tech-stack";

interface PolaroidProfileRowProps {
  profile: Profile;
}

const getTechGroup = (tech: string): TechGroup | undefined => {
  for (const [group, stack] of Object.entries(TECH_STACKS)) {
    if (stack.includes(tech)) return group as TechGroup;
  }
  return undefined;
};

const getGroupColor = (group?: TechGroup) => {
  switch (group) {
    case "Frontend": return "bg-blue-600";
    case "Backend": return "bg-green-600";
    case "Mobile": return "bg-purple-600";
    case "Data/Infra": return "bg-orange-600";
    case "Tooling": return "bg-gray-600";
    default: return "bg-gray-500";
  }
};

export function PolaroidProfileRow({ profile }: PolaroidProfileRowProps) {
  if (!profile.handle && profile.techStack.length === 0) return null;

  const techs = profile.techStack;
  const techCount = techs.length;

  // Scale chip size down when there are many items so everything stays visible
  const chipBaseClasses =
    techCount > 10
      ? "px-1.5 py-0.5 text-[7px]"
      : techCount > 6
      ? "px-1.5 py-0.5 text-[8px]"
      : "px-2 py-0.5 text-[9px]";

  return (
    <div className="flex flex-col gap-3 border-b border-black/10 last:border-0 pb-4 last:pb-0 mb-4 last:mb-0">
      <div className="flex items-center gap-2.5 text-fg">
        <div className="p-1 rounded bg-black text-white">
            {profile.platform === "github" && (
              <Github className="w-3.5 h-3.5" />
            )}
            {profile.platform === "x" && <XIcon className="w-3.5 h-3.5" />}
            {profile.platform === "instagram" && (
              <Instagram className="w-3.5 h-3.5" />
            )}
            {!profile.platform && <AtSign className="w-3.5 h-3.5" />}
        </div>
        <span className="font-mono text-[15px] font-bold tracking-tight text-black">
          @{profile.handle || "username"}
        </span>
      </div>
      
      {techs.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {techs.map((tech) => {
            const group = getTechGroup(tech);
            return (
              <span
                key={tech}
                className={`inline-flex items-center gap-1.5 rounded font-extrabold bg-white text-black border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider ${chipBaseClasses}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${getGroupColor(group)} ring-1 ring-black/10`} />
                {tech}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

// New component for Merged view
export function MergedProfileRow({ profiles }: { profiles: Profile[] }) {
    // Filter valid profiles with handles
    const validProfiles = profiles.filter(p => p.handle);
    
    // Merge and deduplicate tech stacks
    const allTechs = Array.from(new Set(profiles.flatMap(p => p.techStack)));
    const techCount = allTechs.length;

    const chipBaseClasses =
      techCount > 12
        ? "px-1.5 py-0.5 text-[7px]"
        : techCount > 8
        ? "px-1.5 py-0.5 text-[8px]"
        : "px-2 py-0.5 text-[9px]";
  
    return (
      <div className="flex flex-col gap-4">
        {/* Merged Handles Row */}
        {validProfiles.length > 0 && (
             <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-fg">
                {validProfiles.map((profile, idx) => (
                  <div
                    key={`${profile.platform}-${profile.handle}-${idx}`}
                    className="flex items-center gap-1.5"
                  >
                    <div className="p-1 rounded bg-black text-white">
                      {profile.platform === "github" && (
                        <Github className="w-3 h-3" />
                      )}
                      {profile.platform === "x" && (
                        <XIcon className="w-3 h-3" />
                      )}
                      {profile.platform === "instagram" && (
                        <Instagram className="w-3 h-3" />
                      )}
                      {!profile.platform && <AtSign className="w-3 h-3" />}
                    </div>
                    <span className="font-mono text-[14px] font-bold tracking-tight text-black">
                      @{profile.handle}
                    </span>
                    {idx < validProfiles.length - 1 && (
                      <span className="text-black/30 font-black ml-1">&</span>
                    )}
                  </div>
                ))}
             </div>
        )}
  
        {/* Merged Tech Stack */}
        {techCount > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {allTechs.map((tech) => {
              const group = getTechGroup(tech);
              return (
                <span
                  key={tech}
                  className={`inline-flex items-center gap-1.5 rounded font-extrabold bg-white text-black border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider ${chipBaseClasses}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${getGroupColor(group)} ring-1 ring-black/10`} />
                  {tech}
                </span>
              );
            })}
          </div>
        )}
      </div>
    );
  }
