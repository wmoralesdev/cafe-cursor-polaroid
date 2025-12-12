import { Github, Users, Linkedin } from "lucide-react";
import { XIcon } from "@/components/ui/x-icon";
import { CursorIcon } from "@/components/ui/cursor-icon";
import { useLanguage } from "@/contexts/language-context";
import { SectionHeader } from "@/components/ui/section-header";

export function AboutSection() {
  const { t } = useLanguage();
  return (
    <section id="about" className="py-12 sm:py-16 border-t border-border/50">
      <div className="text-center max-w-2xl mx-auto px-4">
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <CursorIcon className="w-6 h-6" />
          <Users className="w-5 h-5 text-fg-muted" strokeWidth={1.5} />
        </div>
        
        <SectionHeader title={t.about.title} className="mx-auto mb-6" titleClassName="text-3xl md:text-4xl" />
        
        <p className="text-lg text-fg/85 mb-6 leading-relaxed max-w-xl mx-auto font-body">
          <span className="font-semibold text-accent">Cafe Cursor</span> {t.about.description1}
        </p>

        <p className="text-base text-fg-muted mb-8 leading-relaxed max-w-lg mx-auto font-body">
          {t.about.description2}
        </p>
        
        <div className="grid grid-cols-3 gap-4 border-t border-b border-border/50 py-6 mb-8">
            <div className="text-center">
                <div className="text-2xl font-display font-medium text-fg">20+</div>
                <div className="text-xs uppercase tracking-widest text-fg-muted font-mono mt-1">{t.about.stats.cities}</div>
            </div>
            <div className="text-center border-l border-border/50">
                <div className="text-2xl font-display font-medium text-fg">1K+</div>
                <div className="text-xs uppercase tracking-widest text-fg-muted font-mono mt-1">{t.about.stats.attendees}</div>
            </div>
            <div className="text-center border-l border-border/50">
                <div className="text-2xl font-display font-medium text-fg">∞</div>
                <div className="text-xs uppercase tracking-widest text-fg-muted font-mono mt-1">{t.about.stats.vibes}</div>
            </div>
        </div>
        
        <div className="flex items-center justify-center gap-3 mb-10 p-4 bg-card-02/50 rounded-sm border border-border/30">
          <img 
            src="/avatar.webp" 
            alt="Walter" 
            className="w-10 h-10 rounded-full object-cover ring-2 ring-accent/20"
          />
          <div className="text-left">
            <p className="text-sm font-medium text-fg font-body">
              {t.about.madeBy}
            </p>
            <a 
              href="https://x.com/wmoralesdev" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs text-accent hover:underline font-mono"
            >
              @wmoralesdev
            </a>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://x.com/wmoralesdev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-5 py-2.5 bg-fg text-card rounded-sm font-medium text-sm hover:bg-fg/90 transition-all duration-200 w-full sm:w-auto justify-center shadow-sm hover:shadow-md font-body"
          >
            <XIcon className="w-4 h-4" />
            <span>@wmoralesdev</span>
          </a>
          <a
            href="https://github.com/wmoralesdev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-5 py-2.5 bg-transparent text-fg border border-border rounded-sm font-medium text-sm hover:border-border-strong hover:bg-card-02 transition-all duration-200 w-full sm:w-auto justify-center font-body"
          >
            <Github className="w-4 h-4" strokeWidth={1.5} />
            <span>GitHub</span>
          </a>
          <a
            href="https://linkedin.com/in/wmoralesdev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-5 py-2.5 bg-transparent text-fg border border-border rounded-sm font-medium text-sm hover:border-border-strong hover:bg-card-02 transition-all duration-200 w-full sm:w-auto justify-center font-body"
          >
            <Linkedin className="w-4 h-4" strokeWidth={1.5} />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </section>
  );
}
