import { useState, useEffect, useCallback, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/contexts/language-context";
import { AuthProvider } from "@/contexts/auth-context-provider";
import { TrackingProvider } from "@/contexts/tracking-context";
import { AppShell } from "@/components/layout/app-shell";
import { EditorSection } from "@/components/sections/editor-section";
import { AboutSection } from "@/components/sections/about-section";
import { PhotoStrip } from "@/components/sections/photo-strip";
import { CommunityMarquee } from "@/components/sections/community-marquee";
import { UserPolaroids } from "@/components/sections/user-polaroids";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { PolaroidModal } from "@/components/polaroid/polaroid-modal";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { usePolaroid, useUserPolaroids } from "@/hooks/use-polaroids-query";
import type { PolaroidRecord } from "@/lib/polaroids";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

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

  const [sharedPolaroidId, setSharedPolaroidId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("p");
    }
    return null;
  });

  const { data: sharedPolaroid } = usePolaroid(sharedPolaroidId);

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

  useEffect(() => {
    const handle = sharedPolaroid?.profile?.handles?.[0]?.handle;
    if (handle) {
      const originalTitle = document.title;
      document.title = `Cafe Cursor – ${handle}'s card`;
      return () => {
        document.title = originalTitle;
      };
    }
  }, [sharedPolaroid]);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setSharedPolaroidId(params.get("p"));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleCloseModal = () => {
    setSharedPolaroidId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("p");
    window.history.replaceState({}, "", url.toString());
  };

  const [activePolaroid, setActivePolaroid] = useState<PolaroidRecord | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [newCardRequested, setNewCardRequested] = useState(false);
  const hasLoadedInitialRef = useRef(false);
  const { data: userPolaroids = [] } = useUserPolaroids();

  useEffect(() => {
    if (!hasLoadedInitialRef.current && userPolaroids.length > 0 && activePolaroid === null) {
      setActivePolaroid(userPolaroids[0]);
      hasLoadedInitialRef.current = true;
    }
  }, [userPolaroids, activePolaroid]);

  const handleSelectPolaroid = useCallback((polaroid: PolaroidRecord) => {
    setActivePolaroid(polaroid);
    setNewCardRequested(false);
    document.getElementById("editor")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleAddNew = useCallback(() => {
    if (activePolaroid) {
      setNewCardRequested(true);
    } else {
      setActivePolaroid(null);
      setEditorKey((k) => k + 1);
      document.getElementById("editor")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activePolaroid]);

  const handleNewCardHandled = useCallback(() => {
    setNewCardRequested(false);
  }, []);

  return (
    <TrackingProvider>
      <LanguageProvider>
        <AnimatedBackground />
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        <AppShell>
        <EditorSection 
          key={editorKey}
          initialPolaroid={activePolaroid}
          onPolaroidChange={setActivePolaroid}
          newCardRequested={newCardRequested}
          onNewCardHandled={handleNewCardHandled}
        />
        <UserPolaroids 
          onSelectPolaroid={handleSelectPolaroid}
          onAddNew={handleAddNew}
          activePolaroidId={activePolaroid?.id}
        />
        <CommunityMarquee />
        <PhotoStrip />
        <AboutSection />
      </AppShell>
      {sharedPolaroidId && (
        <PolaroidModal polaroidId={sharedPolaroidId} onClose={handleCloseModal} />
      )}
      </LanguageProvider>
    </TrackingProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
