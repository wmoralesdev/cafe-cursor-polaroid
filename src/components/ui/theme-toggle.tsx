import { clsx } from "clsx";
import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/stores/theme-store";

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
      <button
        onClick={toggleTheme}
        className={clsx(
          "group relative flex flex-col items-center gap-2 p-3 rounded-sm border transition-all duration-300",
          "hover:scale-105 active:scale-95",
          "bg-card border-border text-accent shadow-md"
        )}
        title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? (
          <Sun className="w-5 h-5" strokeWidth={1.5} />
        ) : (
          <Moon className="w-5 h-5" strokeWidth={1.5} />
        )}
        
        <div className="flex gap-1">
          <div 
            className={clsx(
              "w-2 h-2 rounded-full transition-all duration-300 bg-accent",
              theme === "light" ? "scale-110 opacity-100" : "scale-75 opacity-30"
            )}
          />
          <div 
            className={clsx(
              "w-2 h-2 rounded-full transition-all duration-300 bg-accent",
              theme === "dark" ? "scale-110 opacity-100" : "scale-75 opacity-30"
            )}
          />
        </div>
        
        <span className="text-[9px] font-mono uppercase tracking-wider text-fg">
          {theme}
        </span>
      </button>
    </div>
  );
}



