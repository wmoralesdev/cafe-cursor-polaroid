import { TrackingProvider } from "@/contexts/tracking-context";
import { LanguageProvider } from "@/contexts/language-context";
import { AppShell } from "@/components/layout/app-shell";
import { AboutSection } from "@/components/sections/about-section";
import { PhotoStrip } from "@/components/sections/photo-strip";
import { PublicPolaroidGridSection } from "@/components/sections/public-polaroid-grid-section";
import { PolaroidModal } from "@/components/polaroid/polaroid-modal";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { useSharedPolaroid } from "@/hooks/use-shared-polaroid";

export function HomePage() {
  const { sharedPolaroidId, handleCloseModal } = useSharedPolaroid();

  return (
    <TrackingProvider>
      <LanguageProvider>
        <AnimatedBackground />
        <AppShell>
          <PublicPolaroidGridSection />
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

