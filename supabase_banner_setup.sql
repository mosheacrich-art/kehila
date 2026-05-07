-- ═══════════════════════════════════════════════════════════
--  BANNER SETUP — ejecutar en Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════

-- 1. Añadir columnas nuevas a banner_slides
ALTER TABLE banner_slides ADD COLUMN IF NOT EXISTS layout text DEFAULT 'single';
ALTER TABLE banner_slides ADD COLUMN IF NOT EXISTS slots  jsonb;

-- 2. Crear bucket de Storage para imágenes del banner (público)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('banners', 'banners', true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO NOTHING;

-- 3. Política: lectura pública del bucket
CREATE POLICY "Banners public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'banners');

-- 4. Política: solo admin puede subir/borrar imágenes del banner
CREATE POLICY "Banners admin insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'banners'
    AND auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Banners admin delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'banners'
    AND auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );
