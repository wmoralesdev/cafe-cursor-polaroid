import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { PolaroidCard } from "@/components/polaroid/polaroid-card";
import { useLanguage } from "@/contexts/language-context";
import { useCommunityPolaroids } from "@/hooks/use-polaroids-query";
import { useCommunityRealtime } from "@/hooks/use-community-realtime";
import type { PolaroidRecord } from "@/lib/polaroids";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

function getUserDisplayInfo(polaroid: PolaroidRecord, userAvatarUrl?: string | null) {
  const firstHandle = polaroid.profile.handles[0];
  const handle = firstHandle ? `@${firstHandle.handle}` : "@user";
  const name = firstHandle?.handle || "User";
  
  const avatar = userAvatarUrl || (() => {
    const avatarSeed = firstHandle?.handle || polaroid.user_id;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarSeed)}`;
  })();
  
  return { name, handle, avatar };
}

export function CommunityMarquee() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { data: polaroids = [], isLoading: loading } = useCommunityPolaroids(20);
  useCommunityRealtime();
  
  const locale = lang === "es" ? es : enUS;
  const userAvatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;

  const duplicationFactor = polaroids.length > 0 && polaroids.length < 10 ? 10 : 5;
  const duplicatedPolaroids = polaroids.length > 0 
    ? Array(duplicationFactor).fill(polaroids).flat()
    : [];

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

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" strokeWidth={1.5} />
          </div>
        ) : duplicatedPolaroids.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-fg-muted font-body text-sm">{t.community.empty}</p>
          </div>
        ) : (
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
            {duplicatedPolaroids.map((polaroid, index) => {
              const isCurrentUser = user && polaroid.user_id === user.id;
              const avatarUrl = isCurrentUser ? userAvatarUrl : null;
              const { name, handle, avatar } = getUserDisplayInfo(polaroid, avatarUrl);
              return (
                <div
                  key={`${polaroid.id}-${index}`}
                  className="flex-shrink-0 w-[280px] md:w-[320px]"
                >
                  <div className="card-panel p-4 rounded-sm shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border/50">
                      <img
                        src={avatar}
                        alt={name}
                        className="w-10 h-10 rounded-full border-2 border-accent/20"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-body font-semibold text-fg text-sm truncate">
                          {name}
                        </p>
                        <p className="font-mono text-xs text-fg-muted truncate">
                          {handle}
                        </p>
                      </div>
                      <span className="text-xs text-fg-muted font-body whitespace-nowrap">
                        {formatDistanceToNow(new Date(polaroid.created_at), { addSuffix: true, locale })}
                      </span>
                    </div>

                    <div className="relative">
                      <PolaroidCard
                        image={polaroid.source_image_url || polaroid.image_url || null}
                        profile={polaroid.profile}
                        variant="preview"
                        className="pointer-events-none"
                        zoom={1}
                        position={{ x: 0, y: 0 }}
                        source={polaroid.source}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

