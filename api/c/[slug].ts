// Bot user agents that need OG meta tags
const BOT_USER_AGENTS = [
  'Twitterbot',
  'facebookexternalhit',
  'LinkedInBot',
  'Slackbot',
  'Discordbot',
  'TelegramBot',
  'WhatsApp',
  'curl',
  'Wget',
  'Go-http-client',
  'python-requests',
  'MetaInspector',
  'Embedly',
  'Quora Link Preview',
  'Showyoubot',
  'outbrain',
  'pinterest',
  'Applebot',
  'redditbot',
];

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Extract slug from /api/c/:slug or /c/:slug
  const slug = pathname.replace('/api/c/', '').replace('/c/', '');
  
  if (!slug) {
    return new Response('Not found', { status: 404 });
  }

  const userAgent = request.headers.get('user-agent') || '';
  const isBot = BOT_USER_AGENTS.some((bot) => 
    userAgent.toLowerCase().includes(bot.toLowerCase())
  );

  // If not a bot, serve the SPA by fetching index.html
  if (!isBot) {
    const host = request.headers.get('host') || 'cafe.cursor-sv.com';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    
    try {
      // Fetch the index.html from the same origin
      const indexResponse = await fetch(`${protocol}://${host}/index.html`);
      const html = await indexResponse.text();
      
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    } catch {
      // Fallback: redirect to home with hash
      return Response.redirect(`${protocol}://${host}/#/c/${slug}`, 302);
    }
  }

  // Fetch polaroid data for bots
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return new Response('Missing config', { status: 500 });
  }

  try {
    // Use Edge Function instead of direct REST API
    const functionsUrl = `${supabaseUrl}/functions/v1/get-polaroid-by-slug`;
    const response = await fetch(
      `${functionsUrl}?slug=${encodeURIComponent(slug)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
        },
      }
    );

    const result = await response.json() as { data?: any; error?: string };

    if (!response.ok || result.error || !result.data) {
      return new Response('Polaroid not found', { status: 404 });
    }

    const polaroid = result.data;

    const profile = polaroid.profile || {};
    const handle = profile.handles?.[0]?.handle || 'dev';
    const primaryModel = profile.primaryModel?.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) || '';
    const plan = profile.planTier?.toUpperCase() || '';
    const isMax = profile.isMaxMode;

    const title = `@${handle}'s dev card`;
    const description = [primaryModel, plan, isMax ? 'MAX' : ''].filter(Boolean).join(' · ') || 'Cafe Cursor dev card';
    
    const host = request.headers.get('host') || 'cafe.cursor-sv.com';
    // Use pre-generated OG image if available, otherwise fall back to source image
    const ogImageUrl = polaroid.og_image_url || polaroid.source_image_url || polaroid.image_url || '';
    const pageUrl = `https://${host}/c/${slug}`;

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
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

