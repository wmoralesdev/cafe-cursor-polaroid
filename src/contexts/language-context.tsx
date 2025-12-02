import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Language } from "@/constants/translations";
import { translations } from "@/constants/translations";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cafe-cursor-lang") as Language | null;
      if (saved === "en" || saved === "es") return saved;
      
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "es") return "es";
    }
    return "en";
  });

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("cafe-cursor-lang", newLang);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

