if (!window.__ksScriptLoaded) {
  window.__ksScriptLoaded = true;
  (function() {
    const STORAGE_TASKS = 'ks_tasks';
    const STORAGE_TIP = 'ks_tip';
    const SUPABASE_URL = 'https://gpsnklnubbqkntseqeqb.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwc25rbG51YmJxa250c2VxZXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MDQyNjgsImV4cCI6MjA5NzM4MDI2OH0.VICqdMCm4mknyBIoTdYbH-tQ7g408gpKl_zlVHPp7z4';
    const ADMIN_PASSWORD = 'Chemtrail42';

    const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
    if (!supabase) {
      console.warn('Supabase client nicht verfügbar; fallback auf lokalen Speicher.');
    }

const defaultTasks = [
  {
    id: 'task-1',
    title: '5 km Laufen',
    description: 'Laufe 5 Kilometer und beschreibe, wie du dich danach fühlst.',
    category: 'Fitness',
    validationMode: 'auto',
    expectedAnswerPattern: 'laufen',
    caseSensitive: false,
    whitespaceSensitive: false,
    reviewStatus: 'open',
    tipText: 'Beobachte deine Atmung während des Laufens und halte fest, wie sich die Strecke anfühlt.',
    taskPublishDate: '',
    taskPublishTime: '',
    tipScheduleDate: '',
    tipScheduleTime: '',
    solved: false,
    solution: '',
    solvedAt: null,
    taskFileName: '',
    solutionFileName: ''
  },
  {
    id: 'task-2',
    title: 'Handstand üben',
    description: 'Mache einen Handstand oder übe eine Variante gegen die Wand.',
    category: 'Balance',
    validationMode: 'manual',
    expectedAnswerPattern: '',
    caseSensitive: false,
    whitespaceSensitive: false,
    reviewStatus: 'open',
    tipText: 'Konzentriere dich auf die Handstellung und den Blick Richtung Boden.',
    taskPublishDate: '',
    taskPublishTime: '',
    tipScheduleDate: '',
    tipScheduleTime: '',
    solved: false,
    solution: '',
    solvedAt: null,
    taskFileName: '',
    solutionFileName: ''
  },
  {
    id: 'task-3',
    title: 'Neue Freunde treffen',
    description: 'Sprich mit einer neuen Person und notiere dein Gespräch.',
    category: 'Sozial',
    validationMode: 'manual',
    expectedAnswerPattern: '',
    caseSensitive: false,
    whitespaceSensitive: false,
    reviewStatus: 'open',
    tipText: 'Überlege dir fünf Fragen, die ein echtes Gespräch starten.',
    taskPublishDate: '',
    taskPublishTime: '',
    tipScheduleDate: '',
    tipScheduleTime: '',
    solved: false,
    solution: '',
    solvedAt: null,
    taskFileName: '',
    solutionFileName: ''
  },
  {
    id: 'task-4',
    title: 'Früh aufstehen',
    description: 'Stehe heute früher auf und plane einen produktiven Morgen.',
    category: 'Routine',
    validationMode: 'auto',
    expectedAnswerPattern: 'früh',
    caseSensitive: false,
    whitespaceSensitive: false,
    reviewStatus: 'open',
    tipText: 'Plane dein Frühstück im Voraus, um direkt mit Energie zu starten.',
    taskPublishDate: '',
    taskPublishTime: '',
    tipScheduleDate: '',
    tipScheduleTime: '',
    solved: false,
    solution: '',
    solvedAt: null,
    taskFileName: '',
    solutionFileName: ''
  },
  {
    id: 'task-5',
    title: 'Lesen statt scrollen',
    description: 'Lies 20 Minuten in einem Buch und fasse den Inhalt zusammen.',
    category: 'Wachstum',
    validationMode: 'manual',
    expectedAnswerPattern: '',
    caseSensitive: false,
    whitespaceSensitive: false,
    reviewStatus: 'open',
    tipText: 'Wähle einen Abschnitt, der dich neugierig macht, und notiere die wichtigsten Gedanken.',
    taskPublishDate: '',
    taskPublishTime: '',
    tipScheduleDate: '',
    tipScheduleTime: '',
    solved: false,
    solution: '',
    solvedAt: null,
    taskFileName: '',
    solutionFileName: ''
  },
  {
    id: 'task-6',
    title: 'Atomic Habits Puzzle',
    description: 'Hier ist der Binärcode: 01 1 111 11 00 1010 0000 01 1000 00 1 000. Jeder Block trennt einen Buchstaben. Nutze Morse: . → 0, - → 1. Leerzeichen und Groß-/Kleinschreibung sind egal.',
    category: 'Puzzle',
    validationMode: 'auto',
    expectedAnswerPattern: 'atomic habits',
    caseSensitive: false,
    whitespaceSensitive: false,
    reviewStatus: 'open',
    tipText: 'Solche Codes zeigen dir, wie aus Gewohnheiten kleine Zeichen werden können. Bleib aufmerksam bei der Umwandlung!',
    taskPublishDate: '',
    taskPublishTime: '',
    tipScheduleDate: '',
    tipScheduleTime: '',
    solved: false,
    solution: '',
    solvedAt: null,
    taskFileName: '',
    solutionFileName: ''
  }
];

const defaultTip = {
  text: 'Suche jede Woche eine kleine Aufgabe aus, die dich aus deiner Komfortzone bringt. Kleine Erfolgswellen bauen langfristig große Routine auf.',
  published_at: new Date().toISOString()
};

const state = {
  tasks: [],
  tip: null,
  adminLoggedIn: false,
  currentTaskId: null,
  currentMode: 'submit'
};

const elements = {
  taskList: document.getElementById('taskList'),
  solvedList: document.getElementById('solvedList'),
  taskCount: document.getElementById('taskCount'),
  solvedCount: document.getElementById('solvedCount'),
  completionBadge: document.getElementById('completionBadge'),
  weeklyTip: document.getElementById('weeklyTip'),
  tipPublished: document.getElementById('tipPublished'),
  tipDay: document.getElementById('tipDay'),
  todayActionList: document.getElementById('todayActionList'),
  todayTasksCard: document.getElementById('todayTasksCard'),
  adminContent: document.getElementById('adminContent'),
  solutionModal: document.getElementById('solutionModal'),
  modalTaskDescription: document.getElementById('modalTaskDescription'),
  solutionInput: document.getElementById('solutionInput'),
  solutionForm: document.getElementById('solutionForm'),
  validationChoice: document.getElementById('validationChoice'),
  solutionFileInput: document.getElementById('solutionFileInput'),
  solutionFileMeta: document.getElementById('solutionFileMeta'),
  closeModalButton: document.getElementById('closeModalButton')
};

function formatIsoDate(date) {
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}

function formatDateTime(dateStr, timeStr) {
  if (!dateStr && !timeStr) return '';
  const date = dateStr ? new Date(`${dateStr}T00:00:00`) : null;
  const day = date ? date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
  const time = timeStr ? timeStr : '';
  return [day, time].filter(Boolean).join(' um ');
}

function normalizeTask(task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    category: task.category || 'Alltag',
    validationMode: task.validationMode || task.validationmode || 'manual',
    expectedAnswerPattern: task.expectedAnswerPattern || task.expectedanswerpattern || '',
    caseSensitive: task.caseSensitive ?? task.casesensitive ?? false,
    whitespaceSensitive: task.whitespaceSensitive ?? task.whitespacesensitive ?? false,
    reviewStatus: task.reviewStatus || task.reviewstatus || 'open',
    tipText: task.tipText || task.tiptext || '',
    taskPublishDate: task.taskPublishDate || task.taskpublishdate || '',
    taskPublishTime: task.taskPublishTime || task.taskpublishtime || '',
    tipScheduleDate: task.tipScheduleDate || task.tipscheduledate || '',
    tipScheduleTime: task.tipScheduleTime || task.tipscheduletime || '',
    solved: task.solved ?? false,
    solution: task.solution || '',
    solvedAt: task.solvedAt || task.solvedat || null,
    taskFileName: task.taskFileName || task.taskfilename || '',
    solutionFileName: task.solutionFileName || task.solutionfilename || ''
  };
}

function normalizeTaskForDb(task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    category: task.category,
    validationmode: task.validationMode,
    expectedanswerpattern: task.expectedAnswerPattern,
    casesensitive: task.caseSensitive,
    whitespacesensitive: task.whitespaceSensitive,
    reviewstatus: task.reviewStatus,
    tiptext: task.tipText,
    taskpublishdate: task.taskPublishDate,
    taskpublishtime: task.taskPublishTime,
    tipscheduledate: task.tipScheduleDate,
    tipscheduletime: task.tipScheduleTime,
    solved: task.solved,
    solution: task.solution,
    solvedat: task.solvedAt,
    taskfilename: task.taskFileName,
    solutionfilename: task.solutionFileName
  };
}

function isTaskPublished(task) {
  if (!task.taskPublishDate) return true;
  const today = formatIsoDate(new Date());
  return task.taskPublishDate <= today;
}

function isTaskScheduled(task) {
  if (!task.taskPublishDate) return false;
  const today = formatIsoDate(new Date());
  return task.taskPublishDate > today;
}

function normalizeAnswer(value, options = {}) {
  let result = String(value || '');
  if (!options.whitespaceSensitive) {
    result = result.replace(/\s+/g, '');
  }
  if (!options.caseSensitive) {
    result = result.toLowerCase();
  }
  return result;
}

function mergeDefaultTasks(existingTasks) {
  const normalizedExisting = existingTasks.map(normalizeTask);
  const existingIds = new Set(normalizedExisting.map(task => task.id));
  const missingTasks = defaultTasks
    .map(normalizeTask)
    .filter(task => !existingIds.has(task.id));

  return [...normalizedExisting, ...missingTasks];
}

async function loadState() {
  const adminState = localStorage.getItem('ks_admin_logged_in');
  state.adminLoggedIn = adminState === 'true';

  if (!supabase) {
    const tasksFromStorage = localStorage.getItem(STORAGE_TASKS);
    state.tasks = tasksFromStorage ? mergeDefaultTasks(JSON.parse(tasksFromStorage)) : defaultTasks.map(normalizeTask);
    const tipFromStorage = localStorage.getItem(STORAGE_TIP);
    state.tip = tipFromStorage ? JSON.parse(tipFromStorage) : defaultTip;
    return;
  }

  try {
    const { data: tasksData, error: tasksError } = await supabase.from('tasks').select('*');
    if (tasksError) throw tasksError;

    if (!tasksData || tasksData.length === 0) {
      for (const task of defaultTasks) {
        await supabase.from('tasks').insert([task]);
      }
      state.tasks = defaultTasks.map(normalizeTask);
    } else {
      state.tasks = mergeDefaultTasks(tasksData);
    }

    const { data: tipData, error: tipError } = await supabase
      .from('tips')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);
    if (tipError) throw tipError;

    state.tip = (tipData && tipData.length > 0) ? tipData[0] : defaultTip;
  } catch (error) {
    console.error('Supabase Error, using fallback:', error);
    const tasksFromStorage = localStorage.getItem(STORAGE_TASKS);
    state.tasks = tasksFromStorage ? mergeDefaultTasks(JSON.parse(tasksFromStorage)) : defaultTasks.map(normalizeTask);
    const tipFromStorage = localStorage.getItem(STORAGE_TIP);
    state.tip = tipFromStorage ? JSON.parse(tipFromStorage) : defaultTip;
  }
}

