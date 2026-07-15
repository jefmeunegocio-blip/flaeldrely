-- Update site_settings table with new contact details
UPDATE public.site_settings
SET
  phone = '(11) 91041-9073',
  email = 'elderlycuidados@hotmail.com',
  address = 'Rua: Cachoeira Poraquê, 281',
  whatsapp = '5511910419073',
  content = jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            COALESCE(content, '{}'::jsonb),
            '{contact,phone}',
            '"(11) 91041-9073"'::jsonb
          ),
          '{contact,email}',
          '"elderlycuidados@hotmail.com"'::jsonb
        ),
        '{contact,address}',
        '"Rua: Cachoeira Poraquê, 281"'::jsonb
      ),
      '{contact,whatsapp}',
      '"https://wa.me/5511910419073"'::jsonb
    ),
    '{contact,mapsUrl}',
    '"https://www.google.com/maps?q=Rua%20Cachoeira%20Poraqu%C3%AA%2C%20281&output=embed"'::jsonb
  ),
  draft_content = jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            COALESCE(draft_content, '{}'::jsonb),
            '{contact,phone}',
            '"(11) 91041-9073"'::jsonb
          ),
          '{contact,email}',
          '"elderlycuidados@hotmail.com"'::jsonb
        ),
        '{contact,address}',
        '"Rua: Cachoeira Poraquê, 281"'::jsonb
      ),
      '{contact,whatsapp}',
      '"https://wa.me/5511910419073"'::jsonb
    ),
    '{contact,mapsUrl}',
    '"https://www.google.com/maps?q=Rua%20Cachoeira%20Poraqu%C3%AA%2C%20281&output=embed"'::jsonb
  )
WHERE id = 1;
