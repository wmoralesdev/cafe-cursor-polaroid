import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Github, Twitter, X } from "lucide-react";
import { clsx } from "clsx";

interface LoginModalProps {
  onClose?: () => void;
}

export function LoginModal({ onClose }: LoginModalProps) {
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose ? (e) => {
        if (e.target === e.currentTarget) onClose();
      } : undefined}
    >
        <div className="w-full max-w-md card-panel p-8 rounded-sm shadow-lg animate-[fadeInUp_0.4s_ease-out_forwards] relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-sm text-fg-muted hover:text-fg hover:bg-card-02 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        )}
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-semibold text-fg mb-2">
            {t.editor.auth.welcome}
          </h2>
          <p className="text-fg-muted font-body text-base">
            {t.editor.auth.subtitle}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGitHubLogin}
            disabled={isLoading !== null}
            className={clsx(
              "w-full py-4 px-6 rounded-sm font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-3 font-body",
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
              "w-full py-4 px-6 rounded-sm font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-3 font-body",
              "bg-black text-white hover:bg-gray-900 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            )}
          >
            <Twitter className="w-5 h-5" strokeWidth={1.5} />
            {isLoading === "twitter" ? t.editor.auth.connecting : t.editor.auth.twitter}
          </button>
        </div>

        <p className="text-xs text-fg-muted text-center mt-6 font-body">
          {t.editor.auth.terms}
        </p>
      </div>
    </div>
  );
}