async function saveTasks() {
  try {
    localStorage.setItem(STORAGE_TASKS, JSON.stringify(state.tasks));
  } catch (error) {
    console.warn('localStorage save fehlgeschlagen:', error);
  }

  if (!supabase) {
    return;
  }

  try {
    const dbTasks = state.tasks.map(normalizeTaskForDb);
    const { error } = await supabase
      .from('tasks')
      .upsert(dbTasks, { onConflict: 'id' });
    if (error) throw error;
  } catch (error) {
    console.error('Supabase save failed, using localStorage:', error);
  }
}

async function saveTip() {
  localStorage.setItem(STORAGE_TIP, JSON.stringify(state.tip));

  if (!supabase) {
    return;
  }

  try {
    const { error } = await supabase.from('tips').insert([state.tip]);
    if (error && error.code !== '23505') throw error; // 23505 = duplicate key
  } catch (error) {
    console.error('Supabase tip save failed, using localStorage:', error);
  }
}

async function refreshRemoteState() {
  if (!supabase) return;

  try {
    const { data: tasksData, error: tasksError } = await supabase.from('tasks').select('*');
    if (tasksError) throw tasksError;
    state.tasks = mergeDefaultTasks(tasksData);

    const { data: tipData, error: tipError } = await supabase
      .from('tips')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);
    if (tipError) throw tipError;

    state.tip = (tipData && tipData.length > 0) ? tipData[0] : defaultTip;
    renderTasks();
    renderSolved();
    renderTip();
    renderTodayActions();
  } catch (error) {
    console.warn('Realtime sync refresh failed:', error);
  }
}

