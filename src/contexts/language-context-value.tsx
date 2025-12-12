import { createContext } from "react";
import type { Language } from "@/constants/translations";
import { translations } from "@/constants/translations";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.en;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

