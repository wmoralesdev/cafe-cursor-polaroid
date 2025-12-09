-- Create polaroids table
CREATE TABLE IF NOT EXISTS public.polaroids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT,
  profile JSONB NOT NULL,
  title TEXT,
  provider TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_polaroids_user_id ON public.polaroids(user_id);
CREATE INDEX IF NOT EXISTS idx_polaroids_created_at ON public.polaroids(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_polaroids_is_published ON public.polaroids(is_published) WHERE is_published = true;

-- Enable RLS
ALTER TABLE public.polaroids ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own polaroids
CREATE POLICY "Users can view their own polaroids"
  ON public.polaroids
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own polaroids
CREATE POLICY "Users can insert their own polaroids"
  ON public.polaroids
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own polaroids
CREATE POLICY "Users can update their own polaroids"
  ON public.polaroids
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own polaroids
CREATE POLICY "Users can delete their own polaroids"
  ON public.polaroids
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Public can read published polaroids (for community feed)
CREATE POLICY "Public can read published polaroids"
  ON public.polaroids
  FOR SELECT
  USING (is_published = true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_polaroids_updated_at
  BEFORE UPDATE ON public.polaroids
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();







