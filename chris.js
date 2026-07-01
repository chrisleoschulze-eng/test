function applyRenderedPlanColors() {
  if (!state || !Array.isArray(state.plan)) return;
  const byId = new Map(state.plan.map(item => [String(item.id || ''), item]));
  document.querySelectorAll('[data-plan-id]').forEach(node => {
    const id = String(node.getAttribute('data-plan-id') || '');
    const item = byId.get(id);
    if (!item) return;
    const termColor = normalizeTermColor(item.color) || '#2F80ED';
    node.classList.add('plan-item');
    node.style.setProperty('--term-color', termColor);
    node.classList.remove('importance-n', 'importance-r', 'importance-s');
    node.classList.add(`importance-${normalizeImportance(item.importance)}`);
  });
}

function initRenderedPlanColorObserver() {
  if (window.__ksPlanColorObserverInitialized) return;
  window.__ksPlanColorObserverInitialized = true;

  const run = () => requestAnimationFrame(applyRenderedPlanColors);
  const observer = new MutationObserver(run);
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  }
  run();
}

document.addEventListener('DOMContentLoaded', initRenderedPlanColorObserver);
const SUPABASE_URL = 'https://gpsnklnubbqkntseqeqb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwc25rbG51YmJxa250c2VxZXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MDQyNjgsImV4cCI6MjA5NzM4MDI2OH0.VICqdMCm4mknyBIoTdYbH-tQ7g408gpKl_zlVHPp7z4';
const PLAN_CHAT_URL = `${SUPABASE_URL}/functions/v1/aria-chat`;
const STORAGE_CHRIS_PLAN = 'ks_chris_plan';
const STORAGE_CHRIS_CHAT = 'ks_chris_plan_chat';
const STORAGE_CHRIS_GOALS = 'ks_chris_goals';
const STORAGE_CHRIS_TODOS = 'ks_chris_todos';
const TABLE_CHRIS_PLAN = 'chris_plan_items';
const TABLE_CHRIS_GOALS = 'chris_goals';
const TABLE_CHRIS_TODOS = 'chris_todos';
const TERM_COLOR_PALETTE = ['#ff6b6b', '#ff9f43', '#ffd166', '#7ad0ff', '#7ee787', '#ba9cff', '#ff7cc3', '#5de2e7'];
const TERM_COLOR_NAME_MAP = {
  rot: '#ff6b6b',
  red: '#ff6b6b',
  orange: '#ff9f43',
  gelb: '#ffd166',
  yellow: '#ffd166',
  blau: '#7ad0ff',
  blue: '#7ad0ff',
  gruen: '#7ee787',
  grün: '#7ee787',
  green: '#7ee787',
  lila: '#ba9cff',
  violett: '#ba9cff',
  purple: '#ba9cff',
  pink: '#ff7cc3',
  tuerkis: '#5de2e7',
  türkis: '#5de2e7',
  cyan: '#5de2e7'
};

const sbClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

if (localStorage.getItem('ks_admin_logged_in') !== 'true') {
  alert('Bitte zuerst im Admin-Menü einloggen.');
  window.location.href = 'admin.html';
  throw new Error('Admin-Login erforderlich für Chris Modus.');
}

const state = {
  plan: [],
  goals: [],
  todos: [],
  selectedDate: formatDateKey(new Date()),
  viewDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  chat: loadChatHistory(),
  mode: 'view',
  pendingPriorityPrompt: null
};

let suppressPlanRealtimeUntil = 0;

