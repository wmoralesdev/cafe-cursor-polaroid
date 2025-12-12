import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/hooks/use-auth";
import { SectionHeader } from "@/components/ui/section-header";
import { Github, Twitter, Camera, Palette, Download } from "lucide-react";
import { clsx } from "clsx";

const features = [
  { icon: Camera, key: "create" },
  { icon: Palette, key: "style" },
  { icon: Download, key: "export" },
];

export function SignedOutEditorTeaser() {
  const { t } = useLanguage();
  const { signInWithGitHub, signInWithTwitter } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleGitHubLogin = async () => {
    setIsLoading("github");
    try {
      await signInWithGitHub();
    } catch (error) {
      console.error("GitHub login failed:", error);
      setIsLoading(null);
    }
  };

  const handleTwitterLogin = async () => {
    setIsLoading("twitter");
    try {
      await signInWithTwitter();
    } catch (error) {
      console.error("Twitter login failed:", error);
      setIsLoading(null);
    }
  };

  const featureTexts = t.signedOut?.hero?.features || [
    "Design a unique polaroid-style dev card",
    "Customize themes, badges, and your tech stack",
    "Export high-res prints or share online",
  ];

  return (
    <section id="join" className="w-full py-16">
      <div className="container mx-auto px-4">
        {/* Unified Card */}
        <div className="overflow-hidden bg-card border border-border rounded-xl shadow-sm">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left: Content */}
            <div className="p-8 sm:p-12 flex flex-col justify-center space-y-8">
              <SectionHeader
                title={t.signedOut?.hero?.title || "Join the session"}
                subtitle={t.signedOut?.hero?.subtitle || "Create your dev card, share your setup, and connect with builders worldwide."}
              />

              {/* Feature list */}
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={feature.key} className="flex items-start gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-accent/20 transition-colors">
                      <feature.icon className="w-4 h-4 text-accent" strokeWidth={1.5} />
                    </div>
                    <span className="text-fg font-body group-hover:text-accent transition-colors duration-300">{featureTexts[index]}</span>
                  </li>
                ))}
              </ul>

              {/* Sign in buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleGitHubLogin}
                  disabled={isLoading !== null}
                  className={clsx(
                    "flex-1 py-3 px-6 rounded-sm font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-3 font-body",
                    "bg-[#24292e] text-white hover:bg-[#1a1e22] hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  )}
                >
                  <Github className="w-5 h-5" strokeWidth={1.5} />
                  {isLoading === "github" ? t.editor.auth.connecting : t.editor.auth.github}
                </button>

                <button
                  type="button"
                  onClick={handleTwitterLogin}
                  disabled={isLoading !== null}
                  className={clsx(
                    "flex-1 py-3 px-6 rounded-sm font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-3 font-body",
                    "bg-black text-white hover:bg-gray-900 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  )}
                >
                  <Twitter className="w-5 h-5" strokeWidth={1.5} />
                  {isLoading === "twitter" ? t.editor.auth.connecting : t.editor.auth.twitter}
                </button>
              </div>
            </div>

            {/* Right: Visual preview */}
            <div className="relative bg-card-02/50 min-h-[400px] lg:min-h-full flex items-center justify-center overflow-hidden p-8">
              {/* Blurred card mock */}
              <div className="relative w-[280px] h-[380px] bg-white rounded-sm shadow-2xl rotate-3 transition-transform duration-500 hover:rotate-0">
                {/* Tape strip */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-amber-100/80 -rotate-2 shadow-sm z-10" />
                
                {/* Image placeholder */}
                <div className="aspect-square bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center relative overflow-hidden group">
                  <Camera className="w-12 h-12 text-zinc-300" strokeWidth={1} />
                  {/* Export badge */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                    <Download className="w-3 h-3 text-accent" />
                    <span className="text-xs font-medium text-accent">Print ready</span>
                  </div>
                </div>
                
                {/* Caption area */}
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-zinc-100 rounded w-32" />
                  <div className="flex gap-2">
                    <div className="h-3 bg-zinc-100 rounded w-16" />
                    <div className="h-3 bg-zinc-100 rounded w-12" />
                  </div>
                  <div className="flex gap-1 mt-4">
                    <div className="h-6 bg-zinc-100 rounded-full w-8" />
                    <div className="h-6 bg-zinc-100 rounded-full w-8" />
                    <div className="h-6 bg-zinc-100 rounded-full w-8" />
                  </div>
                </div>
              </div>

              {/* Decorative elements behind */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

