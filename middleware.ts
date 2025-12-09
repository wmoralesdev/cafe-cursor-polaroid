// Bot user agents that need OG meta tags
const BOT_USER_AGENTS = [
  'Twitterbot',
  'facebookexternalhit',
  'LinkedInBot',
  'Slackbot',
  'Discordbot',
  'TelegramBot',
  'WhatsApp',
];

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const { pathname } = url;

  // Only handle /c/:slug routes
  if (!pathname.startsWith('/c/')) {
    return NextResponse.next();
  }

  const userAgent = request.headers.get('user-agent') || '';
  const isBot = BOT_USER_AGENTS.some((bot) => userAgent.includes(bot));

  // If not a bot, continue to SPA
  if (!isBot) {
    return new Response(null, {
      status: 200,
    });
  }

  // Extract slug
  const slug = pathname.replace('/c/', '');
  if (!slug) {
    return new Response(null, {
      status: 200,
    });
  }

  // Fetch polaroid data
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return new Response(null, {
      status: 200,
    });
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/polaroids?slug=eq.${slug}&select=*`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    const data = await response.json();
    const polaroid = data[0];

    if (!polaroid) {
      return new Response(null, {
        status: 200,
      });
    }

    const profile = polaroid.profile || {};
    const handle = profile.handles?.[0]?.handle || 'dev';
    const primaryModel = profile.primaryModel?.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) || '';
    const plan = profile.planTier?.toUpperCase() || '';
    const isMax = profile.isMaxMode;

    const title = `@${handle}'s dev card`;
    const description = [primaryModel, plan, isMax ? 'MAX' : ''].filter(Boolean).join(' · ') || 'Cafe Cursor dev card';
    
    // Use Vercel OG image endpoint
    const host = request.headers.get('host') || 'cafe.cursor-sv.com';
    const ogImageUrl = `https://${host}/api/og/${slug}`;
    const pageUrl = `https://${host}/c/${slug}`;

    // Return HTML with OG meta tags for bots
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title} · Cafe Cursor</title>
  
  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description} · Cafe Cursor" />
  <meta property="og:image" content="${ogImageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:site_name" content="Cafe Cursor" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description} · Cafe Cursor" />
  <meta name="twitter:image" content="${ogImageUrl}" />
</head>
<body>
  <p>Loading ${title}...</p>
</body>
</html>`;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Middleware error:', error);
    return new Response(null, {
      status: 200,
    });
  }
}

