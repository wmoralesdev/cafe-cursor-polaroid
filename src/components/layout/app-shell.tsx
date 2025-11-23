import React from "react";
import { Camera } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col overflow-x-hidden font-sans selection:bg-accent selection:text-white striped-page">
      <header className="sticky top-0 z-50 border-b-4 border-black bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="bg-black text-white p-2 shadow-[4px_4px_0px_0px_rgba(245,78,0,1)] border-2 border-black">
               <Camera className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter uppercase leading-none">Polaroid</span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-50 leading-none">Generator V2</span>
            </div>
          </div>
          <nav className="hidden gap-8 sm:flex">
            <a href="#editor" className="text-sm font-black hover:text-accent transition-colors uppercase tracking-widest hover:underline decoration-4 underline-offset-4">
              Create
            </a>
            <a href="#about" className="text-sm font-black hover:text-accent transition-colors uppercase tracking-widest hover:underline decoration-4 underline-offset-4">
              About
            </a>
          </nav>
        </div>
      </header>
      <main className="flex-1 px-4 py-8 sm:px-6 mx-auto w-full max-w-7xl">
        {children}
      </main>
      <footer className="border-t-4 border-black py-8 text-center bg-white">
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-fg/40">© {new Date().getFullYear()} Polaroid Generator // Built with Cursor</p>
      </footer>
    </div>
  );
}