function setupRealtimeSync() {
  if (!supabase || !supabase.channel) {
    window.addEventListener('focus', refreshRemoteState);
    return;
  }

  supabase
    .channel('public:tasks_tips_sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => refreshRemoteState())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tips' }, () => refreshRemoteState())
    .subscribe(status => {
      if (status === 'SUBSCRIBED') {
        console.log('Supabase Realtime sync aktiv');
      }
    });

  window.addEventListener('focus', refreshRemoteState);
}

function saveAdminState() {
  localStorage.setItem('ks_admin_logged_in', state.adminLoggedIn ? 'true' : 'false');
}

function displayStorageInfo() {
  if (!elements.adminContent) return;
  const taskCount = state.tasks.length;
  const stored = localStorage.getItem(STORAGE_TASKS);
  const infoHtml = `
    <div class="admin-box">
      <p class="small-note">Aktuelle Aufgaben im Speicher: ${taskCount}</p>
      <p class="small-note">localStorage-Eintrag: ${stored ? stored.length + ' Zeichen' : 'nicht gefunden'}</p>
      <p class="small-note">Protokoll: ${window.location.protocol}</p>
    </div>
  `;
  if (!elements.adminContent.innerHTML.includes('Aktuelle Aufgaben im Speicher')) {
    elements.adminContent.innerHTML += infoHtml;
  }
}

