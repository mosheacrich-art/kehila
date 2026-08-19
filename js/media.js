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

function imagePicker(fileInputId, previewImgId, zoneId, placeholderId) {
  return `
    <div class="form-group">
      <label>Foto</label>
      <div id="${zoneId}" style="border:2px dashed var(--color-border);border-radius:10px;padding:20px;text-align:center;cursor:pointer;transition:border-color 0.15s;"
           onclick="document.getElementById('${fileInputId}').click()"
           onmouseover="this.style.borderColor='var(--color-primary)'"
           onmouseout="this.style.borderColor='var(--color-border)'">
        <img id="${previewImgId}" style="display:none;max-height:130px;border-radius:8px;margin-bottom:8px;max-width:100%;">
        <div id="${placeholderId}" style="color:var(--color-text-muted);font-size:0.85rem;">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:28px;height:28px;display:block;margin:0 auto 6px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>
          </svg>
          Toca para subir foto
        </div>
      </div>
      <input type="file" id="${fileInputId}" accept="image/*" style="display:none;">
    </div>`;
}
