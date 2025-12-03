import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import type { CursorProfile } from "@/types/form";
import { CursorProfileRow } from "./polaroid-profile-row";
import { useLanguage } from "@/contexts/language-context";
import cursorLogo from "@/assets/cursor.svg";

interface PolaroidCaptionProps {
  profile: CursorProfile;
}

interface EventStampProps {
  rotation?: number;
  generatedAt?: string;
  locale: typeof es | typeof enUS;
}

function formatShortDate(dateString: string | undefined, locale: typeof es | typeof enUS): string {
  if (!dateString) return "";
  return format(new Date(dateString), "MMM d, yyyy", { locale });
}

function EventStamp({ rotation = -12, generatedAt, locale }: EventStampProps) {
  return (
    <div className="relative flex items-center justify-center opacity-40">
      <div 
        className="relative w-20 h-20 rounded-full border-2 border-accent/70 flex items-center justify-center"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div className="absolute inset-2 rounded-full border border-accent/50 border-dashed" />
        
        <div className="flex flex-col items-center justify-center text-accent gap-0.5">
          <span className="text-[9px] font-bold uppercase tracking-wide">Cafe Cursor</span>
          <img 
            src={cursorLogo}
            alt="Cursor" 
            className="h-5 w-5 object-contain"
          />
          <span className="text-[8px] font-medium uppercase tracking-wider">SV · 2025</span>
        </div>
        
        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[6px] font-mono font-bold text-accent/60 uppercase tracking-wider">
          {generatedAt ? formatShortDate(generatedAt, locale) : "3rd Ed."}
        </div>
      </div>
    </div>
  );
}

export function PolaroidCaption({ profile }: PolaroidCaptionProps) {
  const { lang } = useLanguage();
  const locale = lang === "es" ? es : enUS;
  const stampRotation = profile.stampRotation ?? -12;

  return (
    <div className="pt-3 px-1 relative flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="flex-1 overflow-hidden pr-20">
        <CursorProfileRow profile={profile} />
      </div>
      
      <div className="absolute bottom-0 right-0">
        <EventStamp rotation={stampRotation} generatedAt={profile.generatedAt} locale={locale} />
      </div>
    </div>
  );
}