function buildId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatDateKey(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseDateKey(value) {
  const [y, m, d] = String(value || '').split('-').map(Number);
  if (!y || !m || !d) return new Date();
  return new Date(y, m - 1, d);
}

function normalizeDateKey(value) {
  const raw = String(value || '').slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : '';
}

function parseTime(value) {
  const [h, m] = String(value || '00:00').split(':').map(Number);
  return (h * 60) + (m || 0);
}

function rangeEndDate(item) {
  const start = normalizeDateKey(item?.date);
  const end = normalizeDateKey(item?.endDate);
  if (!start) return '';
  if (!end || end < start) return start;
  return end;
}

function occursOnDate(item, dateKey) {
  const day = normalizeDateKey(dateKey);
  const start = normalizeDateKey(item?.date);
  const end = rangeEndDate(item);
  if (!day || !start || !end) return false;
  return day >= start && day <= end;
}

function projectPlanItemToDate(item, dateKey) {
  if (!occursOnDate(item, dateKey)) return null;
  const startDate = normalizeDateKey(item.date);
  const endDate = rangeEndDate(item);

  let start = String(item.start || '00:00').slice(0, 5);
  let end = String(item.end || '23:59').slice(0, 5);

  if (dateKey !== startDate) start = '00:00';
  if (dateKey !== endDate) end = '23:59';

  return {
    ...item,
    date: dateKey,
    start,
    end,
    rangeStart: startDate,
    rangeEnd: endDate,
    multiDay: startDate !== endDate
  };
}

function priorityBorderColor(value) {
  const imp = normalizeImportance(value);
  if (imp === 's') return '#ff4d4f';
  if (imp === 'r') return '#4ea8de';
  return '#ff9f43';
}

function priorityBorderRgb(value) {
  const imp = normalizeImportance(value);
  if (imp === 's') return '255, 77, 79';
  if (imp === 'r') return '78, 168, 222';
  return '255, 159, 67';
}

function normalizeImportance(value) {
  const v = String(value || '').trim().toLowerCase();
  if (v === 'strict' || v === 's' || v === 'urgent' || v === 'urgend' || v === 'u' || v === 'high' || v === 'hoch' || v === 'höchste' || v === 'highest') return 's';
  if (v === 'reserved' || v === 'r' || v === 'reserve' || v === 'sometime' || v === 'medium' || v === 'mittel' || v === 'middle' || v === 'mid') return 'r';
  if (v === 'anytime' || v === 'a' || v === 'low' || v === 'niedrig' || v === 'lowest') return 'n';
  return 'n';
}


function normalizeTermColor(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return '';
  if (TERM_COLOR_NAME_MAP[raw]) return TERM_COLOR_NAME_MAP[raw];
  const shortHex = raw.match(/^#([0-9a-f]{3})$/i);
  if (shortHex) {
    const c = shortHex[1];
    return `#${c[0]}${c[0]}${c[1]}${c[1]}${c[2]}${c[2]}`.toLowerCase();
  }
  const longHex = raw.match(/^#([0-9a-f]{6})$/i);
  if (longHex) return `#${longHex[1].toLowerCase()}`;
  return '';
}

function extractRequestedTermColor(text) {
  const value = String(text || '').toLowerCase();
  if (!value) return '';
  const hexMatch = value.match(/#([0-9a-f]{3}|[0-9a-f]{6})\b/i);
  if (hexMatch) return normalizeTermColor(hexMatch[0]);

  const nameOrder = Object.keys(TERM_COLOR_NAME_MAP).sort((a, b) => b.length - a.length);
  for (const name of nameOrder) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rx = new RegExp(`\\b${escaped}\\b`, 'i');
    if (rx.test(value)) return TERM_COLOR_NAME_MAP[name];
  }
  return '';
}

function enrichUserPromptWithColorHint(text) {
  const raw = String(text || '').trim();
  if (!raw) return raw;
  const requestedColor = extractRequestedTermColor(raw);
  if (!requestedColor) return raw;
  return `${raw}\n\nFarbhinweis (verbindlich): Verwende für color den HEX-Wert ${requestedColor}.`;
}

function pickRandomTermColor(disallowed) {
  const blocked = new Set((disallowed || []).map(c => normalizeTermColor(c)).filter(Boolean));
  const available = TERM_COLOR_PALETTE.filter(color => !blocked.has(color));
  const pool = available.length ? available : TERM_COLOR_PALETTE;
  return pool[Math.floor(Math.random() * pool.length)];
}

function assignMissingPlanColors(planItems) {
  const normalized = (Array.isArray(planItems) ? planItems : []).map(normalizePlanItem).filter(Boolean);
  const sorted = [...normalized].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return parseTime(a.start) - parseTime(b.start);
  });

  const seriesColors = new Map();
  const result = [];
  for (let index = 0; index < sorted.length; index += 1) {
    const item = sorted[index];
    const seriesId = String(item.seriesId || '').trim();
    const existing = normalizeTermColor(item.color);

    if (seriesId && existing) {
      seriesColors.set(seriesId, existing);
    }

    if (seriesId && !existing && seriesColors.has(seriesId)) {
      result.push({ ...item, color: seriesColors.get(seriesId) });
      continue;
    }

    if (existing) {
      result.push({ ...item, color: existing });
      continue;
    }

    const prev = result[index - 1];
    const next = sorted.slice(index + 1).find(candidate => candidate.date === item.date);
    const blocked = new Set([
      prev && prev.date === item.date ? normalizeTermColor(prev.color) : '',
      normalizeTermColor(next?.color)
    ].filter(Boolean));

    const options = TERM_COLOR_PALETTE.filter(color => !blocked.has(color));
    const palette = options.length ? options : TERM_COLOR_PALETTE;
    const color = palette[Math.floor(Math.random() * palette.length)];
    if (seriesId) seriesColors.set(seriesId, color);
    result.push({ ...item, color });
  }

  return result;
}

function importanceLabel(value) {
  const imp = normalizeImportance(value);
  if (imp === 's') return 'strict (s)';
  if (imp === 'r') return 'reserved (r)';
  return 'negotiable (n)';
}

function importanceClass(value) {
  const imp = normalizeImportance(value);
  return `importance-${imp}`;
}

function todoPriorityLabel(value) {
  const imp = normalizeImportance(value);
  if (imp === 's') return 'urgent';
  if (imp === 'r') return 'sometime';
  return 'anytime';
}

function getNowContext() {
  const now = new Date();
  return {
    currentDate: formatDateKey(now),
    currentTime: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Berlin'
  };
}

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function loadPlan() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_CHRIS_PLAN) || '[]');
    if (!Array.isArray(parsed)) return [];
      return assignMissingPlanColors(parsed.filter(item => item && typeof item.date === 'string' && typeof item.start === 'string' && typeof item.end === 'string' && typeof item.title === 'string')
        .map(item => ({
        id: item.id || `plan-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        date: item.date,
        start: item.start,
        end: item.end,
        title: item.title,
        note: item.note || '',
        importance: normalizeImportance(item.importance),
        color: normalizeTermColor(item.color),
        endDate: normalizeDateKey(item.endDate) || normalizeDateKey(item.date),
        seriesId: String(item.seriesId || '')
         })));
  } catch (error) {
    return [];
  }
}

function savePlanLocal() {
  localStorage.setItem(STORAGE_CHRIS_PLAN, JSON.stringify(state.plan));
}

function mapDbRowToPlanItem(row) {
  return {
    id: String(row.id),
    date: String(row.plan_date).slice(0, 10),
    start: String(row.start_time).slice(0, 5),
    end: String(row.end_time).slice(0, 5),
    title: String(row.title || '').slice(0, 140),
    note: String(row.note || '').slice(0, 300),
    importance: normalizeImportance(row.importance),
    color: normalizeTermColor(row.color),
    endDate: normalizeDateKey(row.end_date) || String(row.plan_date).slice(0, 10),
    seriesId: String(row.series_id || '')
  };
}

function mapPlanItemToDbRow(item) {
  return {
    id: item.id,
    plan_date: item.date,
    start_time: item.start,
    end_time: item.end,
    title: item.title,
    note: item.note || '',
    importance: normalizeImportance(item.importance),
    color: normalizeTermColor(item.color) || null,
    end_date: rangeEndDate(item),
    series_id: item.seriesId ? String(item.seriesId).slice(0, 80) : null,
    updated_at: new Date().toISOString()
  };
}

async function loadPlanFromSource() {
  if (!sbClient) {
    state.plan = loadPlan();
    return;
  }

  const { data, error } = await sbClient
    .from(TABLE_CHRIS_PLAN)
    .select('id, plan_date, start_time, end_time, title, note, importance, color, end_date, series_id')
    .order('plan_date', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) {
    state.plan = loadPlan();
    return;
  }

  state.plan = Array.isArray(data) ? assignMissingPlanColors(data.map(mapDbRowToPlanItem)) : [];
  savePlanLocal();
}

async function savePlan(removedIds = []) {
  suppressPlanRealtimeUntil = Date.now() + 1800;
  const normalized = assignMissingPlanColors(state.plan.map(normalizePlanItem));
  state.plan = normalized;
  savePlanLocal();

  if (!sbClient) return;

  const rows = normalized.map(mapPlanItemToDbRow);

  if (rows.length > 0) {
    const { error: upsertError } = await sbClient
      .from(TABLE_CHRIS_PLAN)
      .upsert(rows, { onConflict: 'id' });
    if (upsertError) {
      console.error('Plan-Upsert fehlgeschlagen:', upsertError.message);
      return;
    }
  }

  const explicitRemoveIds = Array.isArray(removedIds)
    ? removedIds.map(id => String(id || '').trim()).filter(Boolean)
    : [];

  if (explicitRemoveIds.length > 0) {
    const { error: deleteError } = await sbClient
      .from(TABLE_CHRIS_PLAN)
      .delete()
      .in('id', explicitRemoveIds);
    if (deleteError) {
      console.error('Plan-Löschen für Sync fehlgeschlagen:', deleteError.message);
    }
  }
}

function loadChatHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_CHRIS_CHAT) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(item => item && (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string')
      .slice(-50);
  } catch (error) {
    return [];
  }
}

function saveChatHistory() {
  localStorage.setItem(STORAGE_CHRIS_CHAT, JSON.stringify(state.chat.slice(-50)));
}

function normalizeTodo(item) {
  if (!item || typeof item !== 'object') return null;
  const title = String(item.title || '').trim().slice(0, 160);
  if (!title) return null;
  const createdAt = item.createdAt || item.created_at || new Date().toISOString();
  return {
    id: String(item.id || buildId('todo')),
    title,
    importance: normalizeImportance(item.importance),
    status: String(item.status || 'active') === 'completed' ? 'completed' : 'active',
    note: String(item.note || '').slice(0, 300),
    createdAt: String(createdAt),
    updatedAt: String(item.updatedAt || item.updated_at || createdAt),
    completedAt: item.completedAt || item.completed_at ? String(item.completedAt || item.completed_at) : null
  };
}

function loadTodosLocal() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_CHRIS_TODOS) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeTodo).filter(Boolean);
  } catch (_error) {
    return [];
  }
}

function saveTodosLocal() {
  localStorage.setItem(STORAGE_CHRIS_TODOS, JSON.stringify(state.todos));
}

function mapDbRowToTodoItem(row) {
  return normalizeTodo({
    id: row.id,
    title: row.title,
    importance: row.importance,
    status: row.status,
    note: row.note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at
  });
}

function mapTodoItemToDbRow(todo) {
  const normalized = normalizeTodo(todo);
  if (!normalized) return null;
  return {
    id: normalized.id,
    title: normalized.title,
    importance: normalized.importance,
    status: normalized.status,
    note: normalized.note || '',
    created_at: normalized.createdAt,
    updated_at: new Date().toISOString(),
    completed_at: normalized.completedAt
  };
}

async function loadTodosFromSource() {
  if (!sbClient) {
    state.todos = loadTodosLocal();
    return;
  }

  const { data, error } = await sbClient
    .from(TABLE_CHRIS_TODOS)
    .select('id, title, importance, status, note, created_at, updated_at, completed_at')
    .order('created_at', { ascending: false });

  if (error) {
    state.todos = loadTodosLocal();
    return;
  }

  state.todos = Array.isArray(data) ? data.map(mapDbRowToTodoItem).filter(Boolean) : [];
  saveTodosLocal();
}

async function saveTodos(removedIds = []) {
  saveTodosLocal();
  if (!sbClient) return;

  const normalized = state.todos.map(normalizeTodo).filter(Boolean);
  const rows = normalized.map(mapTodoItemToDbRow).filter(Boolean);

  if (rows.length > 0) {
    const { error: upsertError } = await sbClient
      .from(TABLE_CHRIS_TODOS)
      .upsert(rows, { onConflict: 'id' });
    if (upsertError) {
      console.error('Todos-Upsert fehlgeschlagen:', upsertError.message);
      return;
    }
  }

  const explicitRemoveIds = Array.isArray(removedIds)
    ? removedIds.map(id => String(id || '').trim()).filter(Boolean)
    : [];

  if (explicitRemoveIds.length > 0) {
    const { error: deleteError } = await sbClient
      .from(TABLE_CHRIS_TODOS)
      .delete()
      .in('id', explicitRemoveIds);
    if (deleteError) {
      console.error('Todos-Löschen für Sync fehlgeschlagen:', deleteError.message);
    }
  }
}

function normalizeGoalPeriod(value) {
  const v = String(value || '').trim().toLowerCase();
  if (v === 'day' || v === 'tag') return 'day';
  if (v === 'week' || v === 'woche') return 'week';
  if (v === 'month' || v === 'monat') return 'month';
  if (v === 'year' || v === 'jahr') return 'year';
  if (v === 'five_years' || v === '5_jahre' || v === '5jahre' || v === '5-years') return 'five_years';
  if (v === 'lifetime') return 'lifetime';
  return 'month';
}

function goalPeriodLabel(period) {
  const p = normalizeGoalPeriod(period);
  if (p === 'day') return 'Tag';
  if (p === 'week') return 'Woche';
  if (p === 'month') return 'Monat';
  if (p === 'year') return 'Jahr';
  if (p === 'five_years') return '5 Jahre';
  return 'Lifetime';
}

function normalizeGoal(item) {
  if (!item || typeof item !== 'object') return null;
  const title = String(item.title || '').trim().slice(0, 160);
  if (!title) return null;
  const createdAt = item.createdAt || item.created_at || new Date().toISOString();
  return {
    id: String(item.id || buildId('goal')),
    title,
    period: normalizeGoalPeriod(item.period),
    status: String(item.status || 'active') === 'completed' ? 'completed' : 'active',
    createdAt: String(createdAt),
    updatedAt: String(item.updatedAt || item.updated_at || createdAt),
    completedAt: item.completedAt || item.completed_at ? String(item.completedAt || item.completed_at) : null,
    repostCount: Number(item.repostCount || item.repost_count || 0)
  };
}

function loadGoalsLocal() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_CHRIS_GOALS) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeGoal).filter(Boolean);
  } catch (_error) {
    return [];
  }
}

function saveGoalsLocal() {
  localStorage.setItem(STORAGE_CHRIS_GOALS, JSON.stringify(state.goals));
}

function computeGoalDeadline(goal) {
  const normalized = normalizeGoal(goal);
  if (!normalized) return null;
  if (normalized.period === 'lifetime') return null;

  const base = new Date(normalized.createdAt);
  if (Number.isNaN(base.getTime())) return null;

  const d = new Date(base);
  if (normalized.period === 'day') d.setDate(d.getDate() + 1);
  if (normalized.period === 'week') d.setDate(d.getDate() + 7);
  if (normalized.period === 'month') d.setMonth(d.getMonth() + 1);
  if (normalized.period === 'year') d.setFullYear(d.getFullYear() + 1);
  if (normalized.period === 'five_years') d.setFullYear(d.getFullYear() + 5);
  return d;
}

function isGoalExpired(goal) {
  const normalized = normalizeGoal(goal);
  if (!normalized || normalized.status !== 'active') return false;
  const deadline = computeGoalDeadline(normalized);
  if (!deadline) return false;
  return Date.now() > deadline.getTime();
}

function mapDbRowToGoalItem(row) {
  return normalizeGoal({
    id: row.id,
    title: row.title,
    period: row.period,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
    repostCount: row.repost_count
  });
}

function mapGoalItemToDbRow(goal) {
  const normalized = normalizeGoal(goal);
  if (!normalized) return null;
  return {
    id: normalized.id,
    title: normalized.title,
    period: normalized.period,
    status: normalized.status,
    created_at: normalized.createdAt,
    updated_at: new Date().toISOString(),
    completed_at: normalized.completedAt,
    repost_count: normalized.repostCount || 0
  };
}

async function loadGoalsFromSource() {
  if (!sbClient) {
    state.goals = loadGoalsLocal();
    return;
  }

  const { data, error } = await sbClient
    .from(TABLE_CHRIS_GOALS)
    .select('id, title, period, status, created_at, updated_at, completed_at, repost_count')
    .order('created_at', { ascending: false });

  if (error) {
    state.goals = loadGoalsLocal();
    return;
  }

  state.goals = Array.isArray(data) ? data.map(mapDbRowToGoalItem).filter(Boolean) : [];
  saveGoalsLocal();
}

async function saveGoals(removedIds = []) {
  saveGoalsLocal();
  if (!sbClient) return;

  const normalized = state.goals.map(normalizeGoal).filter(Boolean);
  const rows = normalized.map(mapGoalItemToDbRow).filter(Boolean);

  if (rows.length > 0) {
    const { error: upsertError } = await sbClient
      .from(TABLE_CHRIS_GOALS)
      .upsert(rows, { onConflict: 'id' });
    if (upsertError) {
      console.error('Goals-Upsert fehlgeschlagen:', upsertError.message);
      return;
    }
  }

  const explicitRemoveIds = Array.isArray(removedIds)
    ? removedIds.map(id => String(id || '').trim()).filter(Boolean)
    : [];

  if (explicitRemoveIds.length > 0) {
    const { error: deleteError } = await sbClient
      .from(TABLE_CHRIS_GOALS)
      .delete()
      .in('id', explicitRemoveIds);
    if (deleteError) {
      console.error('Goals-Löschen für Sync fehlgeschlagen:', deleteError.message);
    }
  }
}

function renderGoalsBoard() {
  const activeEl = document.getElementById('activeGoalsBoard');
  const expiredEl = document.getElementById('expiredGoalsBoard');
  const completedEl = document.getElementById('completedGoalsBoard');
  if (!activeEl || !expiredEl || !completedEl) return;

  const normalizedGoals = state.goals.map(normalizeGoal).filter(Boolean);
  const active = normalizedGoals.filter(goal => goal.status === 'active' && !isGoalExpired(goal));
  const expired = normalizedGoals.filter(goal => goal.status === 'active' && isGoalExpired(goal));
  const completed = normalizedGoals.filter(goal => goal.status === 'completed');

  const activeGroups = [
    { key: 'day', title: 'Tag' },
    { key: 'week', title: 'Woche' },
    { key: 'month', title: 'Monat' },
    { key: 'year', title: 'Jahr' },
    { key: 'five_years', title: '5 Jahre' },
    { key: 'lifetime', title: 'Lifetime' }
  ];

  activeEl.innerHTML = activeGroups.map(group => {
    const entries = active.filter(goal => normalizeGoalPeriod(goal.period) === group.key);
    const list = entries.length
      ? entries.map(goal => `
          <article class="goal-item">
            <div class="goal-item-head">
              <strong>${escapeHtml(goal.title)}</strong>
              <span class="badge">${escapeHtml(goalPeriodLabel(goal.period))}</span>
            </div>
            <div class="small-note">Erstellt: ${new Date(goal.createdAt).toLocaleDateString('de-DE')}</div>
            <div class="goal-actions">
              <button class="secondary" data-goal-action="complete" data-goal-id="${goal.id}" title="Abgeschlossen">✓</button>
              <button class="danger" data-goal-action="delete" data-goal-id="${goal.id}" title="Löschen">✕</button>
            </div>
          </article>
        `).join('')
      : '<p class="small-note">Keine Ziele.</p>';

    return `
      <section class="goal-group">
        <h4>${group.title}</h4>
        <div class="goals-list">${list}</div>
      </section>
    `;
  }).join('');

  expiredEl.innerHTML = expired.length
    ? expired.map(goal => {
      const deadline = computeGoalDeadline(goal);
      return `
        <article class="goal-item goal-expired">
          <div class="goal-item-head">
            <strong>${escapeHtml(goal.title)}</strong>
            <span class="badge">${escapeHtml(goalPeriodLabel(goal.period))}</span>
          </div>
          <div class="small-note">Ablauf: ${deadline ? deadline.toLocaleDateString('de-DE') : '---'}</div>
          <div class="goal-actions">
            <button class="secondary" data-goal-action="complete" data-goal-id="${goal.id}" title="Abgeschlossen">✓</button>
            <button class="danger" data-goal-action="delete" data-goal-id="${goal.id}" title="Löschen">✕</button>
            <button class="secondary" data-goal-action="repost" data-goal-id="${goal.id}" title="Reposten">↻</button>
          </div>
        </article>
      `;
    }).join('')
    : '<p class="small-note">Keine abgelaufenen Ziele.</p>';

  completedEl.innerHTML = completed.length
    ? completed
      .sort((a, b) => String(b.completedAt || '').localeCompare(String(a.completedAt || '')))
      .map(goal => `
        <article class="goal-item goal-completed">
          <div class="goal-item-head">
            <strong>${escapeHtml(goal.title)}</strong>
            <span class="badge">${escapeHtml(goalPeriodLabel(goal.period))}</span>
          </div>
          <div class="small-note">Abgeschlossen: ${goal.completedAt ? new Date(goal.completedAt).toLocaleDateString('de-DE') : '---'}</div>
          <div class="goal-actions">
            <button class="secondary" data-goal-action="repost" data-goal-id="${goal.id}" title="Wieder aktivieren">↻</button>
            <button class="danger" data-goal-action="delete" data-goal-id="${goal.id}" title="Löschen">✕</button>
          </div>
        </article>
      `).join('')
    : '<p class="small-note">Noch keine abgeschlossenen Ziele.</p>';
}

async function handleGoalSubmit(event) {
  event.preventDefault();
  const titleInput = document.getElementById('goalTitle');
  const periodInput = document.getElementById('goalPeriod');
  const title = titleInput?.value.trim() || '';
  const period = normalizeGoalPeriod(periodInput?.value || 'month');
  if (!title) return;

  const nowIso = new Date().toISOString();
  const goal = normalizeGoal({
    id: buildId('goal'),
    title,
    period,
    status: 'active',
    createdAt: nowIso,
    updatedAt: nowIso,
    completedAt: null,
    repostCount: 0
  });

  if (!goal) return;
  state.goals.unshift(goal);
  await saveGoals();
  renderGoalsBoard();
  titleInput.value = '';
}

async function handleGoalActionClick(event) {
  const button = event.target.closest('[data-goal-action]');
  if (!button) return;
  const action = button.dataset.goalAction;
  const id = button.dataset.goalId;
  if (!action || !id) return;

  const index = state.goals.findIndex(goal => String(goal.id) === String(id));
  if (index < 0) return;

  const nowIso = new Date().toISOString();
  const removedIds = [];
  if (action === 'complete') {
    state.goals[index].status = 'completed';
    state.goals[index].completedAt = nowIso;
    state.goals[index].updatedAt = nowIso;
  }

  if (action === 'delete') {
    removedIds.push(String(state.goals[index].id));
    state.goals.splice(index, 1);
  }

  if (action === 'repost') {
    state.goals[index].status = 'active';
    state.goals[index].createdAt = nowIso;
    state.goals[index].updatedAt = nowIso;
    state.goals[index].completedAt = null;
    state.goals[index].repostCount = Number(state.goals[index].repostCount || 0) + 1;
  }

  await saveGoals(removedIds);
  renderGoalsBoard();
}

function detectConflicts(planItems) {
  const byDay = {};
  planItems.forEach(item => {
    if (!byDay[item.date]) byDay[item.date] = [];
    byDay[item.date].push(item);
  });

  const conflicts = [];
  Object.entries(byDay).forEach(([date, items]) => {
    const sorted = [...items].sort((a, b) => parseTime(a.start) - parseTime(b.start));
    for (let i = 0; i < sorted.length - 1; i += 1) {
      const current = sorted[i];
      const next = sorted[i + 1];
      if (parseTime(current.end) > parseTime(next.start)) {
        conflicts.push({ date, a: current, b: next });
      }
    }
  });

  return conflicts;
}

function renderCalendarMiniPreview(dayItems) {
  if (!dayItems.length) {
    return '<div class="calendar-preview-empty">frei</div>';
  }

  const sorted = [...dayItems].sort((a, b) => parseTime(a.start) - parseTime(b.start));
  const bars = sorted.slice(0, 4).map(item => {
    const start = parseTime(item.start);
    const end = parseTime(item.end);
    const safeStart = Math.max(0, Math.min(1440, start));
    const safeEnd = Math.max(safeStart + 1, Math.min(1440, end));
    const left = (safeStart / 1440) * 100;
    const width = ((safeEnd - safeStart) / 1440) * 100;
    const color = colorForItem(item);
    const border = priorityBorderColor(item.importance);
    const importanceRgb = priorityBorderRgb(item.importance);
    return `<span class="calendar-preview-bar term-colored" style="left:${left}%;width:${Math.max(2, width)}%;--term-color:${color};--importance-border:${border};--importance-rgb:${importanceRgb};" title="${escapeHtml(item.start)}-${escapeHtml(item.end)} ${escapeHtml(item.title)}"></span>`;
  }).join('');

  const labels = sorted.slice(0, 2).map(item => `${item.start}-${item.end}`).join(' | ');
  const more = sorted.length > 2 ? `<span class="calendar-preview-more">+${sorted.length - 2}</span>` : '';

  return `
    <div class="calendar-preview-track">${bars}</div>
    <div class="calendar-preview-label">${escapeHtml(labels)}${more}</div>
  `;
}

function renderCalendar() {
  const grid = document.getElementById('calendarGrid');
  const monthLabel = document.getElementById('monthLabel');
  if (!grid || !monthLabel) return;
  const todayKey = formatDateKey(new Date());

  const year = state.viewDate.getFullYear();
  const month = state.viewDate.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startWeekday = (first.getDay() + 6) % 7;

  monthLabel.textContent = first.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });

  const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  let html = dayNames.map(name => `<div class="calendar-head">${name}</div>`).join('');

  for (let i = 0; i < startWeekday; i += 1) {
    html += '<div class="calendar-cell empty"></div>';
  }

  for (let d = 1; d <= last.getDate(); d += 1) {
    const date = new Date(year, month, d);
    const key = formatDateKey(date);
    const dayItems = state.plan
      .map(item => projectPlanItemToDate(item, key))
      .filter(Boolean);
    const strongestImportance = dayItems.some(item => normalizeImportance(item.importance) === 's')
      ? 's'
      : (dayItems.some(item => normalizeImportance(item.importance) === 'r') ? 'r' : 'n');
    const hasItemsClass = dayItems.length ? `has-items importance-${strongestImportance}` : '';
    const selected = key === state.selectedDate;
    const today = key === todayKey;
    html += `
      <button class="calendar-cell ${hasItemsClass} ${selected ? 'selected' : ''} ${today ? 'today' : ''}" data-date="${key}">
        <div class="calendar-cell-head">
          <span class="calendar-day">${d}</span>
          ${dayItems.length ? `<span class="calendar-dot">${dayItems.length}</span>` : ''}
        </div>
        <div class="calendar-preview">${renderCalendarMiniPreview(dayItems)}</div>
      </button>
    `;
  }

  grid.innerHTML = html;
}

function renderDayPlan() {
  const dateLabel = document.getElementById('selectedDateLabel');
  const list = document.getElementById('dayPlanList');
  const conflictsEl = document.getElementById('selectedDayConflicts');
  if (!dateLabel || !list || !conflictsEl) return;

  const selectedItems = state.plan
    .map(item => projectPlanItemToDate(item, state.selectedDate))
    .filter(Boolean)
    .sort((a, b) => parseTime(a.start) - parseTime(b.start));

  const selectedDateObj = parseDateKey(state.selectedDate);
  dateLabel.textContent = selectedDateObj.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });

  const conflicts = detectConflicts(selectedItems);
  if (conflicts.length) {
    conflictsEl.innerHTML = `<span style="color:#ffb347;">Achtung: ${conflicts.length} Überschneidung(en) erkannt.</span>`;
  } else {
    conflictsEl.textContent = 'Keine Überschneidungen an diesem Tag.';
  }

  if (!selectedItems.length) {
    list.innerHTML = '<div class="timebox-item"><strong>Kein Termin</strong><p class="small-note">Für diesen Tag ist noch nichts eingetragen.</p></div>';
    return;
  }

  list.innerHTML = selectedItems.map(item => `
    <article class="timebox-item term-colored ${importanceClass(item.importance)}" style="--term-color:${colorForItem(item)};--importance-border:${priorityBorderColor(item.importance)};">
      <header>
        <strong>${escapeHtml(item.start)} - ${escapeHtml(item.end)}</strong>
      </header>
      <p>${escapeHtml(item.title)}</p>
      ${item.multiDay ? `<p class="small-note">Mehrtägig: ${escapeHtml(item.rangeStart)} bis ${escapeHtml(item.rangeEnd)}</p>` : ''}
      ${item.note ? `<p class="small-note">${escapeHtml(item.note)}</p>` : ''}
    </article>
  `).join('');
}

function colorForItem(item) {
  const explicit = normalizeTermColor(item?.color);
  if (explicit) return explicit;
  return '#7ad0ff';
}

function segmentBlocks(items, segStart, segEnd) {
  return items
    .map(item => {
      const itemStart = parseTime(item.start);
      const itemEnd = parseTime(item.end);
      const overlapStart = Math.max(segStart, itemStart);
      const overlapEnd = Math.min(segEnd, itemEnd);
      if (overlapEnd <= overlapStart) return null;
      const left = ((overlapStart - segStart) / (segEnd - segStart)) * 100;
      const width = ((overlapEnd - overlapStart) / (segEnd - segStart)) * 100;
      return {
        title: item.title,
        start: item.start,
        end: item.end,
        importance: normalizeImportance(item.importance),
        color: colorForItem(item),
        borderColor: priorityBorderColor(item.importance),
        left: Math.max(0, Math.min(100, left)),
        width: Math.max(1, Math.min(100, width))
      };
    })
    .filter(Boolean);
}

function renderSegmentCell(items, segStart, segEnd) {
  const blocks = segmentBlocks(items, segStart, segEnd);
  const blockHtml = blocks
    .map((block, index) => `
      <span class="segment-block term-colored" style="left:${block.left}%; width:${block.width}%; --term-color:${block.color}; --importance-border:${block.borderColor}; top:${3 + (index * 2)}px;" title="${escapeHtml(block.start)}-${escapeHtml(block.end)} ${escapeHtml(block.title)}"></span>
    `)
    .join('');

  const labels = blocks.slice(0, 2).map(block => `${block.start}-${block.end} ${block.title}`).join(' | ');

  return `
    <td class="segment-cell">
      <div class="segment-track">${blockHtml}</div>
      <div class="segment-note">${escapeHtml(labels)}</div>
    </td>
  `;
}

function renderDayTimeboxModal() {
  const subtitle = document.getElementById('dayTimeboxSubtitle');
  const conflictsEl = document.getElementById('dayTimeboxConflicts');
  const body = document.getElementById('dayTimeboxBody');
  if (!subtitle || !conflictsEl || !body) return;

  const selectedDateObj = parseDateKey(state.selectedDate);
  subtitle.textContent = selectedDateObj.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });

  const dayItems = state.plan
    .map(item => projectPlanItemToDate(item, state.selectedDate))
    .filter(Boolean)
    .sort((a, b) => parseTime(a.start) - parseTime(b.start));

  const conflicts = detectConflicts(dayItems);
  conflictsEl.innerHTML = conflicts.length
    ? `<span style="color:#ffb347;">${conflicts.length} Überschneidung(en) erkannt.</span>`
    : '<span>Keine Überschneidungen an diesem Tag.</span>';

  let rows = '';
  for (let hour = 0; hour < 24; hour += 1) {
    const label = `${String(hour).padStart(2, '0')}:00`;
    const segAStart = hour * 60;
    const segAEnd = segAStart + 30;
    const segBStart = segAEnd;
    const segBEnd = segAStart + 60;

    rows += `
      <tr>
        <td class="hour-label">${label}</td>
        ${renderSegmentCell(dayItems, segAStart, segAEnd)}
        ${renderSegmentCell(dayItems, segBStart, segBEnd)}
      </tr>
    `;
  }

  body.innerHTML = rows;
}

function openDayTimeboxModal() {
  const modal = document.getElementById('dayTimeboxModal');
  if (!modal) return;
  renderDayTimeboxModal();
  modal.classList.add('open');
}

function closeDayTimeboxModal() {
  document.getElementById('dayTimeboxModal')?.classList.remove('open');
}

function appendChatMessage(sender, text, role = 'assistant') {
  const log = document.getElementById('planChatLog');
  if (!log) return;
  const item = document.createElement('article');
  item.className = 'task-card';
  item.innerHTML = `<header><h3 style="color:${role === 'user' ? '#7dd0ff' : '#ff8c00'};">${sender}</h3></header><p>${text}</p>`;
  log.appendChild(item);
  log.scrollTop = log.scrollHeight;
}

function renderChatHistory() {
  const log = document.getElementById('planChatLog');
  if (!log) return;
  log.innerHTML = '';
  state.chat.forEach(msg => {
    if (msg.role === 'user') {
      appendChatMessage('Du', escapeHtml(msg.content), 'user');
    } else {
      appendChatMessage('Plan-KI', msg.content, 'assistant');
    }
  });

  if (!state.chat.length) {
    appendChatMessage('Plan-KI', 'Hi, ich kann deinen Plan ändern, Fragen dazu beantworten und auf Überschneidungen hinweisen.');
  }
}

function sortedTodos() {
  const order = { s: 0, r: 1, n: 2 };
  return [...state.todos]
    .map(normalizeTodo)
    .filter(Boolean)
    .sort((a, b) => {
      const ai = normalizeImportance(a.importance);
      const bi = normalizeImportance(b.importance);
      if (order[ai] !== order[bi]) return order[ai] - order[bi];
      return String(b.createdAt).localeCompare(String(a.createdAt));
    });
}

function renderTodoBoard() {
  const board = document.getElementById('todoBoard');
  const summary = document.getElementById('todoSummary');
  const completedBoard = document.getElementById('completedTodoBoard');
  if (!board || !summary || !completedBoard) return;

  const todos = sortedTodos();
  const activeTodos = todos.filter(item => item.status === 'active');
  const completedTodos = todos.filter(item => item.status === 'completed');
  const groups = {
    s: activeTodos.filter(item => normalizeImportance(item.importance) === 's'),
    r: activeTodos.filter(item => normalizeImportance(item.importance) === 'r'),
    n: activeTodos.filter(item => normalizeImportance(item.importance) === 'n')
  };

  summary.textContent = `Aktiv: ${activeTodos.length} | Erledigt: ${completedTodos.length} | urgent: ${groups.s.length}, sometime: ${groups.r.length}, anytime: ${groups.n.length}`;

  const groupOrder = [
    { key: 's', title: 'urgent - höchste Priorität' },
    { key: 'r', title: 'sometime - mittlere Priorität' },
    { key: 'n', title: 'anytime - flexible Priorität' }
  ];

  board.innerHTML = groupOrder.map(group => {
    const items = groups[group.key];
    const listHtml = items.length
      ? items.map(item => `
          <article class="todo-item ${importanceClass(item.importance)}">
            <div class="todo-item-head">
              <strong>${escapeHtml(item.title)}</strong>
              <span class="badge ${importanceClass(item.importance)}">${escapeHtml(todoPriorityLabel(item.importance))}</span>
            </div>
            <div class="todo-time">Erstellt: ${new Date(item.createdAt).toLocaleDateString('de-DE')}</div>
            ${item.note ? `<p class="small-note">${escapeHtml(item.note)}</p>` : ''}
            <div class="todo-actions">
              <button class="secondary" data-todo-action="complete" data-todo-id="${item.id}" title="Abhaken">✓</button>
              <button class="danger" data-todo-action="delete" data-todo-id="${item.id}" title="Löschen">✕</button>
            </div>
          </article>
        `).join('')
      : '<p class="small-note">Keine Einträge in dieser Klasse.</p>';

    return `
      <section class="todo-group ${importanceClass(group.key)}">
        <h3>${group.title}</h3>
        <div class="todo-list">${listHtml}</div>
      </section>
    `;
  }).join('');

  completedBoard.innerHTML = completedTodos.length
    ? completedTodos.map(item => `
        <article class="todo-item completed ${importanceClass(item.importance)}">
          <div class="todo-item-head">
            <strong>${escapeHtml(item.title)}</strong>
            <span class="badge ${importanceClass(item.importance)}">${escapeHtml(todoPriorityLabel(item.importance))}</span>
          </div>
          <div class="todo-time">Erledigt: ${item.completedAt ? new Date(item.completedAt).toLocaleDateString('de-DE') : '---'}</div>
          ${item.note ? `<p class="small-note">${escapeHtml(item.note)}</p>` : ''}
        </article>
      `).join('')
    : '<p class="small-note">Noch keine erledigten Todos.</p>';
}

async function handleTodoSubmit(event) {
  event.preventDefault();
  const titleInput = document.getElementById('todoTitle');
  const importanceInput = document.getElementById('todoImportance');
  const noteInput = document.getElementById('todoNote');
  const title = titleInput?.value.trim() || '';
  if (!title) return;

  const nowIso = new Date().toISOString();
  const todo = normalizeTodo({
    id: buildId('todo'),
    title,
    importance: normalizeImportance(importanceInput?.value || 'n'),
    status: 'active',
    note: noteInput?.value || '',
    createdAt: nowIso,
    updatedAt: nowIso,
    completedAt: null
  });

  if (!todo) return;
  state.todos.unshift(todo);
  await saveTodos();
  renderTodoBoard();
  titleInput.value = '';
  if (noteInput) noteInput.value = '';
}

async function handleTodoActionClick(event) {
  const button = event.target.closest('[data-todo-action]');
  if (!button) return;
  const action = button.dataset.todoAction;
  const id = button.dataset.todoId;
  if (!action || !id) return;

  const index = state.todos.findIndex(todo => String(todo.id) === String(id));
  if (index < 0) return;

  const nowIso = new Date().toISOString();
  const removedIds = [];
  if (action === 'complete') {
    state.todos[index].status = 'completed';
    state.todos[index].completedAt = nowIso;
    state.todos[index].updatedAt = nowIso;
  }

  if (action === 'delete') {
    removedIds.push(String(state.todos[index].id));
    state.todos.splice(index, 1);
  }

  await saveTodos(removedIds);
  renderTodoBoard();
}

function setMode(mode) {
  const view = document.getElementById('planViewSection');
  const edit = document.getElementById('planEditSection');
  const todo = document.getElementById('todoSection');
  const goals = document.getElementById('goalsSection');
  if (!view || !edit || !todo || !goals) return;

  state.mode = mode;

  if (mode === 'edit') {
    view.style.display = 'none';
    edit.style.display = 'block';
    todo.style.display = 'none';
    goals.style.display = 'none';
  } else if (mode === 'todo') {
    view.style.display = 'none';
    edit.style.display = 'none';
    todo.style.display = 'block';
    goals.style.display = 'none';
    renderTodoBoard();
  } else if (mode === 'goals') {
    view.style.display = 'none';
    edit.style.display = 'none';
    todo.style.display = 'none';
    goals.style.display = 'block';
    renderGoalsBoard();
  } else {
    view.style.display = 'block';
    edit.style.display = 'none';
    todo.style.display = 'none';
    goals.style.display = 'none';
  }
}

function normalizePlanItem(item) {
  if (!item || typeof item !== 'object') return null;
  if (!item.date || !item.start || !item.end || !item.title) return null;
  const date = normalizeDateKey(item.date);
  const endDate = normalizeDateKey(item.endDate) || date;
  if (!date) return null;
  return {
    id: item.id || `plan-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date,
    start: String(item.start).slice(0, 5),
    end: String(item.end).slice(0, 5),
    title: String(item.title).slice(0, 140),
    note: String(item.note || '').slice(0, 300),
    importance: normalizeImportance(item.importance),
    color: normalizeTermColor(item.color),
    endDate: endDate < date ? date : endDate,
    seriesId: String(item.seriesId || '')
  };
}

function planIdentityKey(item) {
  const normalized = normalizePlanItem(item);
  if (!normalized) return '';
  const titleKey = String(normalized.title || '').trim().toLowerCase();
  const seriesKey = String(normalized.seriesId || '').trim().toLowerCase();
  return [
    normalized.date,
    rangeEndDate(normalized),
    normalized.start,
    normalized.end,
    titleKey,
    seriesKey
  ].join('|');
}

function isBulkClearRequest(text) {
  const value = String(text || '').toLowerCase();
  if (!value) return false;
  return /(alle termine loeschen|alle termine löschen|kalender leeren|alles loeschen|alles löschen|clear calendar|wipe calendar)/.test(value);
}

function isPlanDeleteRequest(text) {
  const value = String(text || '').toLowerCase();
  if (!value) return false;
  const deleteVerb = /(loesch|lösch|entfern|streich|delete|remove)/.test(value);
  const planContext = /(termin|kalender|eintrag|aktivitaet|aktivität|zeitblock|event)/.test(value);
  return deleteVerb && planContext;
}

function isBulkTodoClearRequest(text) {
  const value = String(text || '').toLowerCase();
  if (!value) return false;
  return /(alle todos loeschen|alle todos löschen|todo liste leeren|todo-liste leeren|todos leeren|clear todos|wipe todos|alle aufgaben loeschen|alle aufgaben löschen)/.test(value);
}

function isTodoDeleteRequest(text) {
  const value = String(text || '').toLowerCase();
  if (!value) return false;
  const deleteVerb = /(loesch|lösch|entfern|streich|delete|remove)/.test(value);
  const todoContext = /(todo|to do|aufgabe|aufgaben|eintrag)/.test(value);
  return deleteVerb && todoContext;
}

function isBulkGoalClearRequest(text) {
  const value = String(text || '').toLowerCase();
  if (!value) return false;
  return /(alle ziele loeschen|alle ziele löschen|ziele leeren|goals leeren|clear goals|wipe goals)/.test(value);
}

function isGoalDeleteRequest(text) {
  const value = String(text || '').toLowerCase();
  if (!value) return false;
  const deleteVerb = /(loesch|lösch|entfern|streich|delete|remove)/.test(value);
  const goalContext = /(ziel|ziele|goal|goals)/.test(value);
  return deleteVerb && goalContext;
}

function todoIdentityKey(item) {
  const normalized = normalizeTodo(item);
  if (!normalized) return '';
  return [
    String(normalized.title || '').trim().toLowerCase(),
    String(normalized.note || '').trim().toLowerCase(),
    normalizeImportance(normalized.importance)
  ].join('|');
}

function goalIdentityKey(item) {
  const normalized = normalizeGoal(item);
  if (!normalized) return '';
  return [
    String(normalized.title || '').trim().toLowerCase(),
    normalizeGoalPeriod(normalized.period),
    String(normalized.status || 'active').toLowerCase()
  ].join('|');
}

function stabilizeUpdatedTodos(updatedTodos, currentTodos, userText) {
  const current = (Array.isArray(currentTodos) ? currentTodos : []).map(normalizeTodo).filter(Boolean);
  const incoming = (Array.isArray(updatedTodos) ? updatedTodos : []).map(normalizeTodo).filter(Boolean);
  if (!incoming.length) return incoming;

  const currentById = new Map(current.map(item => [String(item.id), item]));
  const currentByKey = new Map(current.map(item => [todoIdentityKey(item), item]));

  const stabilized = incoming.map(item => {
    const rawId = String(item.id || '').trim();
    if (rawId && currentById.has(rawId)) {
      return { ...item, id: rawId };
    }

    const keyMatch = currentByKey.get(todoIdentityKey(item));
    if (keyMatch?.id) {
      return { ...item, id: keyMatch.id };
    }

    return { ...item, id: rawId || buildId('todo') };
  });

  const dedupById = new Map();
  stabilized.forEach(item => dedupById.set(String(item.id), item));
  const deduped = [...dedupById.values()];

  const clearRequested = isBulkTodoClearRequest(userText);
  const deleteRequested = isTodoDeleteRequest(userText);
  const suspiciousPartial = !clearRequested
    && !deleteRequested
    && current.length > 0
    && deduped.length > 0
    && deduped.length < current.length;

  if (!suspiciousPartial) return deduped;

  const mergedById = new Map(current.map(item => [String(item.id), item]));
  deduped.forEach(item => mergedById.set(String(item.id), item));
  return [...mergedById.values()];
}

function stabilizeUpdatedGoals(updatedGoals, currentGoals, userText) {
  const current = (Array.isArray(currentGoals) ? currentGoals : []).map(normalizeGoal).filter(Boolean);
  const incoming = (Array.isArray(updatedGoals) ? updatedGoals : []).map(normalizeGoal).filter(Boolean);
  if (!incoming.length) return incoming;

  const currentById = new Map(current.map(item => [String(item.id), item]));
  const currentByKey = new Map(current.map(item => [goalIdentityKey(item), item]));

  const stabilized = incoming.map(item => {
    const rawId = String(item.id || '').trim();
    if (rawId && currentById.has(rawId)) {
      return { ...item, id: rawId };
    }

    const keyMatch = currentByKey.get(goalIdentityKey(item));
    if (keyMatch?.id) {
      return { ...item, id: keyMatch.id };
    }

    return { ...item, id: rawId || buildId('goal') };
  });

  const dedupById = new Map();
  stabilized.forEach(item => dedupById.set(String(item.id), item));
  const deduped = [...dedupById.values()];

  const clearRequested = isBulkGoalClearRequest(userText);
  const deleteRequested = isGoalDeleteRequest(userText);
  const suspiciousPartial = !clearRequested
    && !deleteRequested
    && current.length > 0
    && deduped.length > 0
    && deduped.length < current.length;

  if (!suspiciousPartial) return deduped;

  const mergedById = new Map(current.map(item => [String(item.id), item]));
  deduped.forEach(item => mergedById.set(String(item.id), item));
  return [...mergedById.values()];
}

function stabilizeUpdatedPlan(updatedPlan, currentPlan, userText) {
  const current = (Array.isArray(currentPlan) ? currentPlan : []).map(normalizePlanItem).filter(Boolean);
  const incoming = (Array.isArray(updatedPlan) ? updatedPlan : []).map(normalizePlanItem).filter(Boolean);
  if (!incoming.length) return incoming;

  const currentById = new Map(current.map(item => [String(item.id), item]));
  const currentByKey = new Map(current.map(item => [planIdentityKey(item), item]));

  const stabilized = incoming.map(item => {
    const rawId = String(item.id || '').trim();
    if (rawId && currentById.has(rawId)) {
      return { ...item, id: rawId };
    }

    const keyMatch = currentByKey.get(planIdentityKey(item));
    if (keyMatch?.id) {
      return { ...item, id: keyMatch.id };
    }

    return { ...item, id: rawId || buildId('plan') };
  });

  const dedupById = new Map();
  stabilized.forEach(item => dedupById.set(String(item.id), item));
  const deduped = [...dedupById.values()];

  const clearRequested = isBulkClearRequest(userText);
  const deleteRequested = isPlanDeleteRequest(userText);
  const suspiciousPartial = !clearRequested
    && !deleteRequested
    && current.length > 0
    && deduped.length > 0
    && deduped.length < current.length;

  if (!suspiciousPartial) return deduped;

  const mergedById = new Map(current.map(item => [String(item.id), item]));
  deduped.forEach(item => mergedById.set(String(item.id), item));
  return [...mergedById.values()];
}

function isQuestionOnlyPrompt(text) {
  const value = String(text || '').trim().toLowerCase();
  if (!value) return false;
  const hasQuestionMark = value.includes('?');
  const startsWithQuestionWord = /^(wann|was|welche|welcher|welches|wie|wo|habe|hast|gibt|sind|ist|zeige|nenn|liste)/.test(value);
  const hasChangeVerb = /(verschieb|aendere|ändere|erstelle|fueg|füg|loesch|lösch|setze|plane|trag ein|eintragen)/.test(value);
  return (hasQuestionMark || startsWithQuestionWord) && !hasChangeVerb;
}

function isTodoSchedulingQuestion(text) {
  const value = String(text || '').trim().toLowerCase();
  if (!value) return false;
  const hasTodoWord = /(todo|to do|aufgabe|aufgaben|eintrag|einträge)/.test(value);
  const asksForTime = /(wann|welche zeit|zeit dafür|zeit dafuer|wann wäre|wann waere|zeitfenster|slot)/.test(value);
  const asksToInsert = /(trage|eintragen|plane|hinzufuegen|hinzufügen|setze in kalender|in den kalender)/.test(value);
  return hasTodoWord && (asksForTime || asksToInsert);
}

function buildTodoInsights(todos) {
  const normalized = todos.map(normalizeTodo).filter(Boolean);
  const active = normalized.filter(todo => todo.status === 'active');
  const completed = normalized.filter(todo => todo.status === 'completed');
  const lines = active
    .slice(0, 80)
    .map(todo => `${todo.title} (${todoPriorityLabel(todo.importance)})${todo.note ? ' - ' + todo.note : ''}`)
    .join(' | ');
  return [
    `Aktive Todos: ${active.length}`,
    lines ? `Liste: ${lines}` : 'Liste: keine aktiven Todos',
    `Erledigte Todos: ${completed.length}`
  ].join('\n');
}

function isGoalRequest(text) {
  const value = String(text || '').trim().toLowerCase();
  if (!value) return false;
  return /(ziel|ziele|goal|goals|tagziel|wochenziel|monatsziel|jahresziel|lifetime)/.test(value);
}

function isInternetLookupRequest(text) {
  const value = String(text || '').trim().toLowerCase();
  if (!value) return false;
  const asksDate = /(wann|datum|termin|an welchem tag|welches datum|findet .* statt)/.test(value);
  const eventLike = /(marathon|lauf|rennen|event|konzert|messe|meisterschaft|festival|conference|konferenz)/.test(value);
  const explicitWeb = /(internet|online|nachgucken|recherchier|recherchiere|such im web|google)/.test(value);
  return (asksDate && eventLike) || explicitWeb;
}

function extractExplicitImportance(text) {
  const value = String(text || '').trim().toLowerCase();
  if (!value) return null;

  if (/(priorit[aä]t\s*[:=]?\s*(hoch|high|urgent|strict|s)\b|\b(hoch|high|urgent|strict)\b)/.test(value)) return 's';
  if (/(priorit[aä]t\s*[:=]?\s*(mittel|medium|reserved|sometime|r)\b|\b(mittel|medium|reserved|sometime)\b)/.test(value)) return 'r';
  if (/(priorit[aä]t\s*[:=]?\s*(niedrig|low|anytime|n)\b|\b(niedrig|low|anytime)\b)/.test(value)) return 'n';

  return null;
}

function isPlanMutationPrompt(text) {
  const value = String(text || '').trim().toLowerCase();
  if (!value) return false;

  const hasMutationVerb = /(verschieb|aendere|ändere|erstelle|fueg|füg|loesch|lösch|setze|plane|trag\s*ein|eintragen|anlegen|ergaenz|ergänz|update)/.test(value);
  const hasPlanContext = /(termin|kalender|aktivitaet|aktivität|uhr|von\s+\d{1,2}:\d{2}|bis\s+\d{1,2}:\d{2}|heute|morgen|uebermorgen|übermorgen|montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag|\d{4}-\d{2}-\d{2})/.test(value);
  return hasMutationVerb && hasPlanContext;
}

function shouldAskForPriority(text) {
  if (!isPlanMutationPrompt(text)) return false;
  if (isQuestionOnlyPrompt(text)) return false;
  if (isTodoSchedulingQuestion(text)) return false;
  if (isGoalRequest(text)) return false;
  return !extractExplicitImportance(text);
}

function priorityPromptLabel(code) {
  if (code === 's') return 'hoch (strict / s)';
  if (code === 'r') return 'mittel (reserved / r)';
  return 'niedrig (anytime / n)';
}

function isMultiDayPlanPrompt(text) {
  const value = String(text || '').trim().toLowerCase();
  if (!value) return false;
  if (/(mehrt[aä]gig|mehrtaegig|mehrere tage|ganzt[aä]gig|ganztag|serie|wiederholt|t[aä]glich|w[öo]chentlich)/.test(value)) return true;
  if (/\b(von|ab)\b.*\b(bis)\b/.test(value)) return true;
  if (/\d{4}-\d{2}-\d{2}\s*(bis|-)\s*\d{4}-\d{2}-\d{2}/.test(value)) return true;
  return false;
}

function buildPriorityQuestion(text) {
  if (isMultiDayPlanPrompt(text)) {
    return 'Welche Priorität soll ich für den mehrtägigen Termin setzen? Bitte antworte mit hoch (strict/s), mittel (reserved/r) oder niedrig (anytime/n).';
  }
  return 'Welche Priorität soll ich setzen? Bitte antworte mit hoch (strict/s), mittel (reserved/r) oder niedrig (anytime/n).';
}

function buildGoalsInsights(goals) {
  const normalized = goals.map(normalizeGoal).filter(Boolean);
  const active = normalized.filter(goal => goal.status === 'active' && !isGoalExpired(goal));
  const expired = normalized.filter(goal => goal.status === 'active' && isGoalExpired(goal));
  const completed = normalized.filter(goal => goal.status === 'completed');

  const activeLines = active
    .slice(0, 60)
    .map(goal => `${goal.title} [${goalPeriodLabel(goal.period)}] seit ${new Date(goal.createdAt).toLocaleDateString('de-DE')}`)
    .join(' | ');

  const expiredLines = expired
    .slice(0, 40)
    .map(goal => `${goal.title} [${goalPeriodLabel(goal.period)}]`)
    .join(' | ');

  const completedLines = completed
    .slice(0, 40)
    .map(goal => `${goal.title} [${goalPeriodLabel(goal.period)}]`)
    .join(' | ');

  return [
    `Aktiv: ${active.length}`,
    activeLines ? `Aktive Ziele: ${activeLines}` : 'Aktive Ziele: keine',
    `Abgelaufen: ${expired.length}`,
    expiredLines ? `Abgelaufene Ziele: ${expiredLines}` : 'Abgelaufene Ziele: keine',
    `Abgeschlossen: ${completed.length}`,
    completedLines ? `Abgeschlossene Ziele: ${completedLines}` : 'Abgeschlossene Ziele: keine'
  ].join('\n');
}

function buildCalendarInsights(planItems) {
  const sorted = [...planItems].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return parseTime(a.start) - parseTime(b.start);
  });

  const grouped = {};
  sorted.forEach(item => {
    if (!grouped[item.date]) grouped[item.date] = [];
    grouped[item.date].push(item);
  });

  const lines = Object.entries(grouped)
    .map(([date, items]) => {
      const preview = items
        .slice(0, 6)
        .map(item => {
          const endDate = rangeEndDate(item);
          const span = endDate !== item.date ? ` ${item.date}->${endDate}` : '';
          const color = normalizeTermColor(item.color);
          const colorInfo = color ? ` color=${color}` : '';
          return `${item.start}-${item.end} ${item.title}${span} (${normalizeImportance(item.importance)}${colorInfo})`;
        })
        .join(' | ');
      const more = items.length > 6 ? ` | +${items.length - 6} weitere` : '';
      return `${date}: ${preview}${more}`;
    })
    .slice(0, 60);

  return lines.join('\n');
}

