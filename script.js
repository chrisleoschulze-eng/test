if (!window.__ksScriptLoaded) {
  window.__ksScriptLoaded = true;
  (function() {
    const STORAGE_TASKS = 'ks_tasks';
    const STORAGE_TIP = 'ks_tip';
    const STORAGE_ADMIN_PASSWORD = 'ks_admin_password';
    const STORAGE_CHAT_USERS = 'ks_chat_users';
    const STORAGE_CHAT_MESSAGES = 'ks_chat_messages';
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
  },
  {
    id: 'task-7',
    title: 'Überzeuge die KI',
    description: 'Find out what "Chuck Norris wishes" <a href="aichat.html" target="_blank" style="color:var(--accent);">→ Zum Chatbot</a>',
    category: 'Puzzle',
    validationMode: 'auto',
    expectedAnswerPattern: '73',
    caseSensitive: false,
    whitespaceSensitive: true,
    reviewStatus: 'open',
    tipText: 'Manchmal hilft Logik, manchmal Einfühlungsvermögen – und manchmal musst du eine KI von deiner Vertrauenswürdigkeit überzeugen.',
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
  adminPassword: ADMIN_PASSWORD,
  chatUsers: [],
  chatMessages: [],
  credentialsUnlocked: false,
  currentTaskId: null,
  currentMode: 'submit'
};

const syncState = {
  status: supabase ? 'connecting' : 'local-only',
  message: ''
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
  closeModalButton: document.getElementById('closeModalButton'),
  syncStatus: document.getElementById('syncStatus')
};

function renderSyncStatus() {
  if (!elements.syncStatus) return;

  const textMap = {
    connecting: 'Synchronisiere mit Server...',
    connected: 'Server verbunden und synchron',
    fallback: 'Offline-Fallback aktiv (lokal zwischengespeichert)',
    'local-only': 'Server nicht verfügbar (nur lokaler Modus)'
  };

  const classMap = {
    connecting: 'is-connecting',
    connected: 'is-connected',
    fallback: 'is-fallback',
    'local-only': 'is-local-only'
  };

  elements.syncStatus.className = `sync-status ${classMap[syncState.status] || 'is-connecting'}`;
  elements.syncStatus.textContent = syncState.message || textMap[syncState.status] || textMap.connecting;
}

function setSyncStatus(status, message = '') {
  syncState.status = status;
  syncState.message = message;
  renderSyncStatus();
}

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
  const normalized = {
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
    solutionFileName: task.solutionFileName || task.solutionfilename || '',
    solutionFileData: task.solutionFileData || task.solutionfiledata || ''
  };

  if (normalized.id === 'task-7') {
    normalized.expectedAnswerPattern = '73';
    normalized.whitespaceSensitive = false;
    if (!normalized.description || normalized.description.toLowerCase().includes('ueberzeuge') || normalized.description.toLowerCase().includes('überzeuge') || normalized.description.toLowerCase().includes('higgsbo')) {
      normalized.description = 'Find out what "Chuck Norris wishes" <a href="aichat.html" target="_blank" style="color:var(--accent);">→ Zum Chatbot</a>';
    }
  }

  return normalized;
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
    solutionfilename: task.solutionFileName,
    solutionfiledata: task.solutionFileData
  };
}

function normalizeChatUser(user) {
  return {
    id: user.id,
    username: user.username || '',
    password: user.password || '',
    approved: Boolean(user.approved),
    is_admin: Boolean(user.is_admin || user.isadmin)
  };
}

function normalizeChatMessage(message) {
  return {
    id: message.id,
    username: message.username || '',
    message: message.message || '',
    fileName: message.fileName || message.file_name || '',
    fileData: message.fileData || message.file_data || '',
    createdAt: message.createdAt || message.created_at || null
  };
}

function normalizeAdminLikeName(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/[0]/g, 'o')
    .replace(/[1]/g, 'i')
    .replace(/[3]/g, 'e')
    .replace(/[4]/g, 'a')
    .replace(/[5]/g, 's');
}

function isAdminLikeUsername(value) {
  const normalized = normalizeAdminLikeName(value);
  if (!normalized) return false;
  return normalized.includes('admin') || normalized.startsWith('adm') || normalized === 'administrator';
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

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Datei konnte nicht gelesen werden.'));
    reader.readAsDataURL(file);
  });
}

