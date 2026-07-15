ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS testimonial_1_image_url TEXT,
  ADD COLUMN IF NOT EXISTS testimonial_2_image_url TEXT,
  ADD COLUMN IF NOT EXISTS testimonial_3_image_url TEXT;