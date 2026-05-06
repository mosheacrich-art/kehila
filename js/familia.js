/**
 * familia.js — Gestión de vínculos familiares entre miembros
 * Storage: localStorage['kehila_family_links'] = { userId: [{id,name,initials,relation}] }
 */

const FAMILIA_KEY = 'kehila_family_links';

const RELACIONES_FAMILIA = [
  { value: 'conyuge',  label: 'Cónyuge' },
  { value: 'hijo',     label: 'Hijo/a' },
  { value: 'padre',    label: 'Padre / Madre' },
  { value: 'hermano',  label: 'Hermano/a' },
  { value: 'abuelo',   label: 'Abuelo/a' },
  { value: 'otro',     label: 'Otro familiar' },
];

// Miembros mock para búsqueda en prototipo
const MOCK_MIEMBROS_BUSQUEDA = [
  { id: 'user-moshe',   name: 'Moshe Acrich',      initials: 'MA', email: 'moshe@jabad.barcelona' },
  { id: 'user-sarah',   name: 'Sarah Cohen',        initials: 'SC', email: 'sarah@jabad.barcelona' },
  { id: 'user-david',   name: 'David Levy',         initials: 'DL', email: 'david@jabad.barcelona' },
  { id: 'user-rachel',  name: 'Rachel Goldberg',    initials: 'RG', email: 'rachel@jabad.barcelona' },
  { id: 'user-yosef',   name: 'Yosef Ben-David',    initials: 'YB', email: 'yosef@jabad.barcelona' },
  { id: 'user-miriam',  name: 'Miriam Peretz',      initials: 'MP', email: 'miriam@jabad.barcelona' },
  { id: 'user-aron',    name: 'Aron Steinberg',     initials: 'AS', email: 'aron@jabad.barcelona' },
  { id: 'user-leah',    name: 'Leah Friedman',      initials: 'LF', email: 'leah@jabad.barcelona' },
  { id: 'user-daniel',  name: 'Daniel Mizrahi',     initials: 'DM', email: 'daniel@jabad.barcelona' },
  { id: 'user-ruth',    name: 'Ruth Shapiro',       initials: 'RS', email: 'ruth@jabad.barcelona' },
];

function getFamilyLinks(userId) {
  try {
    const all = JSON.parse(localStorage.getItem(FAMILIA_KEY) || '{}');
    return all[userId] || [];
  } catch (e) { return []; }
}

function _saveFamilyLinks(userId, links) {
  try {
    const all = JSON.parse(localStorage.getItem(FAMILIA_KEY) || '{}');
    all[userId] = links;
    localStorage.setItem(FAMILIA_KEY, JSON.stringify(all));
  } catch (e) {}
}

function addFamilyLink(userId, member, relation) {
  const links = getFamilyLinks(userId);
  if (links.find(l => l.id === member.id)) return false;
  links.push({ id: member.id, name: member.name, initials: member.initials, relation });
  _saveFamilyLinks(userId, links);
  return true;
}

function removeFamilyLink(userId, memberId) {
  const links = getFamilyLinks(userId).filter(l => l.id !== memberId);
  _saveFamilyLinks(userId, links);
}

function searchMembers(query, excludeIds) {
  const q = (query || '').toLowerCase().trim();
  if (q.length < 2) return [];
  return MOCK_MIEMBROS_BUSQUEDA.filter(m =>
    !excludeIds.includes(m.id) &&
    (m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q))
  ).slice(0, 6);
}
