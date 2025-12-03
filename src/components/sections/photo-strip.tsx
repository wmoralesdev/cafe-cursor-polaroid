import crowdImg from "@/assets/photos/crowd.png";
import chalkboardImg from "@/assets/photos/chalkboard.png";
import storefrontImg from "@/assets/photos/storefront.png";
import { useLanguage } from "@/contexts/language-context";

export function PhotoStrip() {
  const { t } = useLanguage();
  
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 overflow-hidden">
      <div className="mb-8">
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-fg mb-2">
          {t.showcase.title}
        </h2>
        <p className="text-fg-muted font-body text-sm md:text-base">
          {t.showcase.subtitle}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[300px] md:h-[240px]">
        <div className="md:col-span-3 relative group overflow-hidden rounded-sm card-panel shadow-sm">
            <div className="absolute inset-0 bg-accent/10 mix-blend-multiply z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-fg/20 to-transparent z-10 pointer-events-none" />
            <img 
                src={chalkboardImg} 
                alt="Cafe Cursor chalkboard" 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 sepia-[0.15]"
            />
        </div>

        <div className="md:col-span-6 relative group overflow-hidden rounded-sm card-panel shadow-md -rotate-1 z-10 transform-gpu">
            <div className="absolute inset-0 bg-accent/5 mix-blend-multiply z-10 pointer-events-none" />
             <div className="absolute inset-0 bg-gradient-to-t from-fg/30 to-transparent z-10 pointer-events-none" />
            <img 
                src={crowdImg} 
                alt="Developers coworking" 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 sepia-[0.1]"
            />
            <div className="absolute bottom-4 left-4 right-4 z-20">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-card/90 text-fg backdrop-blur-sm shadow-sm font-mono tracking-wide">
                    vibecoding_session.jpg
                </span>
            </div>
        </div>

        <div className="md:col-span-3 relative group overflow-hidden rounded-sm card-panel shadow-sm">
            <div className="absolute inset-0 bg-accent/10 mix-blend-multiply z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-fg/20 to-transparent z-10 pointer-events-none" />
            <img 
                src={storefrontImg} 
                alt="Cafe storefront" 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 sepia-[0.15]"
            />
        </div>
      </div>
    </section>
  );
}

