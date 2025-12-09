/** @jsxImportSource react */
import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

// Theme configurations
const themes: Record<string, {
  accent: string;
  textPrimary: string;
  textMuted: string;
  badgeBg: string;
  badgeBorder: string;
  stampBorder: string;
  stampInnerBorder: string;
  stampText: string;
  tapeColor: string;
}> = {
  classic: {
    accent: "#E86C3A",
    textPrimary: "#1a1a1a",
    textMuted: "#666666",
    badgeBg: "#FEF3EE",
    badgeBorder: "#FDDCCC",
    stampBorder: "#E86C3A",
    stampInnerBorder: "#F4A77A",
    stampText: "#E86C3A",
    tapeColor: "#F5D78E",
  },
  minimal: {
    accent: "#6B7280",
    textPrimary: "#111827",
    textMuted: "#6B7280",
    badgeBg: "#F3F4F6",
    badgeBorder: "#E5E7EB",
    stampBorder: "#9CA3AF",
    stampInnerBorder: "#D1D5DB",
    stampText: "#6B7280",
    tapeColor: "#E5E7EB",
  },
  coffee: {
    accent: "#8B6914",
    textPrimary: "#3D2914",
    textMuted: "#6B5344",
    badgeBg: "#FDF6E3",
    badgeBorder: "#E8D5B0",
    stampBorder: "#8B6914",
    stampInnerBorder: "#C4A962",
    stampText: "#8B6914",
    tapeColor: "#D4C4A8",
  },
  zen: {
    accent: "#5A7A5A",
    textPrimary: "#2D3B2D",
    textMuted: "#5A6B5A",
    badgeBg: "#F0F5F0",
    badgeBorder: "#C8D8C8",
    stampBorder: "#5A7A5A",
    stampInnerBorder: "#8BA88B",
    stampText: "#5A7A5A",
    tapeColor: "#C8D8C8",
  },
  tokyo: {
    accent: "#E91E8C",
    textPrimary: "#1a1a2e",
    textMuted: "#6B6B8D",
    badgeBg: "#FDF0F7",
    badgeBorder: "#F8C8E0",
    stampBorder: "#E91E8C",
    stampInnerBorder: "#F472B6",
    stampText: "#E91E8C",
    tapeColor: "#A8E6CF",
  },
};

function formatModel(model: string): string {
  return model
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace("Gpt", "GPT");
}

function getPlatformIcon(platform: string): string {
  switch (platform) {
    case "x": return "𝕏";
    case "linkedin": return "in";
    case "github": return "⌘";
    default: return "@";
  }
}

