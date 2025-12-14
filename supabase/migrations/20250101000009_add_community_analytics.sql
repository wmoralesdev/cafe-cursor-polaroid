-- Create function to get community analytics
-- Aggregates data from all public/complete polaroids (same filter as RLS policy)
CREATE OR REPLACE FUNCTION public.get_community_analytics()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  total_count BIGINT;
  max_mode_count BIGINT;
BEGIN
  -- Base query: filter to public/complete polaroids (same as RLS policy)
  WITH public_polaroids AS (
    SELECT profile
    FROM public.polaroids
    WHERE image_url IS NOT NULL 
      AND profile->'handles' IS NOT NULL 
      AND jsonb_array_length(profile->'handles') > 0
      AND (profile->'handles'->0->>'handle') IS NOT NULL
      AND (profile->'handles'->0->>'handle') <> ''
  ),
  plan_tiers AS (
    SELECT 
      profile->>'planTier' as key,
      COUNT(*)::BIGINT as count
    FROM public_polaroids
    WHERE profile->>'planTier' IS NOT NULL
    GROUP BY profile->>'planTier'
    ORDER BY count DESC
  ),
  favorite_features AS (
    SELECT 
      profile->>'favoriteFeature' as key,
      COUNT(*)::BIGINT as count
    FROM public_polaroids
    WHERE profile->>'favoriteFeature' IS NOT NULL
    GROUP BY profile->>'favoriteFeature'
    ORDER BY count DESC
    LIMIT 5
  ),
  primary_models AS (
    SELECT 
      profile->>'primaryModel' as key,
      COUNT(*)::BIGINT as count
    FROM public_polaroids
    WHERE profile->>'primaryModel' IS NOT NULL
    GROUP BY profile->>'primaryModel'
    ORDER BY count DESC
    LIMIT 5
  ),
  themes AS (
    SELECT 
      COALESCE(profile->>'polaroidTheme', 'classic') as key,
      COUNT(*)::BIGINT as count
    FROM public_polaroids
    GROUP BY COALESCE(profile->>'polaroidTheme', 'classic')
    ORDER BY count DESC
  ),
  cursor_since AS (
    SELECT 
      profile->>'cursorSince' as key,
      COUNT(*)::BIGINT as count
    FROM public_polaroids
    WHERE profile->>'cursorSince' IS NOT NULL
    GROUP BY profile->>'cursorSince'
    ORDER BY count DESC
  ),
  -- Extract all extras and count them
  extras_expanded AS (
    SELECT 
      jsonb_array_elements_text(profile->'extras') as extra
    FROM public_polaroids
    WHERE profile->'extras' IS NOT NULL 
      AND jsonb_typeof(profile->'extras') = 'array'
  ),
  top_extras AS (
    SELECT 
      extra as key,
      COUNT(*)::BIGINT as count
    FROM extras_expanded
    WHERE extra IS NOT NULL AND extra <> ''
    GROUP BY extra
    ORDER BY count DESC
    LIMIT 10
  )
  SELECT 
    jsonb_build_object(
      'total_cards', (SELECT COUNT(*)::BIGINT FROM public_polaroids),
      'max_mode_pct', CASE 
        WHEN (SELECT COUNT(*)::BIGINT FROM public_polaroids) > 0 
        THEN ROUND(
          (SELECT COUNT(*)::BIGINT FROM public_polaroids WHERE (profile->>'isMaxMode')::boolean = true)::numeric / 
          (SELECT COUNT(*)::BIGINT FROM public_polaroids)::numeric * 100, 
          1
        )
        ELSE 0
      END,
      'plan_tiers', (SELECT COALESCE(jsonb_agg(jsonb_build_object('key', key, 'count', count) ORDER BY count DESC), '[]'::jsonb) FROM plan_tiers),
      'favorite_features', (SELECT COALESCE(jsonb_agg(jsonb_build_object('key', key, 'count', count) ORDER BY count DESC), '[]'::jsonb) FROM favorite_features),
      'primary_models', (SELECT COALESCE(jsonb_agg(jsonb_build_object('key', key, 'count', count) ORDER BY count DESC), '[]'::jsonb) FROM primary_models),
      'themes', (SELECT COALESCE(jsonb_agg(jsonb_build_object('key', key, 'count', count) ORDER BY count DESC), '[]'::jsonb) FROM themes),
      'cursor_since', (SELECT COALESCE(jsonb_agg(jsonb_build_object('key', key, 'count', count) ORDER BY count DESC), '[]'::jsonb) FROM cursor_since),
      'top_extras', (SELECT COALESCE(jsonb_agg(jsonb_build_object('key', key, 'count', count) ORDER BY count DESC), '[]'::jsonb) FROM top_extras)
    )
  INTO result
  FROM public_polaroids
  LIMIT 1;

  RETURN result;
END;
$$;

-- Grant execute permission to anonymous users and public role (public access)
GRANT EXECUTE ON FUNCTION public.get_community_analytics() TO anon, public;

