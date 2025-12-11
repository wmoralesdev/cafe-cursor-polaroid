-- Add source_image_url column for storing original uploaded photo
ALTER TABLE public.polaroids 
  ADD COLUMN IF NOT EXISTS source_image_url TEXT;

-- Backfill existing rows: set source_image_url = image_url for existing records
UPDATE public.polaroids 
  SET source_image_url = image_url 
  WHERE source_image_url IS NULL AND image_url IS NOT NULL;













