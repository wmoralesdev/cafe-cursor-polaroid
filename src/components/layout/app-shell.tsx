import React from "react";
import { useLanguage } from "@/contexts/language-context";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { CursorIcon } from "@/components/ui/cursor-icon";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden selection:bg-accent selection:text-white bg-bg">
      <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="text-accent">
               <CursorIcon className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-semibold tracking-tight font-display text-fg">Cafe Cursor</span>
                <span className="text-[10px] font-mono font-medium uppercase tracking-[0.1em] text-fg-muted">{t.shell.subtitle}</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden gap-8 sm:flex">
              <a 
                href="#editor" 
                className="text-sm font-medium text-fg-muted hover:text-accent transition-colors duration-150 font-body hover:underline underline-offset-4 decoration-1"
              >
                {t.shell.nav.devCard}
              </a>
              <a 
                href="#about" 
                className="text-sm font-medium text-fg-muted hover:text-accent transition-colors duration-150 font-body hover:underline underline-offset-4 decoration-1"
              >
                {t.shell.nav.about}
              </a>
            </nav>
            <LanguageToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 px-4 py-8 sm:px-6 mx-auto w-full max-w-7xl">
        {children}
      </main>
      <footer className="border-t border-border py-8 text-center bg-card">
        <p className="text-[11px] font-mono font-medium text-fg-muted tracking-wide">
          {t.shell.footer}
        </p>
      </footer>
    </div>
  );
}