function getDisplayTip() {
  const today = new Date();
  const todayKey = formatIsoDate(today);
  const todaysTaskTip = state.tasks.find(task => task.tipScheduleDate === todayKey && task.tipText);
  if (todaysTaskTip) {
    return {
      text: todaysTaskTip.tipText,
      published_at: new Date().toISOString(),
      source: todaysTaskTip.title
    };
  }

  const upcomingTaskTip = state.tasks
    .filter(task => task.tipScheduleDate && task.tipText)
    .map(task => ({ ...task, date: new Date(task.tipScheduleDate) }))
    .filter(task => task.date >= today)
    .sort((a, b) => a.date - b.date)[0];

  if (upcomingTaskTip) {
    return {
      text: upcomingTaskTip.tipText,
      published_at: `${upcomingTaskTip.tipScheduleDate}T00:00:00`,
      source: upcomingTaskTip.title
    };
  }

  return { text: state.tip.text, published_at: state.tip.published_at, source: null };
}

function renderTasks() {
  if (!elements.taskList) return;
  elements.taskList.innerHTML = '';
  const published = state.tasks.filter(task => !task.solved && isTaskPublished(task));
  const scheduled = state.tasks.filter(task => !task.solved && isTaskScheduled(task));

  if (published.length === 0 && scheduled.length === 0) {
    elements.taskList.innerHTML = '<p style="color: var(--muted);">Heute gibt es keine veröffentlichten Aufgaben.</p>';
    updateStats();
    return;
  }

  if (published.length > 0) {
    published.forEach(task => {
      const isPendingReview = task.validationMode === 'manual' && task.reviewStatus === 'pending';
      const isRejected = task.reviewStatus === 'rejected';
      const validationText = task.validationMode === 'auto' ? 'Automatische Prüfung' : 'Manuelle Prüfung';
      const statusText = isPendingReview ? 'Warte auf Admin-Bestätigung' : isRejected ? 'Zuvor abgelehnt' : 'Noch nicht gelöst';
      const buttonLabel = isPendingReview ? 'Eingereichte Lösung anzeigen' : 'Lösung einreichen';
      const actionType = isPendingReview ? 'view' : 'open';

      const card = document.createElement('article');
      card.className = 'task-card';
      card.innerHTML = `
        <header>
          <div>
            <h3>${task.title}</h3>
            <div style="display:flex; gap:0.75rem; flex-wrap:wrap; align-items:center; margin-top: 0.55rem;">
              <span class="tag">${task.category}</span>
              <span class="badge">${validationText}</span>
              ${isRejected ? '<span class="status-pill rejected">Zuvor abgelehnt</span>' : ''}
            </div>
          </div>
          <button class="secondary" data-action="${actionType}" data-id="${task.id}">${buttonLabel}</button>
        </header>
        <p>${task.description}</p>
        ${task.tipText ? `<div class="file-meta"><strong>Mittwochstipp:</strong> ${task.tipText}</div>` : ''}
        ${task.validationMode === 'auto' ? `<div class="file-meta"><strong>Prüfoptionen:</strong> ${task.caseSensitive ? 'Case-sensitiv' : 'Case-insensitiv'}, ${task.whitespaceSensitive ? 'Whitespace-sensitiv' : 'Whitespace-insensitiv'}</div>` : ''}
        <div class="actions">
          <small class="small-note">${statusText}</small>
        </div>
      `;
      elements.taskList.appendChild(card);
    });
  }

  if (scheduled.length > 0) {
    const header = document.createElement('div');
    header.innerHTML = '<h3>Geplante Aufgaben</h3>';
    elements.taskList.appendChild(header);

    scheduled.forEach(task => {
      const card = document.createElement('article');
      card.className = 'task-card';
      card.innerHTML = `
        <header>
          <div>
            <h3>${task.title}</h3>
            <div style="display:flex; gap:0.75rem; flex-wrap:wrap; align-items:center; margin-top: 0.55rem;">
              <span class="tag">${task.category}</span>
              <span class="badge">Geplant</span>
            </div>
          </div>
        </header>
        <p>${task.description}</p>
        <div class="file-meta"><strong>Veröffentlichung:</strong> ${formatDate(task.taskPublishDate)} ${task.taskPublishTime ? 'um ' + task.taskPublishTime : ''}</div>
        ${task.tipText ? `<div class="file-meta"><strong>Mittwochstipp:</strong> ${task.tipText}</div>` : ''}
      `;
      elements.taskList.appendChild(card);
    });
  }

  updateStats();
}