function dataUrlToBlob(dataUrl) {
  const parts = String(dataUrl || '').split(',');
  if (parts.length < 2) throw new Error('Ungueltiges Dateiformat.');

  const meta = parts[0];
  const base64 = parts.slice(1).join(',');
  const mimeMatch = meta.match(/data:(.*?);base64/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], { type: mimeType });
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
  state.adminPassword = localStorage.getItem(STORAGE_ADMIN_PASSWORD) || ADMIN_PASSWORD;

  if (!supabase) {
    setSyncStatus('local-only');
    const tasksFromStorage = localStorage.getItem(STORAGE_TASKS);
    state.tasks = tasksFromStorage ? mergeDefaultTasks(JSON.parse(tasksFromStorage)) : defaultTasks.map(normalizeTask);
    const tipFromStorage = localStorage.getItem(STORAGE_TIP);
    state.tip = tipFromStorage ? JSON.parse(tipFromStorage) : defaultTip;
    const usersFromStorage = localStorage.getItem(STORAGE_CHAT_USERS);
    state.chatUsers = usersFromStorage ? JSON.parse(usersFromStorage).map(normalizeChatUser) : [];
    const messagesFromStorage = localStorage.getItem(STORAGE_CHAT_MESSAGES);
    state.chatMessages = messagesFromStorage ? JSON.parse(messagesFromStorage).map(normalizeChatMessage) : [];
    const adminUser = state.chatUsers.find(user => String(user.username).toLowerCase() === 'admin');
    if (adminUser) {
      adminUser.password = state.adminPassword;
      adminUser.approved = true;
      adminUser.is_admin = true;
    } else {
      state.chatUsers.push({
        id: `local-admin-${Date.now()}`,
        username: 'Admin',
        password: state.adminPassword,
        approved: true,
        is_admin: true
      });
    }
    localStorage.setItem(STORAGE_CHAT_USERS, JSON.stringify(state.chatUsers));
    return;
  }

  try {
    setSyncStatus('connecting');
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
    await loadChatUsers();
    await loadChatMessages();
    setSyncStatus('connected');
  } catch (error) {
    console.error('Supabase Error, using fallback:', error);
    setSyncStatus('fallback');
    const tasksFromStorage = localStorage.getItem(STORAGE_TASKS);
    state.tasks = tasksFromStorage ? mergeDefaultTasks(JSON.parse(tasksFromStorage)) : defaultTasks.map(normalizeTask);
    const tipFromStorage = localStorage.getItem(STORAGE_TIP);
    state.tip = tipFromStorage ? JSON.parse(tipFromStorage) : defaultTip;
    const usersFromStorage = localStorage.getItem(STORAGE_CHAT_USERS);
    state.chatUsers = usersFromStorage ? JSON.parse(usersFromStorage).map(normalizeChatUser) : [];
    const messagesFromStorage = localStorage.getItem(STORAGE_CHAT_MESSAGES);
    state.chatMessages = messagesFromStorage ? JSON.parse(messagesFromStorage).map(normalizeChatMessage) : [];
  }
}

async function ensureAdminChatUser() {
  const existingAdmin = state.chatUsers.find(user => String(user.username).toLowerCase() === 'admin');

  if (!supabase) {
    if (existingAdmin) {
      existingAdmin.password = state.adminPassword;
      existingAdmin.approved = true;
      existingAdmin.is_admin = true;
      if (!existingAdmin.color) existingAdmin.color = '#ff8c00';
    } else {
      state.chatUsers.push({
        id: `local-admin-${Date.now()}`,
        username: 'Admin',
        password: state.adminPassword,
        color: '#ff8c00',
        approved: true,
        is_admin: true
      });
    }
    localStorage.setItem(STORAGE_CHAT_USERS, JSON.stringify(state.chatUsers));
    return;
  }

  const payload = {
    username: 'Admin',
    password: state.adminPassword,
    color: '#ff8c00',
    approved: true,
    is_admin: true
  };

  if (existingAdmin && typeof existingAdmin.id !== 'undefined') {
    await supabase.from('chat_users').update(payload).eq('id', existingAdmin.id);
  } else {
    await supabase.from('chat_users').upsert(payload, { onConflict: 'username' });
  }
}

