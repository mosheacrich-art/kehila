/* =============================================
   KEHILÁ — registro.js
   Sistema de registro en 4 pasos
   ============================================= */

// ─── Estado del formulario ───────────────────
const REG = {
  step: 1,
  data: {
    // Paso 1
    nombre: '', apellidos: '', email: '', telefono: '',
    telefonoPrefijo: '+34', password: '',
    // Paso 2
    docTipo: '', docNumero: '', fechaNac: '',
    nacionalidad: '', paisNac: '', docFile: null, docFileName: '', docConfirmado: false,
    // Paso 3
    pais: '', ciudad: '', cp: '', direccion: '',
    comunidad: '', practica: '', familiar: false, familiarNombre: '',
    comoConocio: '',
    // Paso 4
    ck1: false, ck2: false, ck3: false, ck4: false
  }
};

// ─── Navegación entre pasos ──────────────────
function regNextStep() {
  if (!regValidateCurrentStep()) return;
  if (REG.step < 4) {
    REG.step++;
    regRenderStep();
  }
}

function regPrevStep() {
  if (REG.step > 1) {
    REG.step--;
    regRenderStep();
  }
}

function regGoToStep(n) {
  // Only allow going back, not skipping forward
  if (n < REG.step) {
    REG.step = n;
    regRenderStep();
  }
}

function regRenderStep() {
  // Show/hide step panels
  for (let i = 1; i <= 4; i++) {
    const panel = document.getElementById(`reg-step-${i}`);
    if (panel) panel.style.display = (i === REG.step) ? '' : 'none';
  }
  // Update progress bar
  regUpdateProgress();
  // Scroll to top of form
  const wrapper = document.querySelector('.auth-form-wrapper');
  if (wrapper) wrapper.scrollTop = 0;
}

