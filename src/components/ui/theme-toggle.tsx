import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/stores/theme-store";

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center justify-center w-9 h-9 rounded-sm text-fg-muted hover:text-accent hover:bg-card-02/50 transition-all duration-150 border border-transparent hover:border-border focus:outline-none focus:ring-2 focus:ring-accent/20 focus:ring-offset-1"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Sun className="w-4 h-4" strokeWidth={1.5} />
      ) : (
        <Moon className="w-4 h-4" strokeWidth={1.5} />
      )}
    </button>
  );
}