async function askPlanAI(userText) {
  const enrichedUserText = enrichUserPromptWithColorHint(userText);
  const now = getNowContext();
  const normalizedPlan = state.plan.map(normalizePlanItem).filter(Boolean);
  const normalizedGoals = state.goals.map(normalizeGoal).filter(Boolean);
  const normalizedTodos = state.todos.map(normalizeTodo).filter(Boolean);
  const payload = {
    mode: 'plan',
    message: enrichedUserText,
    plan: normalizedPlan,
    todos: normalizedTodos,
    todoInsights: buildTodoInsights(normalizedTodos),
    goals: normalizedGoals,
    goalsInsights: buildGoalsInsights(normalizedGoals),
    calendarInsights: buildCalendarInsights(normalizedPlan),
    questionOnly: isQuestionOnlyPrompt(userText),
    todoSchedulingQuestion: isTodoSchedulingQuestion(userText),
    goalRequest: isGoalRequest(userText),
    internetLookup: isInternetLookupRequest(userText),
    currentMode: state.mode,
    selectedDate: state.selectedDate,
    currentDate: now.currentDate,
    currentTime: now.currentTime,
    timezone: now.timezone,
    history: state.chat.slice(-16)
  };

  const response = await fetch(PLAN_CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    return { reply: 'Ich kann den Plan gerade nicht aktualisieren. Versuch es gleich nochmal.', updatedPlan: null, conflicts: [], questions: [] };
  }

  const data = await response.json().catch(() => null);
  if (!data || typeof data.reply !== 'string') {
    return { reply: 'Ich habe keine verwertbare Antwort bekommen. Formuliere bitte nochmal.', updatedPlan: null, conflicts: [], questions: [] };
  }

  let normalizedUpdatedPlan = null;
  if (Array.isArray(data.updatedPlan)) {
    const stabilizedPlan = stabilizeUpdatedPlan(data.updatedPlan, state.plan, userText);
    normalizedUpdatedPlan = (stabilizedPlan.length === 0 && !isBulkClearRequest(userText)) ? null : stabilizedPlan;
  }

  let normalizedUpdatedGoals = null;
  if (Array.isArray(data.updatedGoals)) {
    const stabilizedGoals = stabilizeUpdatedGoals(data.updatedGoals, state.goals, userText);
    normalizedUpdatedGoals = (stabilizedGoals.length === 0 && !isBulkGoalClearRequest(userText)) ? null : stabilizedGoals;
  }

  let normalizedUpdatedTodos = null;
  if (Array.isArray(data.updatedTodos)) {
    const stabilizedTodos = stabilizeUpdatedTodos(data.updatedTodos, state.todos, userText);
    normalizedUpdatedTodos = (stabilizedTodos.length === 0 && !isBulkTodoClearRequest(userText)) ? null : stabilizedTodos;
  }

  return {
    reply: data.reply,
    updatedPlan: Array.isArray(normalizedUpdatedPlan) ? assignMissingPlanColors(normalizedUpdatedPlan) : normalizedUpdatedPlan,
    updatedGoals: normalizedUpdatedGoals,
    updatedTodos: normalizedUpdatedTodos,
    conflicts: Array.isArray(data.conflicts) ? data.conflicts.slice(0, 6) : [],
    questions: Array.isArray(data.questions) ? data.questions.slice(0, 4) : []
  };
}

