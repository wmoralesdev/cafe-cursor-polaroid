-- Add source and referred_by columns for tracking
ALTER TABLE public.polaroids 
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'direct',
  ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES auth.users(id);

-- Add slug column for pretty URLs
ALTER TABLE public.polaroids 
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_polaroids_slug ON public.polaroids(slug);

-- Add RLS policy to allow public read access by slug
CREATE POLICY "Public can read polaroids by slug"
  ON public.polaroids
  FOR SELECT
  USING (slug IS NOT NULL);

