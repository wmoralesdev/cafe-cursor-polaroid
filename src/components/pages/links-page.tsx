import { Github, MessageCircle, Home } from "lucide-react";
import { XIcon } from "@/components/ui/x-icon";
import { CursorIcon } from "@/components/ui/cursor-icon";
import { AppShell } from "@/components/layout/app-shell";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { TrackingProvider } from "@/contexts/tracking-context";
import { LanguageProvider } from "@/contexts/language-context";
import { useLanguage } from "@/hooks/use-language";

interface LinkItem {
  label: string;
  description: string;
  url: string;
  icon: React.ReactNode;
  external?: boolean;
  showProfile?: boolean;
  handle?: string;
}

function LinksPageContent() {
  const { t } = useLanguage();

  const links: LinkItem[] = [
    {
      label: t.links.whatsapp.label,
      description: t.links.whatsapp.description,
      url: "https://chat.whatsapp.com/Ga8mG1fqDM9C0ryxAw1eIj",
      icon: <MessageCircle className="w-5 h-5" strokeWidth={1.5} />,
      external: true,
    },
    {
      label: t.links.x.label,
      description: t.links.x.description,
      url: "https://x.com/wmoralesdev",
      icon: <XIcon className="w-5 h-5" />,
      external: true,
      showProfile: true,
      handle: t.links.x.handle,
    },
    {
      label: t.links.github.label,
      description: t.links.github.description,
      url: "https://github.com/wmoralesdev",
      icon: <Github className="w-5 h-5" strokeWidth={1.5} />,
      external: true,
      showProfile: true,
      handle: t.links.github.handle,
    },
    {
      label: t.links.mainSite.label,
      description: t.links.mainSite.description,
      url: "/",
      icon: <Home className="w-5 h-5" strokeWidth={1.5} />,
      external: true,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
      <div className="flex items-center gap-2 mb-8">
        <CursorIcon className="w-8 h-8" />
        <h1 className="text-3xl md:text-4xl font-display font-medium text-fg">
          {t.links.title}
        </h1>
      </div>

      <div className="w-full max-w-md space-y-3">
        {links.map((link) => {
          const linkClassName =
            "flex flex-col gap-2 px-6 py-4 bg-card border border-border rounded-sm hover:border-border-strong hover:bg-card-02 transition-all duration-200 shadow-sm hover:shadow-md group";

          const content = (
            <>
              <div className="flex items-center gap-3">
                <div className="text-fg group-hover:text-accent transition-colors">
                  {link.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-medium text-fg font-body">
                      {link.label}
                    </span>
                    {link.showProfile && link.handle && (
                      <span className="text-sm text-accent font-mono">
                        {link.handle}
                      </span>
                    )}
                  </div>
                </div>
                <svg
                  className="w-4 h-4 text-fg-muted group-hover:text-accent transition-colors flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <p className="text-sm text-fg-muted font-body ml-11">
                {link.description}
              </p>
            </>
          );

          return (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClassName}
            >
              {content}
            </a>
          );
        })}
      </div>
    </div>
  );
}

export function LinksPage() {
  return (
    <TrackingProvider>
      <LanguageProvider>
        <AnimatedBackground />
        <AppShell>
          <LinksPageContent />
        </AppShell>
      </LanguageProvider>
    </TrackingProvider>
  );
}

