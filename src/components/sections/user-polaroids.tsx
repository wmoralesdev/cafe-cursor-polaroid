import { useAuth } from "@/hooks/use-auth";
import { userPolaroids } from "@/constants/mock-polaroids";
import { PolaroidCard } from "@/components/polaroid/polaroid-card";
import { useLanguage } from "@/contexts/language-context";

export function UserPolaroids() {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) {
    return null;
  }

  return (
    <section className="w-full py-12 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="mb-8">
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-fg mb-2">
          {t.userPolaroids.title}
        </h2>
        <p className="text-fg-muted font-body text-sm md:text-base">
          {t.userPolaroids.subtitle}
        </p>
      </div>

      {userPolaroids.length === 0 ? (
        <div className="card-panel p-12 rounded-sm text-center">
          <p className="text-fg-muted font-body text-lg mb-2">
            {t.userPolaroids.empty.title}
          </p>
          <p className="text-fg-muted font-body text-sm">
            {t.userPolaroids.empty.subtitle}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPolaroids.map((polaroid) => (
            <div
              key={polaroid.id}
              className="card-panel p-4 rounded-sm shadow-sm hover:shadow-md transition-shadow duration-200"
            >
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
          ))}
        </div>
      )}
    </section>
  );
}

