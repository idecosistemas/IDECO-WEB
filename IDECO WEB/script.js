// ══════════════════════════════════════════
//  IDECO — script.js
// ══════════════════════════════════════════

// ── AUTH ──────────────────────────────────
const USERS = { Jhon: '2026' };
let currentUser = sessionStorage.getItem('ideco_user') || null;

function doLogin() {
  const u   = document.getElementById('loginUser').value.trim();
  const p   = document.getElementById('loginPass').value;
  const err = document.getElementById('loginError');

  if (USERS[u] && USERS[u] === p) {
    currentUser = u;
    sessionStorage.setItem('ideco_user', u);
    err.textContent = '';
    showApp();
  } else {
    err.textContent = 'Usuario o contraseña incorrectos.';
    document.getElementById('loginPass').value = '';
  }
}

function doLogout() {
  sessionStorage.removeItem('ideco_user');
  currentUser = null;
  activeId    = null;
  document.getElementById('loginUser').value    = '';
  document.getElementById('loginPass').value    = '';
  document.getElementById('loginError').textContent = '';
  document.getElementById('appShell').style.display   = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
}

function showApp() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('appShell').style.display    = 'flex';
  document.getElementById('userDot').textContent   = currentUser[0].toUpperCase();
  document.getElementById('userLabel').textContent = currentUser;
  renderList();
}

// Enter key en login
['loginUser', 'loginPass'].forEach(id =>
  document.getElementById(id).addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  })
);

// ── DATA ──────────────────────────────────
const COLORS = ['c0','c1','c2','c3','c4','c5','c6','c7'];

const SUBJECTS = [
  'Fundamentos de Programación',
  'Lógica y Algoritmos Aplicados',
  'Análisis de Requerimientos'
];

let students = JSON.parse(localStorage.getItem('ideco_students') || '[]');
let activeId = null;

// Datos de ejemplo si no hay nada guardado
if (students.length === 0) {
  students = [
    {
      id: uid(), name: 'Ana Torres', code: '2024-001', color: 'c0',
      grades: [
        { id: uid(), subject: 'Fundamentos de Programación',   value: 4.5, note: 'Parcial 1' },
        { id: uid(), subject: 'Lógica y Algoritmos Aplicados', value: 3.8, note: 'Taller' }
      ]
    },
    {
      id: uid(), name: 'Carlos Ruiz', code: '2024-002', color: 'c1',
      grades: [
        { id: uid(), subject: 'Análisis de Requerimientos',    value: 3.2, note: 'Trabajo grupal' },
        { id: uid(), subject: 'Fundamentos de Programación',   value: 4.0, note: 'Examen final' }
      ]
    },
    {
      id: uid(), name: 'Valentina Mora', code: '2024-003', color: 'c2',
      grades: [
        { id: uid(), subject: 'Lógica y Algoritmos Aplicados', value: 4.8, note: 'Proyecto' }
      ]
    }
  ];
  save();
}

// ── HELPERS ───────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function save() {
  localStorage.setItem('ideco_students', JSON.stringify(students));
}

function gradeColor(v) {
  if (v >= 4.5) return 'var(--success)';
  if (v >= 3.5) return 'var(--accent)';
  if (v >= 3.0) return 'var(--warn)';
  return 'var(--danger)';
}

function gradeLabel(v) {
  if (v >= 4.5) return 'Excelente';
  if (v >= 3.5) return 'Bueno';
  if (v >= 3.0) return 'Aceptable';
  return 'Insuficiente';
}

function avg(grades) {
  if (!grades.length) return '—';
  return (grades.reduce((a, g) => a + g.value, 0) / grades.length).toFixed(1);
}

function initials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

// ── SIDEBAR ───────────────────────────────
function renderList(filter = '') {
  const list  = document.getElementById('studentList');
  const count = document.getElementById('studentCount');
  const q = filter.toLowerCase();
  const filtered = students.filter(s => s.name.toLowerCase().includes(q));

  count.textContent = `${filtered.length} estudiante${filtered.length !== 1 ? 's' : ''}`;

  if (!filtered.length) {
    list.innerHTML = '<div class="no-results">Sin resultados</div>';
    return;
  }

  list.innerHTML = filtered.map(s => {
    const a       = avg(s.grades);
    const isActive = s.id === activeId;
    const color   = a !== '—' ? gradeColor(parseFloat(a)) : 'var(--muted)';
    return `
      <div class="student-item ${isActive ? 'active' : ''}" onclick="selectStudent('${s.id}')">
        <div class="avatar ${s.color}">${initials(s.name)}</div>
        <div class="student-info">
          <div class="student-name">${s.name}</div>
          <div class="student-avg">${s.grades.length} nota${s.grades.length !== 1 ? 's' : ''} · Prom. ${a}</div>
        </div>
        <div class="grade-badge" style="color:${color};background:${color}18">${a}</div>
      </div>`;
  }).join('');
}