async function handlePlanChatSubmit(event) {
  event.preventDefault();
  const input = document.getElementById('planChatInput');
  const text = input?.value.trim() || '';
  if (!text) return;

  input.value = '';
  state.chat.push({ role: 'user', content: text });
  appendChatMessage('Du', escapeHtml(text), 'user');

  if (state.pendingPriorityPrompt) {
    const selectedPriority = extractExplicitImportance(text);
    if (!selectedPriority) {
      const askAgain = 'Ich brauche noch eine Priorität: hoch (strict/s), mittel (reserved/r) oder niedrig (anytime/n).';
      state.chat.push({ role: 'assistant', content: escapeHtml(askAgain) });
      saveChatHistory();
      appendChatMessage('Plan-KI', escapeHtml(askAgain), 'assistant');
      return;
    }

    const pendingInstruction = state.pendingPriorityPrompt;
    state.pendingPriorityPrompt = null;
    const combinedText = `${pendingInstruction}\n\nPriorität (verbindlich): ${priorityPromptLabel(selectedPriority)}.`;

    let result;
    try {
      result = await askPlanAI(combinedText);
    } catch (error) {
      result = { reply: 'Die Verbindung zur Plan-KI ist gerade gestört. Bitte versuche es erneut.', updatedPlan: null, conflicts: [], questions: [] };
    }

    if (Array.isArray(result.updatedPlan)) {
      const existingPlanIds = new Set(state.plan.map(item => String(item?.id || '')).filter(Boolean));
      state.plan = result.updatedPlan;
      const nextPlanIds = new Set(state.plan.map(item => String(item?.id || '')).filter(Boolean));
      const removedPlanIds = [...existingPlanIds].filter(id => !nextPlanIds.has(id));
      await savePlan(removedPlanIds);
      renderCalendar();
      renderDayPlan();
      renderTodoBoard();
      if (document.getElementById('dayTimeboxModal')?.classList.contains('open')) {
        renderDayTimeboxModal();
      }
    }

    if (Array.isArray(result.updatedGoals)) {
      const existingGoalIds = new Set(state.goals.map(goal => String(goal?.id || '')).filter(Boolean));
      state.goals = result.updatedGoals;
      const nextGoalIds = new Set(state.goals.map(goal => String(goal?.id || '')).filter(Boolean));
      const removedGoalIds = [...existingGoalIds].filter(id => !nextGoalIds.has(id));
      await saveGoals(removedGoalIds);
      renderGoalsBoard();
    }

    if (Array.isArray(result.updatedTodos)) {
      const existingTodoIds = new Set(state.todos.map(todo => String(todo?.id || '')).filter(Boolean));
      state.todos = result.updatedTodos;
      const nextTodoIds = new Set(state.todos.map(todo => String(todo?.id || '')).filter(Boolean));
      const removedTodoIds = [...existingTodoIds].filter(id => !nextTodoIds.has(id));
      await saveTodos(removedTodoIds);
      renderTodoBoard();
    }

    const extra = [];
    if (result.conflicts?.length) {
      extra.push(`<p class="small-note" style="color:#ffb347;"><strong>Überschneidungen:</strong> ${escapeHtml(result.conflicts.join(' | '))}</p>`);
    }
    if (result.questions?.length) {
      extra.push(`<p class="small-note"><strong>Rückfragen:</strong> ${escapeHtml(result.questions.join(' | '))}</p>`);
    }

    const answerHtml = `${escapeHtml(result.reply)}${extra.join('')}`;
    state.chat.push({ role: 'assistant', content: answerHtml });
    saveChatHistory();
    appendChatMessage('Plan-KI', answerHtml, 'assistant');
    return;
  }

  if (shouldAskForPriority(text)) {
    state.pendingPriorityPrompt = text;
    const askPriority = buildPriorityQuestion(text);
    state.chat.push({ role: 'assistant', content: escapeHtml(askPriority) });
    saveChatHistory();
    appendChatMessage('Plan-KI', escapeHtml(askPriority), 'assistant');
    return;
  }

  let result;
  try {
    result = await askPlanAI(text);
  } catch (error) {
    result = { reply: 'Die Verbindung zur Plan-KI ist gerade gestört. Bitte versuche es erneut.', updatedPlan: null, conflicts: [], questions: [] };
  }

  if (Array.isArray(result.updatedPlan)) {
    const existingPlanIds = new Set(state.plan.map(item => String(item?.id || '')).filter(Boolean));
    state.plan = result.updatedPlan;
    const nextPlanIds = new Set(state.plan.map(item => String(item?.id || '')).filter(Boolean));
    const removedPlanIds = [...existingPlanIds].filter(id => !nextPlanIds.has(id));
    await savePlan(removedPlanIds);
    renderCalendar();
    renderDayPlan();
    renderTodoBoard();
    if (document.getElementById('dayTimeboxModal')?.classList.contains('open')) {
      renderDayTimeboxModal();
    }
  }

  if (Array.isArray(result.updatedGoals)) {
    const existingGoalIds = new Set(state.goals.map(goal => String(goal?.id || '')).filter(Boolean));
    state.goals = result.updatedGoals;
    const nextGoalIds = new Set(state.goals.map(goal => String(goal?.id || '')).filter(Boolean));
    const removedGoalIds = [...existingGoalIds].filter(id => !nextGoalIds.has(id));
    await saveGoals(removedGoalIds);
    renderGoalsBoard();
  }

  if (Array.isArray(result.updatedTodos)) {
    const existingTodoIds = new Set(state.todos.map(todo => String(todo?.id || '')).filter(Boolean));
    state.todos = result.updatedTodos;
    const nextTodoIds = new Set(state.todos.map(todo => String(todo?.id || '')).filter(Boolean));
    const removedTodoIds = [...existingTodoIds].filter(id => !nextTodoIds.has(id));
    await saveTodos(removedTodoIds);
    renderTodoBoard();
  }

  const extra = [];
  if (result.conflicts?.length) {
    extra.push(`<p class="small-note" style="color:#ffb347;"><strong>Überschneidungen:</strong> ${escapeHtml(result.conflicts.join(' | '))}</p>`);
  }
  if (result.questions?.length) {
    extra.push(`<p class="small-note"><strong>Rückfragen:</strong> ${escapeHtml(result.questions.join(' | '))}</p>`);
  }

  const answerHtml = `${escapeHtml(result.reply)}${extra.join('')}`;
  state.chat.push({ role: 'assistant', content: answerHtml });
  saveChatHistory();
  appendChatMessage('Plan-KI', answerHtml, 'assistant');
}

