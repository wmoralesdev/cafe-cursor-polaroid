import type { Profile } from "@/types/form";
import { PolaroidProfileRow, MergedProfileRow } from "./polaroid-profile-row";
import cursorLogo from "@/assets/cursor.svg";

interface PolaroidCaptionProps {
  profiles: Profile[];
}

export function PolaroidCaption({ profiles }: PolaroidCaptionProps) {
  const hasMultipleProfiles = profiles.length > 1;

  return (
    <div className="pt-6 px-1 relative min-h-[100px] flex flex-col justify-between">
      <div className="space-y-2 pr-8">
        {hasMultipleProfiles ? (
           <MergedProfileRow profiles={profiles} />
        ) : (
            profiles.map((profile, index) => (
              <PolaroidProfileRow key={`${profile.platform}-${index}`} profile={profile} />
            ))
        )}
      </div>
      
      {/* Cursor Sticker - Stamp Style */}
      <div className="absolute bottom-3 right-3 transform -rotate-6 opacity-90 hover:opacity-100 hover:rotate-0 transition-all duration-300">
        <img 
          src={cursorLogo}
          alt="Cursor" 
          className="h-8 w-8 object-contain drop-shadow-md"
        />
      </div>
    </div>
  );
}
