-- Drop the RLS policy FIRST (before dropping the column it depends on)
DROP POLICY IF EXISTS "Public can read published polaroids" ON public.polaroids;

-- Drop the old index on is_published
DROP INDEX IF EXISTS idx_polaroids_is_published;

-- Now we can safely drop the is_published column
ALTER TABLE public.polaroids DROP COLUMN IF EXISTS is_published;

CREATE POLICY "Public can read complete polaroids"
  ON public.polaroids
  FOR SELECT
  USING (
    image_url IS NOT NULL 
    AND profile->'handles' IS NOT NULL 
    AND jsonb_array_length(profile->'handles') > 0
    AND (profile->'handles'->0->>'handle') IS NOT NULL
    AND (profile->'handles'->0->>'handle') <> ''
  );