function regUpdateProgress() {
  for (let i = 1; i <= 4; i++) {
    const circle = document.getElementById(`step-circle-${i}`);
    if (!circle) continue;
    const parent = circle.closest('.step');
    if (i < REG.step) {
      parent.className = 'step completed';
      circle.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>`;
    } else if (i === REG.step) {
      parent.className = 'step active';
      circle.textContent = i;
    } else {
      parent.className = 'step';
      circle.textContent = i;
    }
  }
  // Avanzar la franja dorada: (paso actual - 1) / 3 * 100%
  const fill = document.getElementById('steps-track-fill');
  if (fill) {
    fill.style.width = ((REG.step - 1) / 3 * 100) + '%';
  }
}

// ─── Validación por paso ─────────────────────
function regValidateCurrentStep() {
  switch (REG.step) {
    case 1: return regValidateStep1();
    case 2: return regValidateStep2();
    case 3: return regValidateStep3();
    case 4: return regValidateStep4();
  }
  return true;
}

function regShowFieldError(fieldId, errorId, msg) {
  const field = document.getElementById(fieldId);
  const err = document.getElementById(errorId);
  if (field) field.classList.add('error');
  if (err) { err.textContent = msg; err.style.display = ''; }
}

function regClearFieldError(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const err = document.getElementById(errorId);
  if (field) field.classList.remove('error');
  if (err) { err.textContent = ''; err.style.display = 'none'; }
}

function regValidateStep1() {
  let ok = true;
  // Save values
  REG.data.nombre = document.getElementById('r1-nombre')?.value.trim() || '';
  REG.data.apellidos = document.getElementById('r1-apellidos')?.value.trim() || '';
  REG.data.email = document.getElementById('r1-email')?.value.trim().toLowerCase() || '';
  REG.data.telefonoPrefijo = document.getElementById('r1-prefijo')?.value || '+34';
  REG.data.telefono = document.getElementById('r1-telefono')?.value.trim() || '';
  REG.data.password = document.getElementById('r1-password')?.value || '';
  const confirm = document.getElementById('r1-confirm')?.value || '';

  // Nombre: mínimo 2 palabras
  if (!REG.data.nombre || REG.data.nombre.split(/\s+/).length < 1 || REG.data.nombre.length < 2) {
    regShowFieldError('r1-nombre', 'r1-nombre-err', 'Introduce tu nombre completo');
    ok = false;
  } else { regClearFieldError('r1-nombre', 'r1-nombre-err'); }

  if (!REG.data.apellidos || REG.data.apellidos.length < 2) {
    regShowFieldError('r1-apellidos', 'r1-apellidos-err', 'Introduce tus apellidos');
    ok = false;
  } else { regClearFieldError('r1-apellidos', 'r1-apellidos-err'); }

  if (!REG.data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(REG.data.email)) {
    regShowFieldError('r1-email', 'r1-email-err', 'Introduce un email válido');
    ok = false;
  } else { regClearFieldError('r1-email', 'r1-email-err'); }

  if (!REG.data.telefono || REG.data.telefono.length < 6) {
    regShowFieldError('r1-telefono', 'r1-telefono-err', 'Introduce un teléfono válido');
    ok = false;
  } else { regClearFieldError('r1-telefono', 'r1-telefono-err'); }

  const pw = REG.data.password;
  const pwStrong = pw.length >= 6 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /\d/.test(pw) && /[^A-Za-z0-9]/.test(pw);
  if (!pw || pw.length < 6) {
    regShowFieldError('r1-password', 'r1-password-err', 'Mínimo 6 caracteres');
    ok = false;
  } else if (!pwStrong) {
    regShowFieldError('r1-password', 'r1-password-err', 'Incluye mayúscula, minúscula, número y símbolo');
    ok = false;
  } else { regClearFieldError('r1-password', 'r1-password-err'); }

  if (pw !== confirm) {
    regShowFieldError('r1-confirm', 'r1-confirm-err', 'Las contraseñas no coinciden');
    ok = false;
  } else if (confirm) { regClearFieldError('r1-confirm', 'r1-confirm-err'); }

  return ok;
}

function regValidateStep2() {
  let ok = true;
  REG.data.docTipo = document.getElementById('r2-doc-tipo')?.value || '';
  REG.data.docNumero = document.getElementById('r2-doc-num')?.value.trim() || '';
  const dia = document.getElementById('r2-dia')?.value || '';
  const mes = document.getElementById('r2-mes')?.value || '';
  const anio = document.getElementById('r2-anio')?.value || '';
  REG.data.fechaNac = `${anio}-${mes.padStart(2,'0')}-${dia.padStart(2,'0')}`;
  REG.data.nacionalidad = document.getElementById('r2-nacionalidad')?.value || '';
  REG.data.paisNac = document.getElementById('r2-pais-nac')?.value || '';

  if (!REG.data.docTipo) {
    regShowFieldError('r2-doc-tipo', 'r2-doc-tipo-err', 'Selecciona el tipo de documento');
    ok = false;
  } else { regClearFieldError('r2-doc-tipo', 'r2-doc-tipo-err'); }

  if (!REG.data.docNumero || REG.data.docNumero.length < 5) {
    regShowFieldError('r2-doc-num', 'r2-doc-num-err', 'Introduce el número de documento');
    ok = false;
  } else { regClearFieldError('r2-doc-num', 'r2-doc-num-err'); }

  if (!dia || !mes || !anio) {
    const err = document.getElementById('r2-fecha-err');
    if (err) { err.textContent = 'Introduce tu fecha de nacimiento completa'; err.style.display = ''; }
    ok = false;
  } else {
    const birthDate = new Date(parseInt(anio), parseInt(mes)-1, parseInt(dia));
    const age = Math.floor((Date.now() - birthDate) / (365.25*24*60*60*1000));
    const err = document.getElementById('r2-fecha-err');
    if (age < 13) {
      if (err) { err.textContent = 'Debes tener al menos 13 años'; err.style.display = ''; }
      ok = false;
    } else if (err) { err.textContent = ''; err.style.display = 'none'; }
  }

  if (!REG.data.nacionalidad) {
    regShowFieldError('r2-nacionalidad', 'r2-nac-err', 'Selecciona tu nacionalidad');
    ok = false;
  } else { regClearFieldError('r2-nacionalidad', 'r2-nac-err'); }

  if (!REG.data.paisNac) {
    regShowFieldError('r2-pais-nac', 'r2-paisnac-err', 'Selecciona tu país de nacimiento');
    ok = false;
  } else { regClearFieldError('r2-pais-nac', 'r2-paisnac-err'); }

  if (!REG.data.docFile) {
    const err = document.getElementById('r2-upload-err');
    if (err) { err.textContent = 'Sube tu documento de identidad'; err.style.display = ''; }
    ok = false;
  } else {
    const err = document.getElementById('r2-upload-err');
    if (err) { err.textContent = ''; err.style.display = 'none'; }
  }

  const ck = document.getElementById('r2-confirm-ck');
  if (!ck?.checked) {
    const err = document.getElementById('r2-ck-err');
    if (err) { err.textContent = 'Debes confirmar que los datos son verídicos'; err.style.display = ''; }
    ok = false;
  } else {
    const err = document.getElementById('r2-ck-err');
    if (err) { err.textContent = ''; err.style.display = 'none'; }
  }

  return ok;
}

function regValidateStep3() {
  let ok = true;
  REG.data.pais = document.getElementById('r3-pais')?.value || '';
  REG.data.ciudad = document.getElementById('r3-ciudad')?.value.trim() || '';
  REG.data.cp = document.getElementById('r3-cp')?.value.trim() || '';
  REG.data.direccion = document.getElementById('r3-direccion')?.value.trim() || '';
  REG.data.comunidad = document.getElementById('r3-comunidad')?.value || '';
  REG.data.practica = document.querySelector('input[name="practica"]:checked')?.value || '';
  REG.data.familiar = document.getElementById('r3-familiar-toggle')?.checked || false;
  REG.data.familiarNombre = document.getElementById('r3-familiar-nombre')?.value.trim() || '';
  REG.data.comoConocio = document.getElementById('r3-conocio')?.value || '';

  if (!REG.data.pais) {
    regShowFieldError('r3-pais', 'r3-pais-err', 'Selecciona tu país de residencia');
    ok = false;
  } else { regClearFieldError('r3-pais', 'r3-pais-err'); }

  if (!REG.data.ciudad || REG.data.ciudad.length < 2) {
    regShowFieldError('r3-ciudad', 'r3-ciudad-err', 'Introduce tu ciudad');
    ok = false;
  } else { regClearFieldError('r3-ciudad', 'r3-ciudad-err'); }

  if (!REG.data.cp || REG.data.cp.length < 4) {
    regShowFieldError('r3-cp', 'r3-cp-err', 'Introduce un código postal válido');
    ok = false;
  } else { regClearFieldError('r3-cp', 'r3-cp-err'); }

  if (!REG.data.direccion || REG.data.direccion.length < 5) {
    regShowFieldError('r3-direccion', 'r3-dir-err', 'Introduce tu dirección');
    ok = false;
  } else { regClearFieldError('r3-direccion', 'r3-dir-err'); }

  if (!REG.data.comunidad) {
    regShowFieldError('r3-comunidad', 'r3-com-err', 'Selecciona una comunidad');
    ok = false;
  } else { regClearFieldError('r3-comunidad', 'r3-com-err'); }

  if (!REG.data.practica) {
    const err = document.getElementById('r3-practica-err');
    if (err) { err.textContent = 'Selecciona una opción'; err.style.display = ''; }
    ok = false;
  } else {
    const err = document.getElementById('r3-practica-err');
    if (err) { err.textContent = ''; err.style.display = 'none'; }
  }

  if (!REG.data.comoConocio) {
    regShowFieldError('r3-conocio', 'r3-conocio-err', 'Cuéntanos cómo nos conociste');
    ok = false;
  } else { regClearFieldError('r3-conocio', 'r3-conocio-err'); }

  return ok;
}

function regValidateStep4() {
  REG.data.ck1 = document.getElementById('r4-ck1')?.checked || false;
  REG.data.ck2 = document.getElementById('r4-ck2')?.checked || false;
  REG.data.ck3 = document.getElementById('r4-ck3')?.checked || false;
  REG.data.ck4 = document.getElementById('r4-ck4')?.checked || false;
  if (!REG.data.ck1 || !REG.data.ck2 || !REG.data.ck3 || !REG.data.ck4) {
    const err = document.getElementById('r4-ck-err');
    if (err) { err.textContent = 'Debes aceptar todos los consentimientos para continuar'; err.style.display = ''; }
    return false;
  }
  const err = document.getElementById('r4-ck-err');
  if (err) { err.textContent = ''; err.style.display = 'none'; }
  return true;
}

// ─── Resumen paso 4 ──────────────────────────
function regRenderSummary() {
  const d = REG.data;
  const birthDate = d.fechaNac ? new Date(d.fechaNac) : null;
  const age = birthDate ? Math.floor((Date.now() - birthDate) / (365.25*24*60*60*1000)) : '—';
  const docMask = d.docNumero ? d.docNumero.slice(0,-3).replace(/[A-Za-z0-9]/g,'*') + d.docNumero.slice(-3) : '—';

  const el = document.getElementById('r4-summary');
  if (!el) return;
  el.innerHTML = `
    <div class="summary-section">
      <div class="summary-title">Datos personales</div>
      <div class="summary-row"><span>Nombre</span><strong>${d.nombre} ${d.apellidos}</strong></div>
      <div class="summary-row"><span>Email</span><strong>${d.email}</strong></div>
      <div class="summary-row"><span>Teléfono</span><strong>${d.telefonoPrefijo} ${d.telefono}</strong></div>
      <div class="summary-row"><span>Edad</span><strong>${age} años</strong></div>
    </div>
    <div class="summary-section">
      <div class="summary-title">Documento de identidad</div>
      <div class="summary-row"><span>Tipo</span><strong>${d.docTipo || '—'}</strong></div>
      <div class="summary-row"><span>Número</span><strong>${docMask}</strong></div>
      <div class="summary-row"><span>Archivo</span><strong style="display:flex;align-items:center;gap:6px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
        ${d.docFileName || 'No subido'}
      </strong></div>
    </div>
    <div class="summary-section">
      <div class="summary-title">Residencia</div>
      <div class="summary-row"><span>País</span><strong>${d.pais || '—'}</strong></div>
      <div class="summary-row"><span>Ciudad</span><strong>${d.ciudad || '—'}</strong></div>
      <div class="summary-row"><span>Código postal</span><strong>${d.cp || '—'}</strong></div>
      <div class="summary-row"><span>Comunidad</span><strong>${d.comunidad || '—'}</strong></div>
    </div>
  `;
}

// ─── Envío de solicitud ───────────────────────
async function regSubmit() {
  if (!regValidateStep4()) return;

  const btn = document.getElementById('r4-submit-btn');
  const label = document.getElementById('r4-submit-label');
  btn.disabled = true;
  label.innerHTML = `<span class="reg-spinner"></span> Enviando solicitud...`;

  await new Promise(r => setTimeout(r, 2000));

  // Generar número de solicitud
  const now = new Date();
  const ym = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}`;
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  const solicitudNum = `#KEH-${ym}-${rand}`;

  // Guardar en localStorage
  const solicitudData = {
    ...REG.data,
    docFile: null, // No serializar el File object
    solicitudNum,
    status: 'PENDING',
    timestamp: now.toISOString(),
    riesgo: 'amarillo' // Por defecto: revisar documento
  };
  delete solicitudData.password; // No guardar contraseña en claro

  const pending = JSON.parse(localStorage.getItem('kehila_pending') || '[]');
  pending.push(solicitudData);
  localStorage.setItem('kehila_pending', JSON.stringify(pending));

  // Mostrar confirmación
  regShowConfirmacion(solicitudNum);
}

function regShowConfirmacion(num) {
  // Ocultar todos los pasos
  for (let i = 1; i <= 4; i++) {
    const p = document.getElementById(`reg-step-${i}`);
    if (p) p.style.display = 'none';
  }
  const bar = document.getElementById('reg-progress-bar');
  if (bar) bar.style.display = 'none';

  const conf = document.getElementById('reg-confirmacion');
  if (conf) {
    conf.style.display = '';
    document.getElementById('conf-num').textContent = num;
    document.getElementById('conf-email').textContent = REG.data.email;
  }
}

// ─── Upload de documento ─────────────────────
function regInitUpload() {
  const zone = document.getElementById('r2-upload-zone');
  const input = document.getElementById('r2-file-input');
  if (!zone || !input) return;

  zone.addEventListener('click', () => input.click());
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('dragover');
    if (e.dataTransfer.files[0]) regHandleFile(e.dataTransfer.files[0]);
  });
  input.addEventListener('change', () => {
    if (input.files[0]) regHandleFile(input.files[0]);
  });
}

