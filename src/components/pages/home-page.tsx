import { TrackingProvider } from "@/contexts/tracking-context";
import { LanguageProvider } from "@/contexts/language-context";
import { AppShell } from "@/components/layout/app-shell";
import { EditorSection } from "@/components/sections/editor-section";
import { AboutSection } from "@/components/sections/about-section";
import { PhotoStrip } from "@/components/sections/photo-strip";
import { CommunitySwipeSection } from "@/components/sections/community-swipe";
import { UserPolaroids } from "@/components/sections/user-polaroids";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { PolaroidModal } from "@/components/polaroid/polaroid-modal";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { useSharedPolaroid } from "@/hooks/use-shared-polaroid";
import { usePolaroidManagement } from "@/hooks/use-polaroid-management";
import { usePolaroidStore } from "@/stores/polaroid-store";

export function HomePage() {
  const { sharedPolaroidId, handleCloseModal } = useSharedPolaroid();
  // Initialize polaroid management hook (syncs with store)
  usePolaroidManagement();
  
  // Get values from store
  const activePolaroid = usePolaroidStore((state) => state.activePolaroid);
  const editorKey = usePolaroidStore((state) => state.editorKey);
  const setActivePolaroid = usePolaroidStore((state) => state.setActivePolaroid);

  return (
    <TrackingProvider>
      <LanguageProvider>
        <AnimatedBackground />
        <ThemeToggle />
        <AppShell>
          <EditorSection 
            key={editorKey}
            initialPolaroid={activePolaroid}
            onPolaroidChange={setActivePolaroid}
          />
          <UserPolaroids />
          <CommunitySwipeSection />
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

