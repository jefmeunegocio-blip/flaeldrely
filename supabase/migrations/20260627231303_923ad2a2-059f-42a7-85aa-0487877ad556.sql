ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS testimonial_1_name text,
  ADD COLUMN IF NOT EXISTS testimonial_1_role text,
  ADD COLUMN IF NOT EXISTS testimonial_1_text text,
  ADD COLUMN IF NOT EXISTS testimonial_2_name text,
  ADD COLUMN IF NOT EXISTS testimonial_2_role text,
  ADD COLUMN IF NOT EXISTS testimonial_2_text text,
  ADD COLUMN IF NOT EXISTS testimonial_3_name text,
  ADD COLUMN IF NOT EXISTS testimonial_3_role text,
  ADD COLUMN IF NOT EXISTS testimonial_3_text text;