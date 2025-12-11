-- Add og_image_url column for storing pre-generated OG images
ALTER TABLE polaroids 
  ADD COLUMN IF NOT EXISTS og_image_url TEXT;

-- Add comment explaining the column
COMMENT ON COLUMN polaroids.og_image_url IS 'Pre-generated landscape OG image URL for social sharing';