function renderSolved() {
  if (!elements.solvedList) return;
  elements.solvedList.innerHTML = '';
  const solvedTasks = state.tasks.filter(task => task.solved);

  if (solvedTasks.length === 0) {
    elements.solvedList.innerHTML = '<p style="color: var(--muted);">Noch keine erledigten Aufgaben.</p>';
    return;
  }

  solvedTasks.forEach(task => {
    const card = document.createElement('article');
    card.className = 'task-card';
    card.innerHTML = `
      <header>
        <div>
          <h3>${task.title}</h3>
          <span class="tag">Erledigt</span>
        </div>
        <button class="secondary" data-action="view" data-id="${task.id}">Lösung ansehen</button>
      </header>
      <p>${task.description}</p>
      <div class="solution-box">
        <strong>Datum:</strong> ${formatDate(task.solvedAt)}
        <p style="margin: 0.75rem 0 0; color: var(--text);">${task.solution || '<span style="color: var(--muted);">Keine Beschreibung</span>'}</p>
      </div>
    `;
    elements.solvedList.appendChild(card);
  });
}

function renderTip() {
  if (!elements.weeklyTip || !elements.tipPublished || !elements.tipDay) return;

  const tip = getDisplayTip();
  elements.weeklyTip.textContent = tip.text;
  elements.tipPublished.textContent = tip.source
    ? `Geplanter Tipp für ${tip.source}: ${formatDate(new Date(tip.published_at))}`
    : `Zuletzt veröffentlicht: ${formatDate(new Date(tip.published_at))}`;
  elements.tipDay.textContent = isWednesday() ? 'Heute' : 'Mittwoch';
}

function renderTodayActions() {
  if (!elements.todayActionList) return;

  const openTasks = state.tasks.filter(task => !task.solved && isTaskPublished(task));
  if (openTasks.length === 0) {
    elements.todayActionList.innerHTML = '<li class="action-item">Keine offenen Aufgaben für heute.</li>';
    return;
  }

  elements.todayActionList.innerHTML = openTasks
    .map(task => `<li class="action-item" data-task-id="${task.id}">${task.title}</li>`)
    .join('');
}

