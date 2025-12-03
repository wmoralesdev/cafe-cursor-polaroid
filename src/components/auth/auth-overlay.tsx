import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/language-context";
import { Github, Twitter, Lock } from "lucide-react";
import { clsx } from "clsx";

export function AuthOverlay() {
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

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-bg/95 backdrop-blur-sm rounded-sm">
      <div className="w-full max-w-md p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
            <Lock className="w-8 h-8 text-accent" strokeWidth={1.5} />
          </div>
          <h3 className="font-display text-2xl font-semibold text-fg mb-2">
            {t.editor.auth.title}
          </h3>
          <p className="text-fg-muted font-body text-sm">
            {t.editor.auth.subtitle}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGitHubLogin}
            disabled={isLoading !== null}
            className={clsx(
              "w-full py-3 px-6 rounded-sm font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-3 font-body",
              "bg-[#24292e] text-white hover:bg-[#1a1e22] hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            )}
          >
            <Github className="w-5 h-5" strokeWidth={1.5} />
            {isLoading === "github" ? t.editor.auth.connecting : t.editor.auth.github}
          </button>

          <button
            onClick={handleTwitterLogin}
            disabled={isLoading !== null}
            className={clsx(
              "w-full py-3 px-6 rounded-sm font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-3 font-body",
              "bg-black text-white hover:bg-gray-900 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            )}
          >
            <Twitter className="w-5 h-5" strokeWidth={1.5} />
            {isLoading === "twitter" ? t.editor.auth.connecting : t.editor.auth.twitter}
          </button>
        </div>
      </div>
    </div>
  );
}