function initializeEvents() {
  document.getElementById('openPlanView')?.addEventListener('click', () => setMode('view'));
  document.getElementById('openPlanEdit')?.addEventListener('click', () => setMode('edit'));
  document.getElementById('openTodoView')?.addEventListener('click', () => setMode('todo'));
  document.getElementById('openGoalsView')?.addEventListener('click', () => setMode('goals'));

  document.getElementById('prevMonth')?.addEventListener('click', () => {
    state.viewDate = new Date(state.viewDate.getFullYear(), state.viewDate.getMonth() - 1, 1);
    renderCalendar();
  });

  document.getElementById('nextMonth')?.addEventListener('click', () => {
    state.viewDate = new Date(state.viewDate.getFullYear(), state.viewDate.getMonth() + 1, 1);
    renderCalendar();
  });

  document.getElementById('calendarGrid')?.addEventListener('click', event => {
    const button = event.target.closest('[data-date]');
    if (!button) return;
    state.selectedDate = button.dataset.date;
    renderCalendar();
    renderDayPlan();
    openDayTimeboxModal();
  });

  document.getElementById('closeDayTimebox')?.addEventListener('click', closeDayTimeboxModal);
  document.getElementById('dayTimeboxModal')?.addEventListener('click', event => {
    if (event.target?.id === 'dayTimeboxModal') closeDayTimeboxModal();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeDayTimeboxModal();
  });

  document.getElementById('planChatForm')?.addEventListener('submit', handlePlanChatSubmit);
  document.getElementById('todoForm')?.addEventListener('submit', handleTodoSubmit);
  document.getElementById('todoSection')?.addEventListener('click', handleTodoActionClick);
  document.getElementById('goalForm')?.addEventListener('submit', handleGoalSubmit);
  document.getElementById('goalsSection')?.addEventListener('click', handleGoalActionClick);
}

function setupPlanRealtime() {
  if (!sbClient) return;

  sbClient
    .channel('chris-plan-sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLE_CHRIS_PLAN }, async () => {
      if (Date.now() < suppressPlanRealtimeUntil) return;
      await loadPlanFromSource();
      renderCalendar();
      renderDayPlan();
      renderTodoBoard();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLE_CHRIS_GOALS }, async () => {
      await loadGoalsFromSource();
      renderGoalsBoard();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLE_CHRIS_TODOS }, async () => {
      await loadTodosFromSource();
      renderTodoBoard();
    })
    .subscribe();
}

async function init() {
  await loadPlanFromSource();
  await loadGoalsFromSource();
  await loadTodosFromSource();
  renderCalendar();
  renderDayPlan();
  renderTodoBoard();
  renderGoalsBoard();
  renderChatHistory();
  initializeEvents();
  setupPlanRealtime();
}

init();
