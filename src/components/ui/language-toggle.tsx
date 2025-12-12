import { Languages } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  const toggleLanguage = () => {
    setLang(lang === "en" ? "es" : "en");
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="flex items-center justify-center w-9 h-9 rounded-sm text-fg-muted hover:text-accent hover:bg-card-02/50 transition-all duration-150 border border-transparent hover:border-border focus:outline-none focus:ring-2 focus:ring-accent/20 focus:ring-offset-1"
      aria-label={`Switch to ${lang === "en" ? "Spanish" : "English"}`}
      title={`Switch to ${lang === "en" ? "Spanish" : "English"}`}
    >
      <Languages className="w-4 h-4" strokeWidth={1.5} />
    </button>
  );
}


















