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
    <div className="relative flex items-center justify-center opacity-55">
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
          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[7px] font-mono font-bold uppercase tracking-wider"
          style={{ color: `${config.stampText}` }}
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
    <div className="relative flex items-center justify-center opacity-50">
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
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[7px] uppercase tracking-wider"
          style={{ color: config.textMuted, fontFamily: config.monoFont }}
        >
          {generatedAt ? formatShortDate(generatedAt, locale) : ""}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// WEB STAMP - Internet/browser aesthetic, hyperlink blue
// ═══════════════════════════════════════════════════════════════
function WebStamp({ rotation, generatedAt, locale }: Omit<EventStampProps, 'theme'>) {
  const config = polaroidThemes.web;
  return (
    <div className="relative flex items-center justify-center opacity-55">
      <div 
        className="relative w-20 h-20 flex items-center justify-center"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Browser window frame */}
        <div 
          className="absolute inset-0 rounded-sm border-2"
          style={{ borderColor: config.stampBorder }}
        />
        
        {/* URL bar */}
        <div 
          className="absolute top-2 left-2 right-2 h-2 rounded-sm border"
          style={{ borderColor: config.stampInnerBorder }}
        />
        
        <div 
          className="flex flex-col items-center justify-center gap-0.5 mt-2"
          style={{ color: config.stampText }}
        >
          <span 
            className="text-[7px] font-bold tracking-wide"
            style={{ fontFamily: config.monoFont }}
          >
            {"</>"}
          </span>
          <img 
            src={cursorLogo}
            alt="Cursor" 
            className="h-4 w-4 object-contain"
            style={{ filter: 'brightness(0) saturate(100%) invert(28%) sepia(98%) saturate(1640%) hue-rotate(199deg) brightness(97%) contrast(102%)' }}
          />
          <span 
            className="text-[7px] font-bold uppercase tracking-widest"
            style={{ fontFamily: config.bodyFont }}
          >
            CURSOR
          </span>
        </div>
        
        <div 
          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[7px] uppercase tracking-wider"
          style={{ color: config.textMuted, fontFamily: config.monoFont }}
        >
          {generatedAt ? formatShortDate(generatedAt, locale) : "2025"}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SAKURA STAMP - Cherry blossom, soft pink, Japanese spring
// ═══════════════════════════════════════════════════════════════
function SakuraStamp({ rotation, generatedAt, locale }: Omit<EventStampProps, 'theme'>) {
  const config = polaroidThemes.sakura;
  return (
    <div className="relative flex items-center justify-center opacity-55">
      <div 
        className="relative w-20 h-20 rounded-full flex items-center justify-center"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Outer petal-like border */}
        <div 
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: config.stampBorder }}
        />
        
        {/* Inner decorative ring */}
        <div 
          className="absolute inset-2 rounded-full border border-dashed"
          style={{ borderColor: config.stampInnerBorder }}
        />
        
        {/* Petal decorations */}
        <div 
          className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[10px]"
          style={{ color: config.stampText }}
        >
          ✿
        </div>
        <div 
          className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[10px]"
          style={{ color: config.stampText }}
        >
          ✿
        </div>
        
        <div 
          className="flex flex-col items-center justify-center gap-0.5"
          style={{ color: config.stampText }}
        >
          <span 
            className="text-[8px] font-medium tracking-widest"
            style={{ fontFamily: config.displayFont }}
          >
            桜
          </span>
          <img 
            src={cursorLogo}
            alt="Cursor" 
            className="h-4 w-4 object-contain"
            style={{ filter: 'brightness(0) saturate(100%) invert(24%) sepia(96%) saturate(4127%) hue-rotate(316deg) brightness(94%) contrast(93%)' }}
          />
          <span 
            className="text-[7px] font-medium tracking-[0.15em]"
            style={{ fontFamily: config.bodyFont }}
          >
            CURSOR
          </span>
        </div>
        
        <div 
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[7px] uppercase tracking-wider"
          style={{ color: config.textMuted, fontFamily: config.monoFont }}
        >
          {generatedAt ? formatShortDate(generatedAt, locale) : "春 2025"}
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
    <div className="relative flex items-center justify-center opacity-60">
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
          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[7px] font-bold uppercase tracking-widest"
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

