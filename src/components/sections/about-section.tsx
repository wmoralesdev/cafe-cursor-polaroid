import { Github } from "lucide-react";
import { XIcon } from "@/components/ui/x-icon";

export function AboutSection() {
  return (
    <section id="about" className="py-12 sm:py-16">
      <div className="warm-panel p-8 sm:p-12 text-center max-w-2xl mx-auto">
        
        <h2 className="font-display text-3xl font-semibold text-fg mb-6 tracking-tight">
          About the Maker
        </h2>
        
        <p className="text-lg text-fg/85 mb-10 leading-relaxed max-w-xl mx-auto font-body">
          Hi, I'm <span className="font-semibold text-gold">Walter Morales</span>. 
          I build tools and experiences for developers. This polaroid generator is a fun way to share your dev stack with the world.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://x.com/wmoralesdev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-6 py-3 bg-fg text-cream rounded-sm font-medium text-sm hover:bg-fg/90 transition-all duration-200 w-full sm:w-auto justify-center shadow-sm hover:shadow-md font-body"
          >
            <XIcon className="w-4 h-4" />
            <span>@wmoralesdev</span>
          </a>
          <a
            href="https://github.com/wmoralesdev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-6 py-3 bg-transparent text-fg border border-border rounded-sm font-medium text-sm hover:border-border-strong hover:bg-parchment transition-all duration-200 w-full sm:w-auto justify-center font-body"
          >
            <Github className="w-4 h-4" strokeWidth={1.5} />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
}
