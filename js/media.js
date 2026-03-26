/* =============================================
   KEHILÁ — media.js
   Subida de imágenes a Supabase Storage
   ============================================= */

async function uploadMedia(file, folder) {
  const sb = getSupabase();
  if (!sb || !file) return null;
  const ext = file.name.split('.').pop().toLowerCase();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await sb.storage.from('community-media').upload(path, file, { upsert: true });
  if (error) { console.warn('upload error:', error.message); return null; }
  const { data } = sb.storage.from('community-media').getPublicUrl(path);
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
