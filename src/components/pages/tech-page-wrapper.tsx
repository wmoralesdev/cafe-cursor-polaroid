import { LanguageProvider } from "@/contexts/language-context";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { TechPage } from "@/pages/tech";

export function TechPageWrapper() {
  return (
    <LanguageProvider>
      <AnimatedBackground />
      <TechPage />
    </LanguageProvider>
  );
}

