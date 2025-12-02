import { communityPolaroids } from "@/constants/mock-polaroids";
import { PolaroidCard } from "@/components/polaroid/polaroid-card";
import { useLanguage } from "@/contexts/language-context";

export function CommunityMarquee() {
  const { t } = useLanguage();
  const duplicatedPolaroids = [...communityPolaroids, ...communityPolaroids];

  return (
    <section className="w-full py-12 overflow-hidden bg-gradient-to-b from-transparent via-card/30 to-transparent">
      <div className="mb-6 max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-fg mb-2">
          {t.community.title}
        </h2>
        <p className="text-fg-muted font-body text-sm md:text-base">
          {t.community.subtitle}
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />

        <div 
          className="flex gap-6 group" 
          style={{ animation: "marquee 60s linear infinite" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.animationPlayState = "paused";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.animationPlayState = "running";
          }}
        >
          {duplicatedPolaroids.map((polaroid, index) => (
            <div
              key={`${polaroid.id}-${index}`}
              className="flex-shrink-0 w-[280px] md:w-[320px]"
            >
              <div className="card-panel p-4 rounded-sm shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border/50">
                  <img
                    src={polaroid.avatar}
                    alt={polaroid.name}
                    className="w-10 h-10 rounded-full border-2 border-accent/20"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-fg text-sm truncate">
                      {polaroid.name}
                    </p>
                    <p className="font-mono text-xs text-fg-muted truncate">
                      {polaroid.handle}
                    </p>
                  </div>
                  <span className="text-xs text-fg-muted font-body whitespace-nowrap">
                    {polaroid.date}
                  </span>
                </div>

                <div className="relative">
                  <PolaroidCard
                    image={polaroid.image}
                    profile={polaroid.profile}
                    variant="preview"
                    className="pointer-events-none"
                    zoom={1}
                    position={{ x: 0, y: 0 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

