-- Drop the existing policy to recreate it with safer checks
DROP POLICY IF EXISTS "Public can read complete polaroids" ON public.polaroids;

-- Recreate policy with JSON type safety check
CREATE POLICY "Public can read complete polaroids"
  ON public.polaroids
  FOR SELECT
  USING (
    image_url IS NOT NULL 
    AND profile->'handles' IS NOT NULL 
    AND jsonb_typeof(profile->'handles') = 'array'
    AND jsonb_array_length(profile->'handles') > 0
    AND (profile->'handles'->0->>'handle') IS NOT NULL
    AND (profile->'handles'->0->>'handle') <> ''
  );