// ── MAIN PANEL ────────────────────────────
function renderStudent(id) {
  const s = students.find(x => x.id === id);
  if (!s) return;

  const a      = avg(s.grades);
  const passed = s.grades.filter(g => g.value >= 3.0).length;

  document.getElementById('mainPanel').innerHTML = `
    <div class="profile-header">
      <div class="avatar-lg ${s.color}">${initials(s.name)}</div>
      <div class="profile-info">
        <h1>${s.name}</h1>
        <div class="profile-meta">ID: ${s.code || 'Sin código'} &nbsp;·&nbsp; ${s.grades.length} calificación${s.grades.length !== 1 ? 'es' : ''}</div>
      </div>
      <div class="profile-stats">
        <div class="stat-box">
          <div class="stat-value" style="color:${a !== '—' ? gradeColor(parseFloat(a)) : 'var(--muted)'}">${a}</div>
          <div class="stat-label">Promedio</div>
        </div>
        <div class="stat-box">
          <div class="stat-value" style="color:var(--success)">${passed}</div>
          <div class="stat-label">Aprobadas</div>
        </div>
        <div class="stat-box">
          <div class="stat-value" style="color:var(--danger)">${s.grades.length - passed}</div>
          <div class="stat-label">Reprobadas</div>
        </div>
      </div>
      <button class="btn btn-danger btn-sm" onclick="deleteStudent('${s.id}')">Eliminar</button>
    </div>

    <div class="section-title">Calificaciones registradas</div>
    ${s.grades.length === 0
      ? '<p style="color:var(--muted);font-size:.88rem;margin-bottom:1.5rem">Sin calificaciones aún. Agrega una abajo.</p>'
      : `<div class="grades-grid" id="gradesGrid">${s.grades.map(g => gradeCardHTML(g, false)).join('')}</div>`
    }

    <div class="section-title">Agregar calificación</div>
    <div class="add-grade-form">
      <div class="form-row">
        <div class="field">
          <label>Asignatura</label>
          <select id="gSubject">
            ${SUBJECTS.map(sub => `<option value="${sub}">${sub}</option>`).join('')}
          </select>
        </div>
        <div class="field" style="max-width:110px">
          <label>Nota (0–5)</label>
          <input type="number" id="gValue" min="0" max="5" step="0.1" placeholder="4.0">
        </div>
        <div class="field">
          <label>Observación (opcional)</label>
          <input type="text" id="gNote" placeholder="Ej: Parcial 1">
        </div>
        <div class="field" style="flex:0">
          <label>&nbsp;</label>
          <button class="btn btn-accent" onclick="addGrade('${s.id}')">Guardar</button>
        </div>
      </div>
    </div>
  `;
}