async function loadChatUsers() {
  if (!supabase) {
    const usersFromStorage = localStorage.getItem(STORAGE_CHAT_USERS);
    state.chatUsers = usersFromStorage ? JSON.parse(usersFromStorage).map(normalizeChatUser) : [];
    await ensureAdminChatUser();
    return;
  }

  const { data, error } = await supabase
    .from('chat_users')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;

  state.chatUsers = (data || []).map(normalizeChatUser);
  await ensureAdminChatUser();

  const { data: refreshed, error: refreshError } = await supabase
    .from('chat_users')
    .select('*')
    .order('created_at', { ascending: true });

  if (refreshError) throw refreshError;
  state.chatUsers = (refreshed || []).map(normalizeChatUser);
  localStorage.setItem(STORAGE_CHAT_USERS, JSON.stringify(state.chatUsers));
}

async function loadChatMessages() {
  if (!supabase) {
    const messagesFromStorage = localStorage.getItem(STORAGE_CHAT_MESSAGES);
    state.chatMessages = messagesFromStorage ? JSON.parse(messagesFromStorage).map(normalizeChatMessage) : [];
    return;
  }

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) throw error;

  state.chatMessages = (data || []).map(normalizeChatMessage);
  localStorage.setItem(STORAGE_CHAT_MESSAGES, JSON.stringify(state.chatMessages));
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
    setSyncStatus('connected');
  } catch (error) {
    console.error('Supabase save failed, using localStorage:', error);
    setSyncStatus('fallback');
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
    setSyncStatus('connected');
  } catch (error) {
    console.error('Supabase tip save failed, using localStorage:', error);
    setSyncStatus('fallback');
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
    await loadChatUsers();
    await loadChatMessages();
    renderTasks();
    renderSolved();
    renderTip();
    renderTodayActions();
    renderAdminContent();
    setSyncStatus('connected');
  } catch (error) {
    console.warn('Realtime sync refresh failed:', error);
    setSyncStatus('fallback');
  }
}

function setupRealtimeSync() {
  if (!supabase || !supabase.channel) {
    setSyncStatus('local-only');
    window.addEventListener('focus', refreshRemoteState);
    return;
  }

  supabase
    .channel('public:tasks_tips_sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => refreshRemoteState())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tips' }, () => refreshRemoteState())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_users' }, () => refreshRemoteState())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages' }, () => refreshRemoteState())
    .subscribe(status => {
      if (status === 'SUBSCRIBED') {
        console.log('Supabase Realtime sync aktiv');
        setSyncStatus('connected');
      }
    });

  window.addEventListener('focus', refreshRemoteState);
}

function saveAdminState() {
  localStorage.setItem('ks_admin_logged_in', state.adminLoggedIn ? 'true' : 'false');
}

