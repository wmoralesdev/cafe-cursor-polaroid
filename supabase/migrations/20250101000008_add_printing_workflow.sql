-- Add marked_for_printing columns to polaroids table
ALTER TABLE public.polaroids
  ADD COLUMN IF NOT EXISTS marked_for_printing BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS marked_for_printing_at TIMESTAMPTZ;

-- Create partial unique index to enforce "0 or 1 marked per user"
CREATE UNIQUE INDEX IF NOT EXISTS idx_polaroids_one_marked_per_user
  ON public.polaroids(user_id)
  WHERE marked_for_printing = true;

-- Create polaroid_print_events table
CREATE TABLE IF NOT EXISTS public.polaroid_print_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  polaroid_id UUID NOT NULL REFERENCES public.polaroids(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  printed_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  printed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for print events
CREATE INDEX IF NOT EXISTS idx_polaroid_print_events_user_id ON public.polaroid_print_events(user_id, printed_at DESC);
CREATE INDEX IF NOT EXISTS idx_polaroid_print_events_polaroid_id ON public.polaroid_print_events(polaroid_id, printed_at DESC);

-- Enable RLS on print events table
ALTER TABLE public.polaroid_print_events ENABLE ROW LEVEL SECURITY;

-- Policy: Deny all access by default
-- Edge functions use service role key, so they bypass RLS
-- This ensures only service role (via edge functions) can access print events
CREATE POLICY "Deny all access to print events"
  ON public.polaroid_print_events
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- RPC function: set_user_marked_for_printing
CREATE OR REPLACE FUNCTION public.set_user_marked_for_printing(
  target_polaroid_id UUID,
  requesting_user_id UUID,
  override BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_marked_id UUID;
  target_owner_id UUID;
BEGIN
  -- Verify ownership of target polaroid
  SELECT user_id INTO target_owner_id
  FROM public.polaroids
  WHERE id = target_polaroid_id;

  IF target_owner_id IS NULL THEN
    RAISE EXCEPTION 'Polaroid not found';
  END IF;

  IF target_owner_id != requesting_user_id THEN
    RAISE EXCEPTION 'Not authorized to mark this polaroid';
  END IF;

  -- Check if user already has a marked polaroid
  SELECT id INTO current_marked_id
  FROM public.polaroids
  WHERE user_id = requesting_user_id
    AND marked_for_printing = true
    AND id != target_polaroid_id
  LIMIT 1;

  -- If there's an existing marked polaroid and override is false, return error
  IF current_marked_id IS NOT NULL AND override = false THEN
    RETURN jsonb_build_object(
      'error', 'User already has a marked polaroid',
      'existingMarkedPolaroidId', current_marked_id
    );
  END IF;

  -- Clear any existing marked polaroids for this user
  UPDATE public.polaroids
  SET marked_for_printing = false,
      marked_for_printing_at = NULL
  WHERE user_id = requesting_user_id
    AND marked_for_printing = true;

  -- Mark the target polaroid
  UPDATE public.polaroids
  SET marked_for_printing = true,
      marked_for_printing_at = now()
  WHERE id = target_polaroid_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- RPC function: get_print_counts
CREATE OR REPLACE FUNCTION public.get_print_counts(user_ids UUID[])
RETURNS TABLE(user_id UUID, printed_count BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ppe.user_id,
    COUNT(*)::BIGINT as printed_count
  FROM public.polaroid_print_events ppe
  WHERE ppe.user_id = ANY(user_ids)
  GROUP BY ppe.user_id;
END;
$$;