function regHandleFile(file) {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const err = document.getElementById('r2-upload-err');

  if (file.size > maxSize) {
    if (err) { err.textContent = 'El archivo no puede superar 5MB'; err.style.display = ''; }
    return;
  }
  const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowed.includes(file.type)) {
    if (err) { err.textContent = 'Solo se aceptan JPG, PNG o PDF'; err.style.display = ''; }
    return;
  }
  if (err) { err.textContent = ''; err.style.display = 'none'; }

  REG.data.docFile = file;
  REG.data.docFileName = file.name;

  const zone = document.getElementById('r2-upload-zone');
  zone.classList.add('has-file');

  const sizeMB = (file.size / 1024 / 1024).toFixed(2);

  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      zone.innerHTML = `
        <img src="${e.target.result}" style="max-height:120px;max-width:100%;border-radius:6px;margin-bottom:8px;" alt="Documento">
        <div style="font-size:13px;font-weight:500;color:var(--color-text);">${file.name}</div>
        <div style="font-size:11px;color:var(--color-text-muted);margin-bottom:8px;">${sizeMB} MB</div>
        <button type="button" onclick="regRemoveFile()" style="font-size:12px;color:var(--color-danger);background:none;border:none;cursor:pointer;text-decoration:underline;">Eliminar y cambiar</button>
      `;
    };
    reader.readAsDataURL(file);
  } else {
    zone.innerHTML = `
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1B2E5E" stroke-width="1.5" style="margin-bottom:8px;"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/></svg>
      <div style="font-size:13px;font-weight:500;color:var(--color-text);">${file.name}</div>
      <div style="font-size:11px;color:var(--color-text-muted);margin-bottom:8px;">${sizeMB} MB · PDF</div>
      <button type="button" onclick="regRemoveFile()" style="font-size:12px;color:var(--color-danger);background:none;border:none;cursor:pointer;text-decoration:underline;">Eliminar y cambiar</button>
    `;
  }
}