export default async function handler(request: Request) {
  try {
    const { searchParams, pathname } = new URL(request.url);
    
    // Extract slug from path or query
    const pathSlug = pathname.split('/').pop();
    const slug = searchParams.get('slug') || pathSlug;

    if (!slug) {
      return new Response('Missing slug', { status: 400 });
    }

    // Fetch polaroid from Supabase
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return new Response('Missing Supabase config', { status: 500 });
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/polaroids?slug=eq.${slug}&select=*`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    const data = await response.json() as any[];
    const polaroid = data[0];

    if (!polaroid) {
      return new Response('Polaroid not found', { status: 404 });
    }

    const profile = polaroid.profile || {};
    const themeName = profile.polaroidTheme || profile.theme || "classic";
    const theme = themes[themeName] || themes.classic;
    
    const handle = profile.handles?.[0]?.handle || "dev";
    const platform = profile.handles?.[0]?.platform || "x";
    const project = profile.projectType || "";
    const primaryModel = profile.primaryModel ? formatModel(profile.primaryModel) : "";
    const secondaryModel = profile.secondaryModel ? formatModel(profile.secondaryModel) : "";
    const plan = profile.planTier?.toUpperCase() || "";
    const isMax = profile.isMaxMode;
    const extras = (profile.extras || []).slice(0, 3);
    const stampRotation = profile.stampRotation || 12;
    const imageUrl = polaroid.source_image_url || polaroid.image_url || "";

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '1200px',
            height: '630px',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            background: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 50%, #1a1a1a 100%)',
            position: 'relative',
          }}
        >
          {/* Accent glows */}
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: theme.accent,
              opacity: 0.6,
            }}
          />
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              bottom: '30px',
              left: '30px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: theme.accent,
              opacity: 0.4,
            }}
          />

          {/* Polaroid Card */}
          <div
            style={{
              display: 'flex',
              position: 'relative',
              background: 'white',
              borderRadius: '4px',
              width: '1080px',
              height: '510px',
              padding: '20px',
              paddingBottom: '60px',
              transform: 'rotate(-1deg)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            }}
          >
            {/* Photo */}
            <div
              style={{
                display: 'flex',
                width: '420px',
                height: '100%',
                borderRadius: '4px',
                overflow: 'hidden',
                flexShrink: 0,
                background: '#e5e5e5',
              }}
            >
              {imageUrl && (
                <img
                  src={imageUrl}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              )}
            </div>

            {/* Info */}
            <div
              style={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '16px 0 16px 32px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Handle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div
                    style={{
                      display: 'flex',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: theme.accent,
                      color: 'white',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 'bold',
                    }}
                  >
                    {getPlatformIcon(platform)}
                  </div>
                  <span style={{ fontSize: '32px', fontWeight: 'bold', color: theme.textPrimary }}>
                    @{handle}
                  </span>
                  {isMax && (
                    <div
                      style={{
                        display: 'flex',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        background: theme.accent,
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 'bold',
                      }}
                    >
                      MAX
                    </div>
                  )}
                </div>

                {/* Project */}
                {project && (
                  <div style={{ display: 'flex', fontSize: '22px', color: theme.textMuted, marginBottom: '20px' }}>
                    <span style={{ opacity: 0.6 }}>Building</span>
                    <span style={{ color: theme.textPrimary, fontWeight: 600, marginLeft: '8px' }}>{project}</span>
                  </div>
                )}

                {/* Model row */}
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '20px', marginBottom: '16px', gap: '24px' }}>
                  {primaryModel && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: theme.textMuted }}>
                      <span style={{ color: theme.accent }}>▸</span> {primaryModel}
                    </div>
                  )}
                  {secondaryModel && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: theme.textMuted }}>
                      <span style={{ color: theme.accent }}>◉</span> {secondaryModel}
                    </div>
                  )}
                  {plan && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: theme.textMuted }}>
                      <span style={{ color: theme.accent }}>★</span> {plan}
                    </div>
                  )}
                </div>

                {/* Tech stack */}
                {extras.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {extras.map((tech: string, i: number) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          fontSize: '18px',
                          padding: '4px 12px',
                          borderRadius: '6px',
                          background: theme.badgeBg,
                          color: theme.textMuted,
                          border: `1px solid ${theme.badgeBorder}`,
                        }}
                      >
                        {tech}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Branding */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.5 }}>
                  <path d="M5.5 3.21V20.79L11.5 16.29L14.5 21.79L17.5 20.29L14.5 14.79L20.5 13.29L5.5 3.21Z" fill="black"/>
                </svg>
                <span style={{ fontSize: '20px', color: theme.textMuted }}>Cafe Cursor</span>
              </div>
            </div>

            {/* Stamp */}
            <div
              style={{
                display: 'flex',
                position: 'absolute',
                bottom: '70px',
                right: '30px',
                transform: `rotate(${stampRotation}deg)`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'white',
                  border: `3px ${themeName === 'coffee' ? 'dashed' : 'solid'} ${theme.stampBorder}`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                {/* Inner dashed ring */}
                <div
                  style={{
                    display: 'flex',
                    position: 'absolute',
                    top: '6px',
                    left: '6px',
                    right: '6px',
                    bottom: '6px',
                    borderRadius: '50%',
                    border: `2px dashed ${theme.stampInnerBorder}`,
                  }}
                />
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: theme.stampText, textTransform: 'uppercase' }}>
                  {themeName === 'zen' ? '東京' : themeName === 'coffee' ? '☕' : 'CAFE'}
                </span>
                {/* Cursor logo placeholder - using a simple icon */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ margin: '4px 0' }}>
                  <path d="M5.5 3.21V20.79L11.5 16.29L14.5 21.79L17.5 20.29L14.5 14.79L20.5 13.29L5.5 3.21Z" fill="black"/>
                </svg>
                <span style={{ fontSize: '10px', color: theme.stampText, textTransform: 'uppercase' }}>
                  {themeName === 'zen' ? '禅' : '2025'}
                </span>
              </div>
            </div>

            {/* Tape */}
            <div
              style={{
                display: 'flex',
                position: 'absolute',
                top: '-10px',
                left: '80px',
                width: '100px',
                height: '36px',
                background: theme.tapeColor,
                transform: 'rotate(-12deg)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            />

            {/* Bottom accent line */}
            <div
              style={{
                display: 'flex',
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                height: '50px',
                background: 'white',
                alignItems: 'center',
                padding: '0 24px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  height: '2px',
                  width: '100%',
                  background: `linear-gradient(to right, transparent, ${theme.accent}66, transparent)`,
                }}
              />
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG Image Error:', error);
    return new Response(`Error: ${error}`, { status: 500 });
  }
}

