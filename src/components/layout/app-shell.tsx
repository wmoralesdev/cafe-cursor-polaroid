import React from "react";
import { Camera } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden selection:bg-gold selection:text-white warm-page">
      <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="text-gold">
               <Camera className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-semibold tracking-tight font-display text-fg">Polaroid</span>
                <span className="text-[10px] font-mono font-medium uppercase tracking-[0.1em] text-fg-muted">Generator</span>
            </div>
          </div>
          <nav className="hidden gap-8 sm:flex">
            <a 
              href="#editor" 
              className="text-sm font-medium text-fg-muted hover:text-gold transition-colors duration-150 font-body hover:underline underline-offset-4 decoration-1"
            >
              Create
            </a>
            <a 
              href="#about" 
              className="text-sm font-medium text-fg-muted hover:text-gold transition-colors duration-150 font-body hover:underline underline-offset-4 decoration-1"
            >
              About
            </a>
          </nav>
        </div>
      </header>
      <main className="flex-1 px-4 py-8 sm:px-6 mx-auto w-full max-w-7xl">
        {children}
      </main>
      <footer className="border-t border-border py-8 text-center bg-bg-warm">
        <p className="text-[11px] font-mono font-medium text-fg-subtle tracking-wide">
          © {new Date().getFullYear()} Polaroid Generator · Built with Cursor
        </p>
      </footer>
    </div>
  );
}
