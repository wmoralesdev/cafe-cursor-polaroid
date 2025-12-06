import { LanguageProvider } from "@/contexts/language-context";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { TechPage } from "@/pages/tech";

export function TechPageWrapper() {
  return (
    <LanguageProvider>
      <AnimatedBackground />
      <ThemeToggle />
      <TechPage />
    </LanguageProvider>
  );
}

