import { Github, Coffee, Users } from "lucide-react";
import { XIcon } from "@/components/ui/x-icon";
import { useLanguage } from "@/contexts/language-context";

export function AboutSection() {
  const { t } = useLanguage();
  return (
    <section id="about" className="py-12 sm:py-16">
      <div className="card-panel p-8 sm:p-12 text-center max-w-2xl mx-auto">
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <Coffee className="w-6 h-6 text-accent" strokeWidth={1.5} />
          <Users className="w-5 h-5 text-fg-muted" strokeWidth={1.5} />
        </div>
        
        <h2 className="font-display text-3xl font-semibold text-fg mb-6 tracking-tight">
          {t.about.title}
        </h2>
        
        <p className="text-lg text-fg/85 mb-6 leading-relaxed max-w-xl mx-auto font-body">
          <span className="font-semibold text-accent">Cafe Cursor</span> {t.about.description1}
        </p>

        <p className="text-base text-fg-muted mb-8 leading-relaxed max-w-lg mx-auto font-body">
          {t.about.description2}
        </p>
        
        <div className="grid grid-cols-3 gap-4 border-t border-b border-border/50 py-6 mb-8">
            <div className="text-center">
                <div className="text-2xl font-display font-medium text-fg">5+</div>
                <div className="text-[10px] uppercase tracking-widest text-fg-muted font-mono mt-1">{t.about.stats.cities}</div>
            </div>
            <div className="text-center border-l border-border/50">
                <div className="text-2xl font-display font-medium text-fg">120+</div>
                <div className="text-[10px] uppercase tracking-widest text-fg-muted font-mono mt-1">{t.about.stats.attendees}</div>
            </div>
            <div className="text-center border-l border-border/50">
                <div className="text-2xl font-display font-medium text-fg">∞</div>
                <div className="text-[10px] uppercase tracking-widest text-fg-muted font-mono mt-1">{t.about.stats.vibes}</div>
            </div>
        </div>
        
        <p className="text-sm text-fg-muted mb-10 font-body">
          {t.about.madeBy} <a href="https://x.com/wmoralesdev" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">@wmoralesdev</a>
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://x.com/wmoralesdev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-6 py-3 bg-fg text-card rounded-sm font-medium text-sm hover:bg-fg/90 transition-all duration-200 w-full sm:w-auto justify-center shadow-sm hover:shadow-md font-body"
          >
            <XIcon className="w-4 h-4" />
            <span>@wmoralesdev</span>
          </a>
          <a
            href="https://github.com/wmoralesdev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-6 py-3 bg-transparent text-fg border border-border rounded-sm font-medium text-sm hover:border-border-strong hover:bg-card-02 transition-all duration-200 w-full sm:w-auto justify-center font-body"
          >
            <Github className="w-4 h-4" strokeWidth={1.5} />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
}