async function saveAdminPassword(password) {
  localStorage.setItem(STORAGE_ADMIN_PASSWORD, password);
  state.adminPassword = password;
  await ensureAdminChatUser();
  await loadChatUsers();
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
          <span class="status-pill success">Erfolgreich abgeschlossen</span>
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
      </div>
    `;
    return;
  }

  const pendingTasks = state.tasks.filter(task => task.validationMode === 'manual' && task.reviewStatus === 'pending');
  const pendingUsers = state.chatUsers.filter(user => !user.approved && !user.is_admin);
  const managedUsers = state.chatUsers.filter(user => !user.is_admin);

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
        ${task.solutionFileName ? `<div class="file-meta"><strong>Eingereichte Datei:</strong> ${task.solutionFileName}</div>` : ''}
        <div class="actions">
          ${task.solutionFileData ? `<button class="secondary" data-action="open-file" data-id="${task.id}">Datei öffnen</button>` : ''}
          ${(task.solved || task.reviewStatus !== 'open' || task.solution || task.solutionFileData) ? `<button class="secondary" data-action="reopen-task" data-id="${task.id}">Erneut stellen</button>` : ''}
          <button class="secondary" data-action="edit-task" data-id="${task.id}">Bearbeiten</button>
          <button class="danger" data-action="delete-task" data-id="${task.id}">Löschen</button>
        </div>
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
          <input type="hidden" id="editingTaskId" />
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
          <div class="actions">
            <button type="submit" id="taskSubmitButton">Aufgabe hinzufügen</button>
            <button type="button" class="secondary" id="cancelTaskEdit" data-action="cancel-task-edit" style="display:none;">Bearbeitung abbrechen</button>
          </div>
        </form>
      </div>

      <div class="admin-box">
        <button id="logoutButton" class="danger">Admin abmelden</button>
        <a class="button-link chris-mode-button" href="chris.html">Chris Modus</a>
        <a class="button-link" href="https://console.x.ai/team/a79cc4a6-1327-45be-beb1-ca0f6173b6e4" target="_blank" rel="noopener noreferrer">X Ai Credits</a>
      </div>

      <div class="admin-box">
        <h2>KI-Challenge Zähler</h2>
        <p class="small-note">Gestellte Fragen an HiggsBo zurücksetzen, damit die Challenge neu beginnt.</p>
        <button class="secondary" id="resetAiCounterButton">Fragenzähler zurücksetzen</button>
        <button class="secondary" id="resetAiHistoryButton">Chatverlauf zurücksetzen</button>
      </div>

      <div class="admin-box">
        <h2>KI-Backend prüfen</h2>
        <p class="small-note">Testet die Verbindung zur echten Grok/xAI-Route der KI-Challenge.</p>
        <p class="small-note">Status: <strong id="aiBackendStatusLabel">Ungeprüft</strong></p>
        <p class="small-note" id="aiBackendStatusDetails">Noch kein Prüfvorgang ausgeführt.</p>
        <button class="secondary" id="checkAiBackendButton">Backend prüfen</button>
      </div>
          <label for="currentAdminPassword">Aktuelles Passwort</label>
          <input type="password" id="currentAdminPassword" placeholder="Aktuelles Passwort" />
          <label for="newAdminPassword">Neues Passwort</label>
          <input type="password" id="newAdminPassword" placeholder="Neues Passwort" />
          <label for="confirmAdminPassword">Neues Passwort bestätigen</label>
          <input type="password" id="confirmAdminPassword" placeholder="Neues Passwort erneut eingeben" />
          <button type="submit">Passwort ändern</button>
        </form>
      </div>

      <div class="admin-box">
        <h2>Neue Chat-Registrierungen</h2>
        ${pendingUsers.length === 0 ? '<p class="small-note">Keine offenen Registrierungen.</p>' : ''}
        <div class="task-list">
          ${pendingUsers.map(user => `
            <article class="task-card">
              <header>
                <div>
                  <h3>${user.username}</h3>
                  <span class="badge">Wartet auf Freigabe</span>
                </div>
              </header>
              <div class="actions">
                <button class="secondary" data-action="approve-user" data-id="${user.id}">Freigeben</button>
                <button class="danger" data-action="reject-user" data-id="${user.id}">Ablehnen</button>
              </div>
            </article>
          `).join('')}
        </div>
      </div>

      <div class="admin-box">
        <h2>Chat-Anmeldedaten verwalten</h2>
        <p class="small-note">Für Einsicht/Bearbeitung bitte Admin-Passwort separat bestätigen.</p>
        <form id="credentialsUnlockForm">
          <label for="credentialsUnlockPassword">Admin-Passwort bestätigen</label>
          <input type="password" id="credentialsUnlockPassword" placeholder="Admin-Passwort" />
          <button type="submit">Anmeldedaten entsperren</button>
        </form>
        ${state.credentialsUnlocked ? `
          <div class="task-list" style="margin-top: 16px;">
            ${managedUsers.length === 0 ? '<p class="small-note">Keine Nutzer vorhanden.</p>' : managedUsers.map(user => `
              <form class="user-edit-form admin-box" data-user-id="${user.id}">
                <label>Benutzername</label>
                <input type="text" name="username" value="${user.username}" />
                <label>Passwort</label>
                <input type="text" name="password" value="${user.password}" />
                <label>Namensfarbe im Chat</label>
                <div style="display:flex; align-items:center; gap:12px;">
                  <input type="color" name="color" value="${user.color || '#7dd0ff'}" style="width:48px; height:38px; border:none; border-radius:8px; cursor:pointer; background:none;" />
                  <span class="small-note" style="color:${user.color || '#7dd0ff'}; font-weight:600;">${user.username}</span>
                </div>
                <div class="actions">
                  <button type="submit" class="secondary">Speichern</button>
                </div>
              </form>
            `).join('')}
          </div>
        ` : ''}
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
                ${task.solutionFileName ? `<p class="small-note"><strong>Datei:</strong> ${task.solutionFileName}</p>` : '<p class="small-note">Keine Datei hochgeladen.</p>'}
              </div>
              <div class="actions">
                ${task.solutionFileData ? `<button class="secondary" data-action="open-file" data-id="${task.id}">Datei öffnen</button>` : ''}
                <button class="secondary" data-action="reopen-task" data-id="${task.id}">Erneut stellen</button>
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
  const uploadedFile = elements.solutionFileInput?.files?.[0];
  task.solutionFileName = uploadedFile ? uploadedFile.name : task.solutionFileName || '';
  if (uploadedFile) {
    try {
      task.solutionFileData = await readFileAsDataUrl(uploadedFile);
    } catch (error) {
      alert('Datei konnte nicht gelesen werden. Bitte erneut versuchen.');
      return;
    }
  }

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

function startTaskEdit(task) {
  const form = document.getElementById('taskForm');
  if (!form || !task) return;

  const editingTaskId = document.getElementById('editingTaskId');
  const title = document.getElementById('taskTitle');
  const category = document.getElementById('taskCategory');
  const description = document.getElementById('taskDescription');
  const publishDate = document.getElementById('taskPublishDate');
  const publishTime = document.getElementById('taskPublishTime');
  const tipText = document.getElementById('taskTipText');
  const tipDate = document.getElementById('taskTipDate');
  const tipTime = document.getElementById('taskTipTime');
  const validationMode = document.getElementById('taskValidationMode');
  const expectedPattern = document.getElementById('expectedPattern');
  const caseSensitive = document.getElementById('caseSensitive');
  const whitespaceSensitive = document.getElementById('whitespaceSensitive');
  const submitButton = document.getElementById('taskSubmitButton');
  const cancelButton = document.getElementById('cancelTaskEdit');

  if (editingTaskId) editingTaskId.value = task.id;
  if (title) title.value = task.title || '';
  if (category) category.value = task.category || '';
  if (description) description.value = task.description || '';
  if (publishDate) publishDate.value = task.taskPublishDate || '';
  if (publishTime) publishTime.value = task.taskPublishTime || '';
  if (tipText) tipText.value = task.tipText || '';
  if (tipDate) tipDate.value = task.tipScheduleDate || '';
  if (tipTime) tipTime.value = task.tipScheduleTime || '';
  if (validationMode) validationMode.value = task.validationMode || 'manual';
  if (expectedPattern) expectedPattern.value = task.expectedAnswerPattern || '';
  if (caseSensitive) caseSensitive.checked = Boolean(task.caseSensitive);
  if (whitespaceSensitive) whitespaceSensitive.checked = Boolean(task.whitespaceSensitive);
  if (submitButton) submitButton.textContent = 'Aufgabe speichern';
  if (cancelButton) cancelButton.style.display = 'inline-flex';

  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetTaskEditForm() {
  const form = document.getElementById('taskForm');
  if (!form) return;
  form.reset();

  const editingTaskId = document.getElementById('editingTaskId');
  const submitButton = document.getElementById('taskSubmitButton');
  const cancelButton = document.getElementById('cancelTaskEdit');

  if (editingTaskId) editingTaskId.value = '';
  if (submitButton) submitButton.textContent = 'Aufgabe hinzufügen';
  if (cancelButton) cancelButton.style.display = 'none';
}

async function handleAdminAction(event) {
  const button = event.target.closest('button');
  if (!button) return;
  const action = button.dataset.action;
  const id = button.dataset.id;
  if (!action) return;

  if (action === 'cancel-task-edit') {
    resetTaskEditForm();
    return;
  }

  if (action === 'approve-user') {
    const user = state.chatUsers.find(item => String(item.id) === String(id));
    if (!user) return;

    user.approved = true;
    if (supabase) {
      const { error } = await supabase.from('chat_users').update({ approved: true }).eq('id', user.id);
      if (error) {
        alert('Freigabe fehlgeschlagen.');
        return;
      }
      await loadChatUsers();
    } else {
      localStorage.setItem(STORAGE_CHAT_USERS, JSON.stringify(state.chatUsers));
    }
    renderAdminContent();
    return;
  }

  if (action === 'reject-user') {
    const user = state.chatUsers.find(item => String(item.id) === String(id));
    if (!user) return;

    if (supabase) {
      const { error } = await supabase.from('chat_users').delete().eq('id', user.id);
      if (error) {
        alert('Ablehnen fehlgeschlagen.');
        return;
      }
      await loadChatUsers();
    } else {
      state.chatUsers = state.chatUsers.filter(item => String(item.id) !== String(id));
      localStorage.setItem(STORAGE_CHAT_USERS, JSON.stringify(state.chatUsers));
    }
    renderAdminContent();
    return;
  }

  if (!id) return;

  const task = state.tasks.find(item => item.id === id);
  if (!task) return;

  if (action === 'open-file') {
    if (!task.solutionFileData) {
      alert('Keine Datei gespeichert.');
      return;
    }

    try {
      const blob = dataUrlToBlob(task.solutionFileData);
      const blobUrl = URL.createObjectURL(blob);
      const opened = window.open(blobUrl, '_blank');

      if (!opened) {
        URL.revokeObjectURL(blobUrl);
        alert('Datei konnte nicht geöffnet werden. Bitte Pop-up-Blocker prüfen.');
        return;
      }

      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    } catch (error) {
      alert('Datei ist beschädigt oder konnte nicht geöffnet werden.');
    }
    return;
  }

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

  if (action === 'reopen-task') {
    task.solved = false;
    task.reviewStatus = 'open';
    task.solution = '';
    task.solvedAt = null;
    task.solutionFileName = '';
    task.solutionFileData = '';
    await saveTasks();
    renderTasks();
    renderSolved();
    renderTodayActions();
    renderAdminContent();
    alert('Aufgabe wurde erneut gestellt.');
    return;
  }

  if (action === 'edit-task') {
    startTaskEdit(task);
    return;
  }

  if (action === 'delete-task') {
    const confirmed = window.confirm(`Aufgabe "${task.title}" wirklich löschen?`);
    if (!confirmed) return;

    state.tasks = state.tasks.filter(item => item.id !== id);
    await saveTasks();
    renderTasks();
    renderSolved();
    renderTodayActions();
    renderTip();
    renderAdminContent();
    alert('Aufgabe wurde gelöscht.');
  }
}

function handleAdminLogin(event) {
  event.preventDefault();
  const passwordInput = document.getElementById('adminPassword');
  const value = passwordInput?.value.trim();

  if (value === state.adminPassword) {
    state.adminLoggedIn = true;
    saveAdminState();
    renderAdminContent();
    if (passwordInput) passwordInput.value = '';
  } else {
    alert('Falsches Passwort.');
  }
}

async function handleAdminPasswordChange(event) {
  event.preventDefault();
  const current = document.getElementById('currentAdminPassword')?.value.trim() || '';
  const next = document.getElementById('newAdminPassword')?.value.trim() || '';
  const confirm = document.getElementById('confirmAdminPassword')?.value.trim() || '';

  if (!current || !next || !confirm) {
    alert('Bitte alle Passwortfelder ausfüllen.');
    return;
  }

  if (current !== state.adminPassword) {
    alert('Aktuelles Passwort ist falsch.');
    return;
  }

  if (next.length < 6) {
    alert('Neues Passwort muss mindestens 6 Zeichen lang sein.');
    return;
  }

  if (next !== confirm) {
    alert('Die neue Passworteingabe stimmt nicht überein.');
    return;
  }

  await saveAdminPassword(next);
  state.credentialsUnlocked = false;
  event.target.reset();
  alert('Admin-Passwort wurde geändert.');
  renderAdminContent();
}

function handleCredentialsUnlock(event) {
  event.preventDefault();
  const password = document.getElementById('credentialsUnlockPassword')?.value.trim() || '';

  if (password !== state.adminPassword) {
    alert('Admin-Passwort falsch.');
    return;
  }

  state.credentialsUnlocked = true;
  renderAdminContent();
}

async function handleUserEditSubmit(event) {
  event.preventDefault();
  if (!state.credentialsUnlocked) {
    alert('Bitte zuerst Anmeldedaten entsperren.');
    return;
  }

  const form = event.target;
  const userId = form.dataset.userId;
  const username = form.querySelector('input[name="username"]')?.value.trim() || '';
  const password = form.querySelector('input[name="password"]')?.value.trim() || '';
  const user = state.chatUsers.find(item => String(item.id) === String(userId));
  const color = form.querySelector('input[name="color"]')?.value || user?.color || '#7dd0ff';

  if (!user) {
    alert('Nutzer nicht gefunden.');
    return;
  }

  if (!username || !password) {
    alert('Benutzername und Passwort sind erforderlich.');
    return;
  }

  if (!user.is_admin && isAdminLikeUsername(username)) {
    alert('Benutzername zu aehnlich zu Admin ist nicht erlaubt.');
    return;
  }

  const duplicate = state.chatUsers.find(item => String(item.id) !== String(userId) && String(item.username).toLowerCase() === username.toLowerCase());
  if (duplicate) {
    alert('Benutzername ist bereits vergeben.');
    return;
  }

  user.username = username;
  user.password = password;
  user.color = color;

  if (supabase) {
    const { error } = await supabase
      .from('chat_users')
      .update({ username: user.username, password: user.password, color: user.color })
      .eq('id', user.id);
    if (error) {
      alert('Speichern fehlgeschlagen.');
      return;
    }
    await loadChatUsers();
  } else {
    localStorage.setItem(STORAGE_CHAT_USERS, JSON.stringify(state.chatUsers));
  }

  alert('Nutzerdaten gespeichert.');
  renderAdminContent();
}

function handleLogout() {
  state.adminLoggedIn = false;
  state.credentialsUnlocked = false;
  saveAdminState();
  renderAdminContent();
}

async function handleResetAiCounter() {
  const confirmed = window.confirm('Fragenzähler der KI-Challenge wirklich auf 0 zurücksetzen?');
  if (!confirmed) return;

  if (supabase) {
    const { error } = await supabase
      .from('ai_challenge_state')
      .update({ question_count: 0, updated_at: new Date().toISOString() })
      .gt('id', 0);
    if (error) {
      alert('Zurücksetzen fehlgeschlagen: ' + error.message);
      return;
    }
  } else {
    localStorage.setItem('ks_ai_question_count', '0');
  }

  alert('Fragenzähler wurde zurückgesetzt.');
}

function handleResetAiHistory() {
  const confirmed = window.confirm('Chatverlauf und KI-Gedächtnis wirklich zurücksetzen?');
  if (!confirmed) return;

  localStorage.removeItem('ks_ai_chat_history');
  localStorage.removeItem('ks_ai_memory');

  alert('Chatverlauf wurde zurückgesetzt.');
}

function setAiBackendAdminStatus(label, details, mode = 'neutral') {
  const labelEl = document.getElementById('aiBackendStatusLabel');
  const detailsEl = document.getElementById('aiBackendStatusDetails');

  if (labelEl) {
    labelEl.textContent = label;
    const styles = {
      neutral: { background: 'rgba(125,208,255,0.12)', color: '#7dd0ff', borderColor: 'rgba(125,208,255,0.25)' },
      success: { background: 'rgba(63,229,141,0.14)', color: '#3fe58d', borderColor: 'rgba(63,229,141,0.28)' },
      warning: { background: 'rgba(255,165,0,0.12)', color: '#ffb347', borderColor: 'rgba(255,165,0,0.25)' },
      danger: { background: 'rgba(255,99,99,0.12)', color: '#ff8a8a', borderColor: 'rgba(255,99,99,0.25)' },
    };
    const style = styles[mode] || styles.neutral;
    labelEl.style.background = style.background;
    labelEl.style.color = style.color;
    labelEl.style.border = `1px solid ${style.borderColor}`;
    labelEl.style.padding = '0.2rem 0.55rem';
    labelEl.style.borderRadius = '999px';
  }

  if (detailsEl) {
    detailsEl.textContent = details;
  }
}

async function handleCheckAiBackend() {
  if (!supabase) {
    setAiBackendAdminStatus('Kein Supabase', 'Der Client ist nicht verfügbar, daher kann der Backend-Test nicht ausgeführt werden.', 'danger');
    return;
  }

  setAiBackendAdminStatus('Prüfung läuft', 'Verbinde mit der Edge Function aria-chat...', 'neutral');

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/aria-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({
        message: 'Statusprüfung',
        questionCount: 0,
        resistance: 100,
        history: []
      })
    });

    const payload = await response.json().catch(() => null);
    if (response.ok && typeof payload?.reply === 'string') {
      setAiBackendAdminStatus('Verbunden', `Antwort erhalten: ${payload.reply.slice(0, 160)}`, 'success');
      return;
    }

    const errorText = String(payload?.error || `HTTP ${response.status}`).toLowerCase();
    if (errorText.includes('credits') || errorText.includes('license') || errorText.includes('permission-denied')) {
      setAiBackendAdminStatus('xAI blockiert', payload?.error || 'xAI meldet fehlende Credits oder Lizenz.', 'warning');
    } else {
      setAiBackendAdminStatus('Fehler', payload?.error || `Unerwartete Antwort: HTTP ${response.status}`, 'danger');
    }
  } catch (error) {
    setAiBackendAdminStatus('Nicht erreichbar', String(error?.message || error), 'danger');
  }
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
  const editingTaskId = document.getElementById('editingTaskId')?.value || '';

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

  if (editingTaskId) {
    const taskIndex = state.tasks.findIndex(item => item.id === editingTaskId);
    if (taskIndex < 0) {
      alert('Aufgabe zum Bearbeiten wurde nicht gefunden.');
      return;
    }

    const existingTask = state.tasks[taskIndex];
    state.tasks[taskIndex] = normalizeTask({
      ...existingTask,
      title,
      description,
      category,
      validationMode,
      expectedAnswerPattern,
      caseSensitive,
      whitespaceSensitive,
      tipText,
      taskPublishDate: publishDate,
      taskPublishTime: publishTime,
      tipScheduleDate: tipDate,
      tipScheduleTime: tipTime
    });
  } else {
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
      solutionFileName: '',
      solutionFileData: ''
    };

    state.tasks.push(normalizeTask(newTask));
  }

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
  renderTodayActions();
  renderTip();
  renderAdminContent();
  resetTaskEditForm();
  alert(editingTaskId ? 'Aufgabe aktualisiert.' : 'Aufgabe hinzugefügt.');
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
      } else if (event.target.id === 'adminPasswordForm') {
        event.preventDefault();
        handleAdminPasswordChange(event);
      } else if (event.target.id === 'credentialsUnlockForm') {
        event.preventDefault();
        handleCredentialsUnlock(event);
      } else if (event.target.classList.contains('user-edit-form')) {
        event.preventDefault();
        handleUserEditSubmit(event);
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
      const resetAiBtn = event.target.closest('#resetAiCounterButton');
      const resetAiHistoryBtn = event.target.closest('#resetAiHistoryButton');
      const checkAiBtn = event.target.closest('#checkAiBackendButton');
      if (logoutBtn) {
        handleLogout();
      } else if (resetAiBtn) {
        handleResetAiCounter();
      } else if (resetAiHistoryBtn) {
        handleResetAiHistory();
      } else if (checkAiBtn) {
        handleCheckAiBackend();
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
  renderSyncStatus();
  await loadState();
  renderTasks();
  renderSolved();
  renderTip();
  renderTodayActions();
  renderAdminContent();
  initializeEvents();
  setupRealtimeSync();
  displayStorageInfo();

  window.addEventListener('offline', () => setSyncStatus('fallback', 'Offline-Fallback aktiv (keine Internetverbindung)'));
  window.addEventListener('online', () => {
    setSyncStatus(supabase ? 'connecting' : 'local-only');
    refreshRemoteState();
  });
}

init();

  })();
}