function regRemoveFile() {
  REG.data.docFile = null;
  REG.data.docFileName = '';
  const zone = document.getElementById('r2-upload-zone');
  zone.classList.remove('has-file');
  zone.innerHTML = `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color:var(--color-text-light);margin-bottom:8px;"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"/></svg>
    <div class="upload-title">Sube tu documento de identidad</div>
    <div class="upload-subtitle">DNI · NIE · Pasaporte</div>
    <div style="font-size:12px;color:var(--color-text-light);margin-top:4px;">Arrastra el archivo aquí o haz clic para seleccionar</div>
    <div class="upload-formats" style="margin-top:6px;">JPG, PNG o PDF · Máx. 5MB</div>
    <input type="file" id="r2-file-input" accept=".jpg,.jpeg,.png,.pdf" style="display:none;">
  `;
  const newInput = document.getElementById('r2-file-input');
  if (newInput) newInput.addEventListener('change', () => { if (newInput.files[0]) regHandleFile(newInput.files[0]); });
}

// ─── Indicador de fortaleza de contraseña ────
function regInitPasswordStrength() {
  const input = document.getElementById('r1-password');
  const confirm = document.getElementById('r1-confirm');
  if (!input) return;

  input.addEventListener('input', function () {
    const pw = this.value;
    const container = document.getElementById('r1-strength-bar');
    const text = document.getElementById('r1-strength-text');
    if (!container || !text) return;

    if (!pw) { container.parentElement.style.display = 'none'; return; }
    container.parentElement.style.display = '';

    let score = 0;
    if (pw.length >= 6) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    const levels = ['', 'Débil', 'Aceptable', 'Buena', 'Excelente'];
    const colors = ['', '#ef4444', '#f97316', '#d97706', '#16a34a'];

    container.className = `password-strength-bar strength-${score}`;
    text.textContent = levels[score] || '';
    text.style.color = colors[score] || '';
    container.innerHTML = `
      <div class="strength-segment"></div>
      <div class="strength-segment"></div>
      <div class="strength-segment"></div>
      <div class="strength-segment"></div>
    `;
  });

  if (confirm) {
    confirm.addEventListener('input', function () {
      const pw = document.getElementById('r1-password')?.value || '';
      const icon = document.getElementById('r1-confirm-check');
      if (icon) icon.style.display = (this.value && this.value === pw) ? '' : 'none';
    });
  }
}

