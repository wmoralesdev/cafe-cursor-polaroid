-- Create polaroid_likes table
CREATE TABLE IF NOT EXISTS public.polaroid_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  polaroid_id UUID NOT NULL REFERENCES public.polaroids(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  liker_name TEXT,
  liker_avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(polaroid_id, user_id)
);

-- Create indexes for polaroid_likes
CREATE INDEX IF NOT EXISTS idx_polaroid_likes_polaroid_id ON public.polaroid_likes(polaroid_id);
CREATE INDEX IF NOT EXISTS idx_polaroid_likes_user_id ON public.polaroid_likes(user_id);

-- Enable RLS on polaroid_likes
ALTER TABLE public.polaroid_likes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view likes (public)
CREATE POLICY "Anyone can view likes"
  ON public.polaroid_likes
  FOR SELECT
  USING (true);

-- Policy: Logged-in users can insert their own likes
CREATE POLICY "Users can insert their own likes"
  ON public.polaroid_likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own likes
CREATE POLICY "Users can delete their own likes"
  ON public.polaroid_likes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create polaroid_like_notifications table
CREATE TABLE IF NOT EXISTS public.polaroid_like_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  polaroid_id UUID NOT NULL REFERENCES public.polaroids(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  actor_name TEXT,
  actor_avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ
);

-- Create indexes for polaroid_like_notifications
CREATE INDEX IF NOT EXISTS idx_polaroid_like_notifications_recipient_created 
  ON public.polaroid_like_notifications(recipient_id, created_at DESC);

-- Enable RLS on polaroid_like_notifications
ALTER TABLE public.polaroid_like_notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Recipients can view their own notifications
CREATE POLICY "Recipients can view their own notifications"
  ON public.polaroid_like_notifications
  FOR SELECT
  USING (auth.uid() = recipient_id);

-- Policy: Recipients can update their own notifications (to mark as read)
CREATE POLICY "Recipients can update their own notifications"
  ON public.polaroid_like_notifications
  FOR UPDATE
  USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

-- Policy: Service role can insert notifications (via Edge functions)
-- Note: Service role bypasses RLS, so this is mainly for documentation
-- Edge functions use service role key, so they can insert freely










