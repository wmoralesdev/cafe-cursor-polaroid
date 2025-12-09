-- Create storage bucket for polaroid images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'polaroids',
  'polaroids',
  true,
  5242880, -- 5MB limit
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for polaroids bucket
-- Policy: Authenticated users can upload their own images
CREATE POLICY "Users can upload polaroid images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'polaroids' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Authenticated users can update their own images
CREATE POLICY "Users can update their own polaroid images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'polaroids' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Public can read all images
CREATE POLICY "Public can read polaroid images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'polaroids');