function renderAdminContent() {
  if (!elements.adminContent) return;

  if (!state.adminLoggedIn) {
    elements.adminContent.innerHTML = `
      <div class="admin-box">
        <form id="adminLoginForm">
          <label for="adminPassword">Admin-Passwort</label>
          <input type="password" id="adminPassword" placeholder="Passwort eingeben" />
          <button type="submit">Admin einloggen</button>
        </form>
        <p class="small-note">Passwort: <strong>Chemtrail42</strong></p>
      </div>
    `;
    return;
  }

  const pendingTasks = state.tasks.filter(task => task.validationMode === 'manual' && task.reviewStatus === 'pending');
  const rejectedTasks = state.tasks.filter(task => task.reviewStatus === 'rejected' && !task.solved);

  const allTasks = state.tasks.map(task => {
    const status = task.solved ? 'Erledigt' : isTaskScheduled(task) ? 'Geplant' : 'Offen';
    const publishInfo = task.taskPublishDate ? `Geplant: ${formatDate(task.taskPublishDate)}${task.taskPublishTime ? ' um ' + task.taskPublishTime : ''}` : 'Sofort veröffentlicht';
    const validationText = task.validationMode === 'auto' ? 'Automatisch' : 'Manuell';

    return `
      <article class="task-card">
        <header>
          <div>
            <h3>${task.title}</h3>
            <div style="display:flex; gap:0.75rem; flex-wrap:wrap; align-items:center; margin-top: 0.55rem;">
              <span class="tag">${task.category}</span>
              <span class="badge">${status}</span>
            </div>
          </div>
        </header>
        <p>${task.description}</p>
        <div class="file-meta"><strong>${publishInfo}</strong></div>
        <div class="file-meta"><strong>Prüfmodus:</strong> ${validationText}</div>
        ${task.tipText ? `<div class="file-meta"><strong>Mittwochstipp:</strong> ${task.tipText}</div>` : ''}
      </article>
    `;
  }).join('');

  elements.adminContent.innerHTML = `
    <div class="admin-panel">
      <div class="admin-box">
        <form id="tipForm">
          <label for="tipText">Mittwochs-Tipp veröffentlichen</label>
          <textarea id="tipText" placeholder="Gib hier einen neuen Tipp ein..."></textarea>
          <button type="submit">Tipp speichern</button>
        </form>
      </div>

      <div class="admin-box">
        <form id="taskForm">
          <label for="taskTitle">Neue Aufgabe hinzufügen</label>
          <input type="text" id="taskTitle" placeholder="Titel der Aufgabe" />
          <input type="text" id="taskCategory" placeholder="Kategorie (z. B. Fitness, Soziales)" />
          <textarea id="taskDescription" placeholder="Beschreibung der Aufgabe"></textarea>
          <label for="taskPublishDate">Aufgabe planen (Sonntag)</label>
          <input type="date" id="taskPublishDate" />
          <label for="taskPublishTime">Uhrzeit für Veröffentlichung</label>
          <input type="time" id="taskPublishTime" />
          <label for="taskTipText">Mittwochstipp zur Aufgabe</label>
          <textarea id="taskTipText" placeholder="Beschreibe den Mittwochs-Tipp für diese Aufgabe"></textarea>
          <label for="taskTipDate">Tippplan (Mittwoch)</label>
          <input type="date" id="taskTipDate" />
          <label for="taskTipTime">Tipp-Uhrzeit</label>
          <input type="time" id="taskTipTime" />
          <label for="taskValidationMode">Prüfmodus</label>
          <select id="taskValidationMode">
            <option value="auto">Automatische Prüfung</option>
            <option value="manual">Manuelle Bestätigung</option>
          </select>
          <label for="expectedPattern">Musterlösung (nur automatisch)</label>
          <input type="text" id="expectedPattern" placeholder="z. B. laufen, handstand" />
          <div class="validation-options">
            <label><input type="checkbox" id="caseSensitive" /> Groß-/Kleinschreibung beachten</label>
            <label><input type="checkbox" id="whitespaceSensitive" /> Leerzeichen beachten</label>
          </div>
          <button type="submit">Aufgabe hinzufügen</button>
        </form>
      </div>

      <div class="admin-box">
        <button id="logoutButton" class="danger">Admin abmelden</button>
      </div>

      <div class="admin-box">
        <h2>Ausstehende Prüfungen</h2>
        ${pendingTasks.length === 0 ? '<p class="small-note">Keine ausstehend.</p>' : ''}
        <div class="task-list">
          ${pendingTasks.map(task => `
            <article class="task-card">
              <header>
                <div>
                  <h3>${task.title}</h3>
                </div>
              </header>
              <div class="solution-box">
                <strong>Eingereichte Lösung:</strong>
                <p>${task.solution || 'Keine Beschreibung'}</p>
              </div>
              <div class="actions">
                <button class="secondary" data-action="approve" data-id="${task.id}">Bestätigen</button>
                <button class="secondary" data-action="reject" data-id="${task.id}">Ablehnen</button>
              </div>
            </article>
          `).join('')}
        </div>
      </div>

      <div class="admin-box">
        <h2>Alle Aufgaben</h2>
        ${state.tasks.length === 0 ? '<p class="small-note">Keine Aufgaben vorhanden.</p>' : '<div class="task-list">' + allTasks + '</div>'}
      </div>
    </div>
  `;

  // Don't add event listeners here - they're added centrally in initializeEvents()
}

function updateStats() {
  if (!elements.taskCount || !elements.solvedCount || !elements.completionBadge) return;
  const total = state.tasks.filter(task => isTaskPublished(task)).length;
  const solved = state.tasks.filter(task => task.solved).length;
  elements.taskCount.textContent = total;
  elements.solvedCount.textContent = solved;

  const ratio = solved / Math.max(total, 1);
  if (ratio === 1) {
    elements.completionBadge.textContent = 'Alle Aufgaben gelöst';
  } else if (ratio >= 0.6) {
    elements.completionBadge.textContent = 'Stark unterwegs';
  } else if (solved > 0) {
    elements.completionBadge.textContent = 'Weiter so';
  } else {
    elements.completionBadge.textContent = 'Noch nicht begonnen';
  }
}

function openModal(taskId, mode = 'submit') {
  const task = state.tasks.find(item => item.id === taskId);
  if (!task || !elements.solutionModal || !elements.solutionForm || !elements.solutionInput) return;

  state.currentTaskId = taskId;
  state.currentMode = mode;
  elements.modalTaskDescription.textContent = task.description;
  elements.solutionInput.value = task.solution || '';
  elements.solutionInput.disabled = mode === 'view';

  const submitButton = elements.solutionForm.querySelector('button');
  submitButton.textContent = mode === 'view' ? 'Schließen' : 'Lösung speichern';

  if (elements.validationChoice) {
    if (task.validationMode === 'auto') {
      elements.validationChoice.style.display = 'grid';
      const autoOption = document.querySelector('input[name="solutionMode"][value="auto"]');
      if (autoOption) autoOption.checked = true;
    } else {
      elements.validationChoice.style.display = 'none';
    }
  }

  if (elements.solutionFileInput) {
    const fileWrapper = elements.solutionFileInput.closest('.file-input-wrapper');
    if (fileWrapper) {
      fileWrapper.style.display = mode === 'view' ? 'none' : 'grid';
    }
  }

  elements.solutionModal.classList.add('open');
}

