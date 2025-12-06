import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import type { CursorProfile, PolaroidTheme } from "@/types/form";
import { polaroidThemes } from "@/constants/polaroid-themes";
import { CursorProfileRow } from "./polaroid-profile-row";
import { useLanguage } from "@/contexts/language-context";
import cursorLogo from "@/assets/cursor.svg";

interface PolaroidCaptionProps {
  profile: CursorProfile;
  source?: string | null;
}

interface EventStampProps {
  rotation?: number;
  generatedAt?: string;
  locale: typeof es | typeof enUS;
  theme?: PolaroidTheme;
}

function formatShortDate(dateString: string | undefined, locale: typeof es | typeof enUS): string {
  if (!dateString) return "";
  return format(new Date(dateString), "MMM d, yyyy", { locale });
}

// ═══════════════════════════════════════════════════════════════
// CLASSIC STAMP - Modern, clean, Cursor-branded
// ═══════════════════════════════════════════════════════════════
function ClassicStamp({ rotation, generatedAt, locale }: Omit<EventStampProps, 'theme'>) {
  const config = polaroidThemes.classic;
  return (
    <div className="relative flex items-center justify-center opacity-70">
      <div 
        className="relative w-20 h-20 rounded-full border-2 flex items-center justify-center"
        style={{ 
          transform: `rotate(${rotation}deg)`,
          borderColor: config.stampBorder,
        }}
      >
        <div 
          className="absolute inset-2 rounded-full border border-dashed"
          style={{ borderColor: config.stampInnerBorder }}
        />
        
        <div 
          className="flex flex-col items-center justify-center gap-0.5"
          style={{ color: config.stampText }}
        >
          <span className="text-[9px] font-bold uppercase tracking-wide">Cafe Cursor</span>
          <img 
            src={cursorLogo}
            alt="Cursor" 
            className="h-5 w-5 object-contain"
          />
          <span className="text-[8px] font-medium uppercase tracking-wider">SV · 2025</span>
        </div>
        
        <div 
          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[6px] font-mono font-bold uppercase tracking-wider"
          style={{ color: `${config.stampText}99` }}
        >
          {generatedAt ? formatShortDate(generatedAt, locale) : "3rd Ed."}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MINIMAL STAMP - Clean geometric square
// ═══════════════════════════════════════════════════════════════
function MinimalStamp({ rotation, generatedAt, locale }: Omit<EventStampProps, 'theme'>) {
  const config = polaroidThemes.minimal;
  return (
    <div className="relative flex items-center justify-center opacity-60">
      <div 
        className="relative w-18 h-18 flex items-center justify-center"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div 
          className="absolute inset-0 w-16 h-16 border"
          style={{ borderColor: config.stampBorder }}
        />
        <div 
          className="absolute inset-1 w-14 h-14 border"
          style={{ borderColor: config.stampInnerBorder }}
        />
        
        <div 
          className="flex flex-col items-center justify-center gap-0.5"
          style={{ color: config.stampText, fontFamily: config.displayFont }}
        >
          <img 
            src={cursorLogo}
            alt="Cursor" 
            className="h-5 w-5 object-contain opacity-60"
            style={{ filter: 'grayscale(100%)' }}
          />
          <span className="text-[7px] font-medium uppercase tracking-widest">2025</span>
        </div>
        
        <div 
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[5px] uppercase tracking-wider"
          style={{ color: config.textMuted, fontFamily: config.monoFont }}
        >
          {generatedAt ? formatShortDate(generatedAt, locale) : ""}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COFFEE STAMP - Hand-drawn craft coffee shop style
// ═══════════════════════════════════════════════════════════════
function CoffeeStamp({ rotation, generatedAt, locale }: Omit<EventStampProps, 'theme'>) {
  const config = polaroidThemes.coffee;
  return (
    <div className="relative flex items-center justify-center opacity-70">
      <div 
        className="relative w-20 h-20 rounded-full border-2 flex items-center justify-center"
        style={{ 
          transform: `rotate(${rotation}deg)`,
          borderColor: config.stampBorder,
          borderStyle: "dashed",
        }}
      >
        {/* Coffee ring stain effect */}
        <div 
          className="absolute -inset-0.5 rounded-full opacity-20"
          style={{ 
            background: `radial-gradient(circle, transparent 60%, ${config.accent}30 70%, transparent 75%)`,
          }}
        />
        
        <div 
          className="flex flex-col items-center justify-center gap-0.5"
          style={{ color: config.stampText }}
        >
          <span 
            className="text-[10px] font-medium tracking-wide"
            style={{ fontFamily: config.displayFont }}
          >
            ☕ Cafe Cursor
          </span>
          <img 
            src={cursorLogo}
            alt="Cursor" 
            className="h-4 w-4 object-contain"
            style={{ filter: 'sepia(30%)' }}
          />
          <span 
            className="text-[8px] tracking-wide"
            style={{ fontFamily: config.displayFont }}
          >
            est. 2025
          </span>
        </div>
        
        <div 
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[6px] uppercase tracking-wider"
          style={{ color: config.textMuted, fontFamily: config.monoFont }}
        >
          {generatedAt ? formatShortDate(generatedAt, locale) : ""}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ZEN STAMP - Japanese garden, moss green, nature-inspired
// ═══════════════════════════════════════════════════════════════
function ZenStamp({ rotation, generatedAt, locale }: Omit<EventStampProps, 'theme'>) {
  const config = polaroidThemes.zen;
  return (
    <div className="relative flex items-center justify-center opacity-75">
      <div 
        className="relative w-20 h-20 rounded-full flex items-center justify-center"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Outer circle - like an enso */}
        <div 
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: config.stampBorder }}
        />
        
        {/* Inner decorative ring */}
        <div 
          className="absolute inset-2 rounded-full border border-dashed"
          style={{ borderColor: config.stampInnerBorder }}
        />
        
        {/* Bamboo/leaf accent marks */}
        <div 
          className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px]"
          style={{ color: config.stampText }}
        >
          ⸙
        </div>
        <div 
          className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] rotate-180"
          style={{ color: config.stampText }}
        >
          ⸙
        </div>
        
        <div 
          className="flex flex-col items-center justify-center gap-0.5"
          style={{ color: config.stampText }}
        >
          <span 
            className="text-[8px] font-medium tracking-widest"
            style={{ fontFamily: config.displayFont }}
          >
            庭園
          </span>
          <img 
            src={cursorLogo}
            alt="Cursor" 
            className="h-4 w-4 object-contain opacity-80"
            style={{ filter: 'hue-rotate(80deg) saturate(0.6)' }}
          />
          <span 
            className="text-[7px] font-medium tracking-[0.15em]"
            style={{ fontFamily: config.bodyFont }}
          >
            CURSOR
          </span>
        </div>
        
        <div 
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[5px] uppercase tracking-wider"
          style={{ color: config.textMuted, fontFamily: config.monoFont }}
        >
          {generatedAt ? formatShortDate(generatedAt, locale) : "二〇二五"}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TOKYO STAMP - Cyberpunk nightlife, neon glow, futuristic
// ═══════════════════════════════════════════════════════════════
function TokyoStamp({ rotation, generatedAt, locale }: Omit<EventStampProps, 'theme'>) {
  const config = polaroidThemes.tokyo;
  return (
    <div className="relative flex items-center justify-center opacity-80">
      <div 
        className="relative w-20 h-20 rounded-full flex items-center justify-center"
        style={{ 
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {/* Outer neon ring with glow */}
        <div 
          className="absolute inset-0 rounded-full border-2"
          style={{ 
            borderColor: config.stampBorder,
            boxShadow: `0 0 8px ${config.accent}60, inset 0 0 8px ${config.accent}20`,
          }}
        />
        
        {/* Inner cyan accent ring */}
        <div 
          className="absolute inset-2 rounded-full border"
          style={{ 
            borderColor: config.stampInnerBorder,
            boxShadow: `0 0 4px ${config.stampInnerBorder}`,
          }}
        />
        
        {/* Glowing corner accents */}
        <div 
          className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full"
          style={{ 
            backgroundColor: "#00D9FF",
            boxShadow: "0 0 6px #00D9FF",
          }}
        />
        <div 
          className="absolute bottom-2 left-1 w-1 h-1 rounded-full"
          style={{ 
            backgroundColor: config.accent,
            boxShadow: `0 0 4px ${config.accent}`,
          }}
        />
        
        <div 
          className="flex flex-col items-center justify-center gap-0.5"
          style={{ color: config.stampText }}
        >
          <span 
            className="text-[7px] font-bold uppercase tracking-[0.2em]"
            style={{ fontFamily: config.displayFont }}
          >
            東京
          </span>
          <img 
            src={cursorLogo}
            alt="Cursor" 
            className="h-4 w-4 object-contain"
            style={{ filter: 'hue-rotate(310deg) saturate(1.5) brightness(1.1)' }}
          />
          <span 
            className="text-[7px] font-bold uppercase tracking-widest"
            style={{ 
              fontFamily: config.displayFont,
              background: `linear-gradient(90deg, ${config.accent}, #00D9FF)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            CURSOR
          </span>
        </div>
        
        <div 
          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[5px] font-bold uppercase tracking-widest"
          style={{ 
            color: "#00D9FF",
            fontFamily: config.monoFont,
            textShadow: "0 0 4px #00D9FF",
          }}
        >
          {generatedAt ? formatShortDate(generatedAt, locale) : "2025"}
        </div>
      </div>
    </div>
  );
}

function EventStamp({ rotation = -12, generatedAt, locale, theme = "classic" }: EventStampProps) {
  switch (theme) {
    case "minimal":
      return <MinimalStamp rotation={rotation} generatedAt={generatedAt} locale={locale} />;
    case "coffee":
      return <CoffeeStamp rotation={rotation} generatedAt={generatedAt} locale={locale} />;
    case "zen":
      return <ZenStamp rotation={rotation} generatedAt={generatedAt} locale={locale} />;
    case "tokyo":
      return <TokyoStamp rotation={rotation} generatedAt={generatedAt} locale={locale} />;
    case "classic":
    default:
      return <ClassicStamp rotation={rotation} generatedAt={generatedAt} locale={locale} />;
  }
}

export function PolaroidCaption({ profile, source }: PolaroidCaptionProps) {
  const { lang } = useLanguage();
  const locale = lang === "es" ? es : enUS;
  const stampRotation = profile.stampRotation ?? -12;
  const theme = profile.polaroidTheme ?? "classic";

  return (
    <div className="pt-3 px-1 relative flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="flex-1 overflow-hidden pr-20">
        <CursorProfileRow profile={profile} source={source} />
      </div>
      
      <div className="absolute bottom-0 right-0">
        <EventStamp rotation={stampRotation} generatedAt={profile.generatedAt} locale={locale} theme={theme} />
      </div>
    </div>
  );
}