// ═══════════════════════════════════════════════════════════════
// CYBERPUNK STAMP - Blade Runner / CP2077 style, yellow neon
// ═══════════════════════════════════════════════════════════════
function CyberpunkStamp({ rotation, generatedAt, locale }: Omit<EventStampProps, 'theme'>) {
  const config = polaroidThemes.cyberpunk;
  return (
    <div className="relative flex items-center justify-center opacity-60">
      <div 
        className="relative w-20 h-20 flex items-center justify-center"
        style={{ 
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {/* Outer glitchy border with yellow */}
        <div 
          className="absolute inset-0 border-2"
          style={{ 
            borderColor: config.stampBorder,
            clipPath: "polygon(0 10%, 10% 0, 90% 0, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0 90%)",
            boxShadow: `0 0 8px ${config.accent}40`,
          }}
        />
        
        {/* Inner cyan accent border */}
        <div 
          className="absolute inset-2 border"
          style={{ 
            borderColor: config.stampInnerBorder,
            boxShadow: `inset 0 0 6px ${config.stampInnerBorder}`,
          }}
        />
        
        {/* Corner accents - cyan */}
        <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2" style={{ borderColor: "#00D9FF" }} />
        <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2" style={{ borderColor: "#00D9FF" }} />
        <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2" style={{ borderColor: config.stampText }} />
        <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2" style={{ borderColor: config.stampText }} />
        
        <div 
          className="flex flex-col items-center justify-center gap-0.5"
          style={{ color: config.stampText }}
        >
          <span 
            className="text-[7px] font-bold uppercase tracking-[0.15em]"
            style={{ fontFamily: config.displayFont, color: "#00D9FF" }}
          >
            NIGHT CITY
          </span>
          <img 
            src={cursorLogo}
            alt="Cursor" 
            className="h-4 w-4 object-contain"
            style={{ filter: 'brightness(0) saturate(100%) invert(89%) sepia(61%) saturate(1000%) hue-rotate(358deg) brightness(103%) contrast(106%)' }}
          />
          <span 
            className="text-[7px] font-bold uppercase tracking-widest"
            style={{ fontFamily: config.displayFont }}
          >
            CURSOR
          </span>
        </div>
        
        <div 
          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[7px] font-bold uppercase tracking-widest"
          style={{ 
            color: "#00D9FF",
            fontFamily: config.monoFont,
          }}
        >
          {generatedAt ? formatShortDate(generatedAt, locale) : "2077"}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MATRIX STAMP - Digital rain, green on black, hacker aesthetic
// ═══════════════════════════════════════════════════════════════
function MatrixStamp({ rotation, generatedAt, locale }: Omit<EventStampProps, 'theme'>) {
  const config = polaroidThemes.matrix;
  return (
    <div className="relative flex items-center justify-center opacity-60">
      <div 
        className="relative w-20 h-20 flex items-center justify-center"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Digital frame */}
        <div 
          className="absolute inset-0 border-2"
          style={{ 
            borderColor: config.stampBorder,
            background: `linear-gradient(180deg, ${config.accent}10 0%, transparent 50%, ${config.accent}10 100%)`,
          }}
        />
        
        {/* Matrix rain effect lines */}
        <div className="absolute inset-1 overflow-hidden opacity-30">
          <div className="absolute left-1 top-0 w-0.5 h-full" style={{ background: `linear-gradient(180deg, ${config.accent}, transparent)` }} />
          <div className="absolute left-3 top-2 w-0.5 h-full" style={{ background: `linear-gradient(180deg, ${config.accent}, transparent)` }} />
          <div className="absolute right-3 top-1 w-0.5 h-full" style={{ background: `linear-gradient(180deg, ${config.accent}, transparent)` }} />
          <div className="absolute right-1 top-3 w-0.5 h-full" style={{ background: `linear-gradient(180deg, ${config.accent}, transparent)` }} />
        </div>
        
        <div 
          className="flex flex-col items-center justify-center gap-0.5 z-10"
          style={{ color: config.stampText }}
        >
          <span 
            className="text-[7px] font-bold tracking-[0.2em]"
            style={{ fontFamily: config.monoFont }}
          >
            WAKE UP
          </span>
          <img 
            src={cursorLogo}
            alt="Cursor" 
            className="h-4 w-4 object-contain"
            style={{ filter: 'brightness(0) saturate(100%) invert(67%) sepia(89%) saturate(1647%) hue-rotate(84deg) brightness(113%) contrast(108%)' }}
          />
          <span 
            className="text-[6px] font-bold uppercase tracking-widest"
            style={{ fontFamily: config.monoFont }}
          >
            CURSOR
          </span>
        </div>
        
        <div 
          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[7px] font-bold uppercase tracking-widest"
          style={{ 
            color: config.stampText,
            fontFamily: config.monoFont,
          }}
        >
          {generatedAt ? formatShortDate(generatedAt, locale) : "1999"}
        </div>
      </div>
    </div>
  );
}

function EventStamp({ rotation = -12, generatedAt, locale, theme = "classic" }: EventStampProps) {
  switch (theme) {
    case "minimal":
      return <MinimalStamp rotation={rotation} generatedAt={generatedAt} locale={locale} />;
    case "web":
      return <WebStamp rotation={rotation} generatedAt={generatedAt} locale={locale} />;
    case "sakura":
      return <SakuraStamp rotation={rotation} generatedAt={generatedAt} locale={locale} />;
    case "tokyo":
      return <TokyoStamp rotation={rotation} generatedAt={generatedAt} locale={locale} />;
    case "cyberpunk":
      return <CyberpunkStamp rotation={rotation} generatedAt={generatedAt} locale={locale} />;
    case "matrix":
      return <MatrixStamp rotation={rotation} generatedAt={generatedAt} locale={locale} />;
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
    <div className="pt-2 px-1 relative flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="flex-1 overflow-hidden pr-16">
        <CursorProfileRow profile={profile} source={source} />
      </div>
      
      <div className="absolute bottom-6 right-0 scale-[0.88] origin-bottom-right">
        <EventStamp rotation={stampRotation} generatedAt={profile.generatedAt} locale={locale} theme={theme} />
      </div>
    </div>
  );
}