// ── GRADE CARD HTML ───────────────────────
function gradeCardHTML(g, editing) {
  const pct   = Math.min((g.value / 5) * 100, 100);
  const color = gradeColor(g.value);

  if (editing) {
    return `
      <div class="grade-card" id="gc-${g.id}" style="border-color:var(--accent2)">
        <div class="grade-subject">${g.subject}</div>
        <div class="grade-edit-row">
          <select id="es-${g.id}">
            ${SUBJECTS.map(s => `<option value="${s}" ${s === g.subject ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
          <input type="number" id="ev-${g.id}" value="${g.value}" min="0" max="5" step="0.1">
          <input type="text"   id="en-${g.id}" value="${g.note || ''}" placeholder="Observación">
          <button class="btn btn-accent btn-sm" onclick="saveEdit('${g.id}')">✓ Guardar</button>
          <button class="btn btn-ghost  btn-sm" onclick="cancelEdit('${g.id}')">✕</button>
        </div>
      </div>`;
  }

  return `
    <div class="grade-card" id="gc-${g.id}">
      <div class="grade-actions">
        <button class="icon-btn edit-btn" onclick="startEdit('${g.id}')" title="Editar">✎</button>
        <button class="icon-btn del-btn"  onclick="deleteGrade('${g.id}')" title="Eliminar">✕</button>
      </div>
      <div class="grade-subject">${g.subject}</div>
      <div class="grade-value-row">
        <div class="grade-number" style="color:${color}">${g.value.toFixed(1)}</div>
        <div class="grade-bar">
          <div class="grade-bar-fill" style="width:${pct}%;background:${color}"></div>
        </div>
      </div>
      <div class="grade-note">${gradeLabel(g.value)}${g.note ? ' · ' + g.note : ''}</div>
    </div>`;
}

// ── EDICIÓN INLINE ────────────────────────
function startEdit(gradeId) {
  const s = students.find(x => x.id === activeId);
  if (!s) return;
  const g    = s.grades.find(x => x.id === gradeId);
  const card = document.getElementById('gc-' + gradeId);
  if (g && card) card.outerHTML = gradeCardHTML(g, true);
}

function saveEdit(gradeId) {
  const s = students.find(x => x.id === activeId);
  if (!s) return;
  const g = s.grades.find(x => x.id === gradeId);
  if (!g) return;

  const newSubject = document.getElementById('es-' + gradeId).value;
  const newValue   = parseFloat(document.getElementById('ev-' + gradeId).value);
  const newNote    = document.getElementById('en-' + gradeId).value.trim();

  if (isNaN(newValue) || newValue < 0 || newValue > 5) {
    alert('Nota inválida. Debe estar entre 0 y 5.');
    return;
  }

  g.subject = newSubject;
  g.value   = newValue;
  g.note    = newNote;
  save();
  renderList(document.getElementById('searchInput').value);
  renderStudent(activeId);
}

function cancelEdit(gradeId) {
  const s    = students.find(x => x.id === activeId);
  if (!s) return;
  const g    = s.grades.find(x => x.id === gradeId);
  const card = document.getElementById('gc-' + gradeId);
  if (g && card) card.outerHTML = gradeCardHTML(g, false);
}

// ── ACCIONES ──────────────────────────────
function selectStudent(id) {
  activeId = id;
  renderList(document.getElementById('searchInput').value);
  renderStudent(id);
}

function addGrade(studentId) {
  const s = students.find(x => x.id === studentId);
  if (!s) return;

  const subject = document.getElementById('gSubject').value;
  const rawVal  = parseFloat(document.getElementById('gValue').value);
  const note    = document.getElementById('gNote').value.trim();

  if (isNaN(rawVal) || rawVal < 0 || rawVal > 5) {
    alert('Ingresa una nota válida entre 0 y 5.');
    return;
  }

  s.grades.push({ id: uid(), subject, value: rawVal, note });
  save();
  renderList(document.getElementById('searchInput').value);
  renderStudent(studentId);
}

function deleteGrade(gradeId) {
  const s = students.find(x => x.id === activeId);
  if (!s) return;
  if (!confirm('¿Eliminar esta calificación?')) return;
  s.grades = s.grades.filter(g => g.id !== gradeId);
  save();
  renderList(document.getElementById('searchInput').value);
  renderStudent(activeId);
}

function deleteStudent(id) {
  if (!confirm('¿Eliminar este estudiante y todas sus calificaciones?')) return;
  students = students.filter(s => s.id !== id);
  save();
  activeId = null;
  renderList();
  document.getElementById('mainPanel').innerHTML = `
    <div class="empty-state">
      <div class="icon">📋</div>
      <h2>Selecciona un estudiante</h2>
      <p>Haz clic en un nombre de la lista para ver su perfil y gestionar sus calificaciones.</p>
    </div>`;
}

// ── MODAL AGREGAR ESTUDIANTE ──────────────
document.getElementById('openModalBtn').onclick = () => {
  document.getElementById('modalBg').classList.add('open');
  document.getElementById('newName').focus();
};
document.getElementById('cancelModal').onclick = closeModal;
document.getElementById('modalBg').onclick = e => {
  if (e.target === e.currentTarget) closeModal();
};

function closeModal() {
  document.getElementById('modalBg').classList.remove('open');
  document.getElementById('newName').value = '';
  document.getElementById('newId').value   = '';
}

document.getElementById('saveStudent').onclick = () => {
  const name = document.getElementById('newName').value.trim();
  if (!name) { alert('El nombre es obligatorio.'); return; }

  const s = {
    id:     uid(),
    name,
    code:   document.getElementById('newId').value.trim(),
    color:  COLORS[students.length % COLORS.length],
    grades: []
  };
  students.push(s);
  save();
  closeModal();
  renderList();
  selectStudent(s.id);
};

// ── BUSCADOR ──────────────────────────────
document.getElementById('searchInput').addEventListener('input', e => renderList(e.target.value));

// ── EXPORTAR CSV ──────────────────────────
document.getElementById('exportBtn').onclick = () => {
  let csv = 'Estudiante,Código,Asignatura,Nota,Observación\n';
  students.forEach(s => {
    if (!s.grades.length) {
      csv += `"${s.name}","${s.code}","","",""\n`;
    } else {
      s.grades.forEach(g => {
        csv += `"${s.name}","${s.code}","${g.subject}","${g.value}","${g.note}"\n`;
      });
    }
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'ideco_calificaciones.csv'; a.click();
  URL.revokeObjectURL(url);
};

// ── INICIO ────────────────────────────────
if (currentUser) {
  showApp();
} else {
  document.getElementById('loginUser').focus();
}
