-- Networking swipe decisions
CREATE TABLE IF NOT EXISTS public.polaroid_swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  polaroid_id UUID NOT NULL REFERENCES public.polaroids(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  decision TEXT NOT NULL CHECK (decision IN ('pass', 'connect')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (polaroid_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_polaroid_swipes_user_created
  ON public.polaroid_swipes(user_id, created_at DESC);

ALTER TABLE public.polaroid_swipes ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own swipe history
CREATE POLICY "Users can select their own swipes"
  ON public.polaroid_swipes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own decisions
CREATE POLICY "Users can insert their own swipes"
  ON public.polaroid_swipes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

