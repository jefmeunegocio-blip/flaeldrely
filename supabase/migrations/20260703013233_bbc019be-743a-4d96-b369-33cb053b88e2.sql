ALTER TABLE public.site_settings 
  ADD COLUMN IF NOT EXISTS content jsonb,
  ADD COLUMN IF NOT EXISTS draft_content jsonb;