function closeModal() {
  if (!elements.solutionModal) return;
  elements.solutionModal.classList.remove('open');
  state.currentTaskId = null;
  state.currentMode = 'submit';
  if (elements.solutionFileInput) elements.solutionFileInput.value = '';
}

async function handleSolutionForm(event) {
  event.preventDefault();
  if (state.currentMode === 'view') {
    closeModal();
    return;
  }

  const task = state.tasks.find(item => item.id === state.currentTaskId);
  if (!task) {
    closeModal();
    return;
  }

  const text = elements.solutionInput.value.trim();
  if (!text) {
    alert('Bitte gib eine Lösung ein.');
    return;
  }

  task.solution = text;

  const solutionMode = document.querySelector('input[name="solutionMode"]:checked')?.value || 'auto';

  if (task.validationMode === 'auto' && solutionMode === 'auto') {
    if (!task.expectedAnswerPattern) {
      alert('Diese Aufgabe benötigt eine Musterlösung.');
      return;
    }

    if (matchesPattern(text, task.expectedAnswerPattern, {
      caseSensitive: task.caseSensitive,
      whitespaceSensitive: task.whitespaceSensitive
    })) {
      task.solved = true;
      task.solvedAt = new Date().toISOString();
      task.reviewStatus = 'approved';
      await saveTasks();
      renderTasks();
      renderSolved();
      closeModal();
      return;
    }

    alert('Die Lösung stimmt nicht. Versuch es nochmal oder reiche eine individuelle Lösung ein.');
    return;
  }

  task.solved = false;
  task.reviewStatus = 'pending';
  await saveTasks();
  renderTasks();
  renderAdminContent();
  closeModal();
  alert('Deine Lösung wurde eingereicht.');
}

function handleAdminClick(event) {
  const button = event.target.closest('button');
  if (!button) return;
  const action = button.dataset.action;
  const id = button.dataset.id;

  if (action === 'open') openModal(id, 'submit');
  if (action === 'view') openModal(id, 'view');
}

function handleTodayActionClick(event) {
  const item = event.target.closest('.action-item');
  if (!item) return;
  const taskId = item.dataset.taskId;
  openModal(taskId, 'submit');
}

async function handleAdminAction(event) {
  const button = event.target.closest('button');
  if (!button) return;
  const action = button.dataset.action;
  const id = button.dataset.id;
  if (!action || !id) return;

  const task = state.tasks.find(item => item.id === id);
  if (!task) return;

  if (action === 'approve') {
    task.solved = true;
    task.solvedAt = new Date().toISOString();
    task.reviewStatus = 'approved';
    await saveTasks();
    renderTasks();
    renderSolved();
    renderAdminContent();
  }

  if (action === 'reject') {
    task.solved = false;
    task.reviewStatus = 'rejected';
    await saveTasks();
    renderTasks();
    renderAdminContent();
  }
}

function handleAdminLogin(event) {
  event.preventDefault();
  const passwordInput = document.getElementById('adminPassword');
  const value = passwordInput?.value.trim();

  if (value === ADMIN_PASSWORD) {
    state.adminLoggedIn = true;
    saveAdminState();
    renderAdminContent();
    if (passwordInput) passwordInput.value = '';
  } else {
    alert('Falsches Passwort.');
  }
}

function handleLogout() {
  state.adminLoggedIn = false;
  saveAdminState();
  renderAdminContent();
}

async function handleTipPublish(event) {
  event.preventDefault();
  const tipText = document.getElementById('tipText')?.value.trim();

  if (!tipText) {
    alert('Bitte gib einen Tipp ein.');
    return;
  }

  state.tip = {
    text: tipText,
    published_at: new Date().toISOString()
  };

  await saveTip();
  renderTip();
  const tipField = document.getElementById('tipText');
  if (tipField) tipField.value = '';
}

