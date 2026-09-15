/* =============================================
   KEHILÁ — media.js
   Subida de imágenes a Supabase Storage
   ============================================= */

/**
 * Redimensiona/comprime una imagen en el navegador antes de subirla, para
 * no mandar fotos de cámara sin tocar (varios MB) que luego tardan en
 * cargar en las tarjetas. Si no es una imagen redimensionable (gif, ya
 * pequeña, o falla el proceso) devuelve el archivo original tal cual.
 * @param {File} file
 * @param {number} maxDim - Lado máximo en píxeles
 * @param {number} quality - Calidad JPEG 0-1
 * @returns {Promise<File>}
 */
async function resizeImageFile(file, maxDim = 1400, quality = 0.85) {
  if (!file.type || !file.type.startsWith('image/') || file.type === 'image/gif') return file;
  try {
    const bitmap = await createImageBitmap(file);
    let { width, height } = bitmap;
    if (width <= maxDim && height <= maxDim) { bitmap.close?.(); return file; }
    const scale = Math.min(maxDim / width, maxDim / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' });
  } catch (e) { return file; }
}

async function uploadMedia(file, folder) {
  const sb = getSupabase();
  if (!sb || !file) return null;
  const upFile = await resizeImageFile(file);
  const ext = upFile.name.split('.').pop().toLowerCase();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await sb.storage.from('community media').upload(path, upFile, { upsert: true, contentType: upFile.type || undefined });
  if (error) { console.warn('upload error:', error.message); return null; }
  const { data } = sb.storage.from('community media').getPublicUrl(path);
  return data.publicUrl;
}

function initImagePicker(fileInputId, previewImgId, placeholderId) {
  const input = document.getElementById(fileInputId);
  if (!input) return;
  input.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const preview = document.getElementById(previewImgId);
      const ph = document.getElementById(placeholderId);
      if (preview) { preview.src = e.target.result; preview.style.display = 'block'; }
      if (ph) ph.style.display = 'none';
    };
    reader.readAsDataURL(file);
  });
}
