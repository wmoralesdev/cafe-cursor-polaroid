import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPolaroidBySlug, type PolaroidRecord } from "@/lib/polaroids";
import { PolaroidCard } from "@/components/polaroid/polaroid-card";
import { Loader2, ArrowLeft, Share2 } from "lucide-react";
import { polaroidThemes } from "@/constants/polaroid-themes";
import { LanguageProvider } from "@/contexts/language-context";
import type { PolaroidTheme } from "@/types/form";

function getThemeConfig(profile: PolaroidRecord["profile"]) {
  const theme = (profile?.theme as PolaroidTheme) || "classic";
  return polaroidThemes[theme] || polaroidThemes.classic;
}

export function SharedPolaroidPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: polaroid, isLoading, error } = useQuery({
    queryKey: ["shared-polaroid", slug],
    queryFn: () => getPolaroidBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-fg-muted" />
      </div>
    );
  }

  if (error || !polaroid) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-fg mb-2">Polaroid not found</h1>
          <p className="text-fg-muted mb-4">This card may have been deleted or doesn't exist.</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Create your own
          </Link>
        </div>
      </div>
    );
  }

  const theme = getThemeConfig(polaroid.profile);
  const handle = polaroid.profile?.handles?.[0]?.handle || "dev";

  // Build share URL
  const shareUrl = `${window.location.origin}/c/${slug}`;
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `@${handle}'s dev card`,
          text: `Check out @${handle}'s dev card on Cafe Cursor!`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      // TODO: Show toast notification
    }
  };

  return (
    <LanguageProvider>
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-4"
        style={{ 
          background: `linear-gradient(135deg, ${theme.accent}08 0%, #0d0d0d 50%, ${theme.accent}05 100%)`,
        }}
      >
        {/* Back to home */}
        <div className="fixed top-4 left-4">
          <Link 
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/80 backdrop-blur-sm text-fg-muted hover:text-fg transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cafe Cursor</span>
          </Link>
        </div>

        {/* Share button */}
        <div className="fixed top-4 right-4">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/80 backdrop-blur-sm text-fg-muted hover:text-fg transition-colors text-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>

        {/* Polaroid Card */}
        <div className="max-w-sm w-full">
          <PolaroidCard
            image={polaroid.image_url}
            profile={{
              handles: polaroid.profile?.handles || [],
              projectType: polaroid.profile?.projectType || "",
              primaryModel: polaroid.profile?.primaryModel || "composer-1",
              secondaryModel: polaroid.profile?.secondaryModel || "gpt-4",
              planTier: polaroid.profile?.planTier || "pro",
              isMaxMode: polaroid.profile?.isMaxMode || false,
              extras: polaroid.profile?.extras || [],
              cursorSince: polaroid.profile?.cursorSince || "2024",
              polaroidTheme: (polaroid.profile?.theme as PolaroidTheme) || "classic",
              stampRotation: polaroid.profile?.stampRotation || -12,
              generatedAt: polaroid.created_at,
            }}
            source={polaroid.source}
          />
        </div>

        {/* Call to action */}
        <div className="mt-8 text-center">
          <p className="text-fg-muted text-sm mb-3">
            Want your own dev card?
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-medium transition-all hover:scale-105"
            style={{ background: theme.accent }}
          >
            Create yours free
          </Link>
        </div>
      </div>
    </LanguageProvider>
  );
}

