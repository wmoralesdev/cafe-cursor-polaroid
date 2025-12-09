import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPolaroidBySlug } from "@/lib/polaroids";
import { polaroidThemes } from "@/constants/polaroid-themes";
import type { PolaroidTheme } from "@/types/form";
import { Loader2 } from "lucide-react";
import { OGCard } from "@/components/polaroid/og-card";

const THEME_OPTIONS: PolaroidTheme[] = ["classic", "minimal", "web", "sakura", "tokyo", "cyberpunk", "matrix"];

function formatModel(model: string): string {
  return model
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace("Gpt", "GPT");
}

export function OGPreviewPage() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedTheme, setSelectedTheme] = useState<PolaroidTheme | null>(null);
  
  const { data: polaroid, isLoading, error } = useQuery({
    queryKey: ["polaroid-slug", slug],
    queryFn: () => getPolaroidBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (error || !polaroid) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-2">Polaroid not found</h1>
          <p className="text-neutral-400">Slug: {slug}</p>
        </div>
      </div>
    );
  }

  const activeTheme = selectedTheme || (polaroid.profile?.polaroidTheme as PolaroidTheme) || "classic";
  const theme = polaroidThemes[activeTheme] || polaroidThemes.classic;
  const handle = polaroid.profile?.handles?.[0]?.handle || "dev";
  const title = `@${handle}'s dev card`;
  const primaryModel = polaroid.profile?.primaryModel ? formatModel(polaroid.profile.primaryModel) : "";
  const plan = polaroid.profile?.planTier?.toUpperCase() || "";
  const isMax = polaroid.profile?.isMaxMode;
  const description = [primaryModel, plan, isMax ? "MAX" : ""].filter(Boolean).join(" · ");

  // Create a profile with the selected theme override for preview
  const previewProfile = {
    ...polaroid.profile!,
    polaroidTheme: activeTheme,
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-8">
      {/* Dev banner */}
      <div className="max-w-4xl mx-auto mb-4">
        <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg px-4 py-2 text-amber-200 text-sm">
          <strong>DEV ONLY:</strong> This page previews how the Twitter/X card will look when shared. The OG image is now pre-generated and stored.
        </div>
      </div>

      {/* Theme toggle */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-neutral-400 text-sm mr-2">Theme:</span>
          {THEME_OPTIONS.map((themeName) => {
            const themeConfig = polaroidThemes[themeName];
            const isActive = activeTheme === themeName;
            return (
              <button
                key={themeName}
                onClick={() => setSelectedTheme(themeName)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isActive 
                    ? "ring-2 ring-offset-2 ring-offset-neutral-900" 
                    : "opacity-70 hover:opacity-100"
                }`}
                style={{ 
                  background: themeConfig.accent,
                  color: "white",
                }}
              >
                {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
              </button>
            );
          })}
          {selectedTheme && (
            <button
              onClick={() => setSelectedTheme(null)}
              className="px-3 py-1.5 rounded-full text-sm font-medium bg-neutral-700 text-neutral-300 hover:bg-neutral-600 transition-all ml-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Twitter card preview */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-neutral-400 text-sm mb-4 font-mono">Twitter Card Preview (summary_large_image)</h2>
        
        {/* Card mockup */}
        <div 
          className="rounded-2xl overflow-hidden border border-neutral-700"
          style={{ maxWidth: 700 }}
        >
          {/* OG Image preview - using OGCard component */}
          <div className="overflow-hidden" style={{ transform: "scale(0.55)", transformOrigin: "top left", height: 347 }}>
            <OGCard
              profile={previewProfile}
              imageUrl={polaroid.source_image_url || polaroid.image_url}
              lang="en"
            />
          </div>

          {/* Card metadata footer */}
          <div 
            className="p-3 border-t"
            style={{ background: "rgb(22, 22, 22)", borderColor: "rgb(47, 47, 47)" }}
          >
            <p className="text-neutral-500 text-xs mb-0.5">cafe.cursor-sv.com</p>
            <h3 className="text-white font-semibold text-sm">{title}</h3>
            <p className="text-neutral-400 text-xs">{description || "Cafe Cursor dev card"} · Cafe Cursor</p>
          </div>
        </div>

        {/* OG Image URL info */}
        {polaroid.og_image_url && (
          <div className="mt-4 p-4 bg-green-900/30 border border-green-700/50 rounded-lg">
            <p className="text-green-300 text-sm font-medium mb-1">✓ Pre-generated OG image available</p>
            <p className="text-neutral-400 text-xs break-all">{polaroid.og_image_url}</p>
          </div>
        )}

        {!polaroid.og_image_url && (
          <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
            <p className="text-yellow-300 text-sm font-medium mb-1">⚠ No pre-generated OG image</p>
            <p className="text-neutral-400 text-xs">Share the polaroid to generate the OG image.</p>
          </div>
        )}

        {/* Meta tags preview */}
        <div className="mt-8">
          <h2 className="text-neutral-400 text-sm mb-4 font-mono">OG Meta Tags</h2>
          <pre className="bg-neutral-800 rounded-lg p-4 text-sm text-neutral-300 overflow-x-auto">
{`<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description || "Cafe Cursor dev card"} · Cafe Cursor" />
<meta property="og:image" content="${polaroid.og_image_url || "[not generated yet]"}" />
<meta property="og:url" content="https://cafe.cursor-sv.com/c/${slug}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description || "Cafe Cursor dev card"} · Cafe Cursor" />`}
          </pre>
        </div>

        {/* Theme info */}
        <div className="mt-8">
          <h2 className="text-neutral-400 text-sm mb-4 font-mono">
            Theme: {activeTheme}
            {selectedTheme && selectedTheme !== polaroid.profile?.polaroidTheme && (
              <span className="text-amber-400 ml-2">(preview only - won't affect stored image)</span>
            )}
          </h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded"
                style={{ background: theme.accent }}
              />
              <span className="text-neutral-400 text-sm">Accent</span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded"
                style={{ background: theme.tapeGradient }}
              />
              <span className="text-neutral-400 text-sm">Tape</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