// ─── Toggle familiar ─────────────────────────
function regToggleFamiliar() {
  const toggle = document.getElementById('r3-familiar-toggle');
  const field = document.getElementById('r3-familiar-field');
  if (field) field.style.display = toggle?.checked ? '' : 'none';
}

// ─── Modales de términos ─────────────────────
function openTermsModal(type) {
  const modal = document.getElementById('terms-modal');
  const title = document.getElementById('terms-modal-title');
  const body = document.getElementById('terms-modal-body');
  if (!modal) return;

  if (type === 'terminos') {
    title.textContent = 'Términos de Uso y Normas de Convivencia';
    body.innerHTML = `
      <p><strong>Artículo 1 — Objeto y ámbito de aplicación</strong><br>
      Los presentes Términos de Uso regulan el acceso y utilización de la plataforma Kehilá, destinada exclusivamente a miembros de comunidades judías en España y sus familias.</p>
      <p><strong>Artículo 2 — Requisitos de membresía</strong><br>
      El acceso requiere ser judío/a, familiar directo de un miembro, o encontrarse en proceso de guiur (conversión). La solicitud es revisada manualmente por la administración de cada comunidad.</p>
      <p><strong>Artículo 3 — Normas de conducta</strong><br>
      Los miembros se comprometen a mantener un comportamiento respetuoso, acorde con los valores de la comunidad judía y las normas de convivencia establecidas por cada kehilá.</p>
      <p><strong>Artículo 4 — Uso aceptable de la plataforma</strong><br>
      Queda prohibido el uso de la plataforma para actividades contrarias a la ley, la difusión de contenido ofensivo o antisemita, y la suplantación de identidad.</p>
      <p><strong>Artículo 5 — Confidencialidad</strong><br>
      La información de los miembros es estrictamente confidencial y no será compartida fuera del ámbito de la comunidad.</p>
      <p><strong>Artículo 6 — Propiedad intelectual</strong><br>
      Todo el contenido de la plataforma es propiedad de Kehilá Comunidades o de sus respectivos autores.</p>
      <p><strong>Artículo 7 — Causas de suspensión</strong><br>
      El incumplimiento de estos términos puede resultar en la suspensión temporal o permanente del acceso.</p>
      <p><strong>Artículo 8 — Legislación aplicable</strong><br>
      Estos términos se rigen por la legislación española y el Reglamento General de Protección de Datos (RGPD) de la Unión Europea.</p>
    `;
  } else {
    title.textContent = 'Política de Privacidad';
    body.innerHTML = `
      <p><strong>Responsable del tratamiento:</strong> Kehilá Comunidades · privacidad@kehila.app</p>
      <p><strong>Finalidad:</strong> Gestión de membresía comunitaria, comunicación de eventos y actividades de la comunidad judía.</p>
      <p><strong>Base legal:</strong> Consentimiento explícito del interesado (Art. 6.1.a RGPD).</p>
      <p><strong>Datos recogidos:</strong> Nombre, apellidos, email, teléfono, documento de identidad, fecha de nacimiento, nacionalidad, domicilio. Estos datos son necesarios para verificar la identidad y gestionar el acceso.</p>
      <p><strong>Plazo de conservación:</strong> Los datos se conservan durante la vigencia de la membresía y 2 años adicionales tras la baja, salvo obligación legal.</p>
      <p><strong>Derechos ARCO:</strong> Puedes ejercer tus derechos de Acceso, Rectificación, Cancelación y Oposición escribiendo a privacidad@kehila.app con copia de tu documento de identidad.</p>
      <p><strong>Transferencias internacionales:</strong> No se realizan transferencias de datos fuera del Espacio Económico Europeo.</p>
      <p><strong>Delegado de Protección de Datos:</strong> privacidad@kehila.app</p>
    `;
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeTermsModal() {
  const modal = document.getElementById('terms-modal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

// ─── Año de nacimiento select ─────────────────
function regBuildYearSelect() {
  const select = document.getElementById('r2-anio');
  if (!select) return;
  const current = new Date().getFullYear();
  select.innerHTML = '<option value="">Año</option>';
  for (let y = current - 13; y >= current - 100; y--) {
    select.innerHTML += `<option value="${y}">${y}</option>`;
  }
}

// ─── Init ─────────────────────────────────────
function regInit() {
  regRenderStep();
  regInitUpload();
  regInitPasswordStrength();
  regBuildYearSelect();

  const diaSelect = document.getElementById('r2-dia');
  if (diaSelect) {
    diaSelect.innerHTML = '<option value="">Día</option>';
    for (let d = 1; d <= 31; d++) diaSelect.innerHTML += `<option value="${d}">${d}</option>`;
  }
}
