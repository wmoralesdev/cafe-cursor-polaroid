import { TrackingProvider } from "@/contexts/tracking-context";
import { LanguageProvider } from "@/contexts/language-context";
import { AppShell } from "@/components/layout/app-shell";
import { EditorSection } from "@/components/sections/editor-section";
import { SignedOutEditorTeaser } from "@/components/sections/signed-out-editor-teaser";
import { AboutSection } from "@/components/sections/about-section";
import { PhotoStrip } from "@/components/sections/photo-strip";
import { PolaroidMarqueeSection } from "@/components/sections/polaroid-marquee";
import { UserPolaroids } from "@/components/sections/user-polaroids";
import { PolaroidModal } from "@/components/polaroid/polaroid-modal";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { useSharedPolaroid } from "@/hooks/use-shared-polaroid";
import { usePolaroidManagement } from "@/hooks/use-polaroid-management";
import { usePolaroidStore } from "@/stores/polaroid-store";
import { useAuth } from "@/hooks/use-auth";

export function HomePage() {
  const { sharedPolaroidId, handleCloseModal } = useSharedPolaroid();
  const { user, loading } = useAuth();
  // Initialize polaroid management hook (syncs with store)
  usePolaroidManagement();
  
  // Get values from store
  const activePolaroid = usePolaroidStore((state) => state.activePolaroid);
  const editorKey = usePolaroidStore((state) => state.editorKey);
  const setActivePolaroid = usePolaroidStore((state) => state.setActivePolaroid);

  const isAuthed = !!user;

  return (
    <TrackingProvider>
      <LanguageProvider>
        <AnimatedBackground />
        <AppShell>
          {isAuthed ? (
            // Signed-in layout: Editor first
            <>
              <EditorSection 
                key={editorKey}
                initialPolaroid={activePolaroid}
                onPolaroidChange={setActivePolaroid}
              />
              <UserPolaroids />
              <PolaroidMarqueeSection />
            </>
          ) : (
            // Signed-out layout: Live Wall hero first
            <>
              <PolaroidMarqueeSection showSignInOverlay={!loading} />
              <SignedOutEditorTeaser />
            </>
          )}
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

