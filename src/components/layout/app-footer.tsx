import { Link } from "react-router-dom";
import { Github, Linkedin } from "lucide-react";
import { XIcon } from "@/components/ui/x-icon";
import { useLanguage } from "@/contexts/language-context";

export function AppFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border py-8 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs font-mono font-medium text-fg-muted tracking-wide">
          {t.shell.footer}
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <a
              href="https://x.com/wmoralesdev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg-muted hover:text-fg transition-colors"
              aria-label="X (Twitter)"
            >
              <XIcon className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/wmoralesdev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg-muted hover:text-fg transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" strokeWidth={1.5} />
            </a>
            <a
              href="https://linkedin.com/in/wmoralesdev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg-muted hover:text-fg transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" strokeWidth={1.5} />
            </a>
          </div>
          <span className="text-border">·</span>
          <Link 
            to="/tech" 
            className="text-xs font-mono font-medium text-fg-muted hover:text-accent transition-colors tracking-wide"
          >
            {t.shell.nav.tech}
          </Link>
        </div>
      </div>
    </footer>
  );
}












