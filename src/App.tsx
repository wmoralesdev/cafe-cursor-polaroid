import { useState, useEffect } from "react";
import { LanguageProvider } from "@/contexts/language-context";
import { AuthProvider } from "@/contexts/auth-context-provider";
import { AppShell } from "@/components/layout/app-shell";
import { EditorSection } from "@/components/sections/editor-section";
import { AboutSection } from "@/components/sections/about-section";
import { PhotoStrip } from "@/components/sections/photo-strip";
import { CommunityMarquee } from "@/components/sections/community-marquee";
import { UserPolaroids } from "@/components/sections/user-polaroids";
import { ThemeToggle } from "@/components/ui/theme-toggle";

type Theme = "light" | "dark";

function AppContent() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("polaroid-theme") as Theme | null;
      if (saved === "light" || saved === "dark") {
        if (saved === "dark") {
          document.documentElement.setAttribute("data-theme", "dark");
        } else {
          document.documentElement.removeAttribute("data-theme");
        }
        return saved;
      }
    }
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-theme", "dark");
    }
    return "dark";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("polaroid-theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <LanguageProvider>
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <AppShell>
        <EditorSection />
        <CommunityMarquee />
        <PhotoStrip />
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-8 w-full" />
        <UserPolaroids />
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-8 w-full" />
        <AboutSection />
      </AppShell>
    </LanguageProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
