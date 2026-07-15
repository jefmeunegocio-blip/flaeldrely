ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS hero_eyebrow TEXT,
  ADD COLUMN IF NOT EXISTS hero_title TEXT,
  ADD COLUMN IF NOT EXISTS hero_subtitle TEXT,
  ADD COLUMN IF NOT EXISTS hero_primary_label TEXT,
  ADD COLUMN IF NOT EXISTS hero_secondary_label TEXT;