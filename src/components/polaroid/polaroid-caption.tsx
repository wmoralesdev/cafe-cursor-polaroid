import type { CursorProfile } from "@/types/form";
import { CursorProfileRow, MergedCursorRow } from "./polaroid-profile-row";
import cursorLogo from "@/assets/cursor.svg";

interface PolaroidCaptionProps {
  profiles: CursorProfile[];
}

export function PolaroidCaption({ profiles }: PolaroidCaptionProps) {
  const hasMultipleProfiles = profiles.length > 1;

  return (
    <div className="pt-5 px-1 relative min-h-[100px] flex flex-col justify-between">
      <div className="space-y-2 pr-8">
        {hasMultipleProfiles ? (
           <MergedCursorRow profiles={profiles} />
        ) : (
            profiles.map((profile, index) => (
              <CursorProfileRow key={index} profile={profile} />
            ))
        )}
      </div>
      
      {/* Cafe Cursor Badge */}
      <div className="absolute bottom-0 right-0 flex items-center gap-2 opacity-90">
        <span className="font-display text-[10px] font-bold uppercase tracking-widest text-fg-muted mt-0.5">
          Cafe Cursor
        </span>
        <img 
          src={cursorLogo}
          alt="Cursor" 
          className="h-5 w-5 object-contain"
        />
      </div>
    </div>
  );
}