async function handleAddTask(event) {
  event.preventDefault();

  const title = document.getElementById('taskTitle')?.value.trim();
  const description = document.getElementById('taskDescription')?.value.trim();
  const category = document.getElementById('taskCategory')?.value.trim() || 'Alltag';
  const publishDate = document.getElementById('taskPublishDate')?.value || '';
  const publishTime = document.getElementById('taskPublishTime')?.value || '';
  const tipText = document.getElementById('taskTipText')?.value.trim() || '';
  const tipDate = document.getElementById('taskTipDate')?.value || '';
  const tipTime = document.getElementById('taskTipTime')?.value || '';
  const validationMode = document.getElementById('taskValidationMode')?.value || 'manual';
  const expectedAnswerPattern = document.getElementById('expectedPattern')?.value.trim() || '';
  const caseSensitive = document.getElementById('caseSensitive')?.checked || false;
  const whitespaceSensitive = document.getElementById('whitespaceSensitive')?.checked || false;

  if (publishDate) {
    const publishDay = new Date(`${publishDate}T00:00:00`).getDay();
    if (publishDay !== 0) {
      alert('Bitte wähle einen Sonntag.');
      return;
    }
  }

  if (tipDate) {
    const tipDayOfWeek = new Date(`${tipDate}T00:00:00`).getDay();
    if (tipDayOfWeek !== 3) {
      alert('Bitte wähle einen Mittwoch für den Tipp.');
      return;
    }
  }

  if (!title || !description) {
    alert('Titel und Beschreibung sind erforderlich.');
    return;
  }

  if (validationMode === 'auto' && !expectedAnswerPattern) {
    alert('Für automatische Aufgaben muss eine Musterlösung angegeben werden.');
    return;
  }

  const newTask = {
    id: `task-${Date.now()}`,
    title,
    description,
    category,
    validationMode,
    expectedAnswerPattern,
    caseSensitive,
    whitespaceSensitive,
    reviewStatus: 'open',
    tipText,
    taskPublishDate: publishDate,
    taskPublishTime: publishTime,
    tipScheduleDate: tipDate,
    tipScheduleTime: tipTime,
    solved: false,
    solution: '',
    solvedAt: null,
    taskFileName: '',
    solutionFileName: ''
  };

  state.tasks.push(normalizeTask(newTask));
  console.log('Neue Aufgabe hinzugefügt:', newTask);
  console.log('state.tasks nach push:', state.tasks.length);

  try {
    await saveTasks();
    localStorage.setItem(STORAGE_TASKS, JSON.stringify(state.tasks));
    console.log('Aufgabe gespeichert, localStorage Länge:', localStorage.getItem(STORAGE_TASKS)?.length);
  } catch (error) {
    console.error('Fehler beim Speichern:', error);
    alert('Fehler beim Speichern: ' + error.message);
  }

  renderTasks();
  renderSolved();
  renderAdminContent();
  event.target.reset();
  alert('Aufgabe hinzugefügt.');
}

function matchesPattern(text, pattern, options = {}) {
  if (!pattern) return false;
  const expected = normalizeAnswer(pattern, options);
  const actual = normalizeAnswer(text, options);
  return actual.includes(expected);
}

function formatDate(isoString) {
  if (!isoString) return '-';
  const date = new Date(isoString);
  return date.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
}

function isWednesday() {
  return new Date().getDay() === 3;
}

function initializeEvents() {
  if (elements.taskList) elements.taskList.addEventListener('click', handleAdminClick);
  if (elements.solvedList) elements.solvedList.addEventListener('click', handleAdminClick);
  if (elements.todayActionList) elements.todayActionList.addEventListener('click', handleTodayActionClick);
  if (elements.todayTasksCard) {
    elements.todayTasksCard.addEventListener('click', () => {
      elements.taskList?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  if (elements.solutionForm) elements.solutionForm.addEventListener('submit', handleSolutionForm);
  if (elements.closeModalButton) elements.closeModalButton.addEventListener('click', closeModal);
  if (elements.solutionModal) {
    elements.solutionModal.addEventListener('click', event => {
      if (event.target === elements.solutionModal) closeModal();
    });
  }
  if (elements.adminContent) {
    // Use event delegation for admin forms
    elements.adminContent.addEventListener('submit', (event) => {
      if (event.target.id === 'adminLoginForm') {
        event.preventDefault();
        handleAdminLogin(event);
      } else if (event.target.id === 'tipForm') {
        event.preventDefault();
        handleTipPublish(event);
      } else if (event.target.id === 'taskForm') {
        event.preventDefault();
        handleAddTask(event);
      }
    });
    // Use event delegation for admin buttons
    elements.adminContent.addEventListener('click', (event) => {
      const logoutBtn = event.target.closest('#logoutButton');
      if (logoutBtn) {
        handleLogout();
      } else {
        handleAdminAction(event);
      }
    });
  }
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && elements.solutionModal?.classList.contains('open')) closeModal();
  });
}

async function init() {
  await loadState();
  renderTasks();
  renderSolved();
  renderTip();
  renderTodayActions();
  renderAdminContent();
  initializeEvents();
  setupRealtimeSync();
  displayStorageInfo();
}

init();

  })();
}
