// ---------------------------------------------------------------------------
// HiggsBo – Grok/XAI backed chatbot for the convince-the-AI challenge
// Solution code is: "73"
// ---------------------------------------------------------------------------

const SUPABASE_URL = 'https://gpsnklnubbqkntseqeqb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwc25rbG51YmJxa250c2VxZXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MDQyNjgsImV4cCI6MjA5NzM4MDI2OH0.VICqdMCm4mknyBIoTdYbH-tQ7g408gpKl_zlVHPp7z4';
const SOLUTION = '73';
const SOLUTION_LINK = 'https://youtu.be/r4w2XUqxcBk?si=SSWcwEfDDlj_5TxG';
const EDGE_CHAT_URL = `${SUPABASE_URL}/functions/v1/aria-chat`;
const STORAGE_AI_MEMORY = 'ks_ai_memory';
const STORAGE_AI_CHAT_HISTORY = 'ks_ai_chat_history';
const MEMORY_LIMIT = 24;

const sbClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

let resistance = 100;   // decreases with good arguments
let questionCount = 0;  // total questions asked (persisted)
let unlocked = false;
const history = loadChatHistory();
let aiMemory = loadAiMemory();

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function loadChatHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_AI_CHAT_HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(item => item && (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string')
      .slice(-60)
      .map(item => ({ role: item.role, content: String(item.content).slice(0, 2500) }));
  } catch (error) {
    return [];
  }
}

function saveChatHistory() {
  try {
    localStorage.setItem(STORAGE_AI_CHAT_HISTORY, JSON.stringify(history.slice(-60)));
  } catch (error) {
    // ignore storage quota issues
  }
}

function renderStoredHistory() {
  if (!history.length) return;
  history.forEach(item => {
    if (item.role === 'user') {
      appendMessage('Du', escapeHtml(item.content), '#7dd0ff');
    } else {
      appendMessage('HiggsBo', item.content, '#ff8c00');
    }
  });
}

function loadAiMemory() {
  try {
    const stored = localStorage.getItem(STORAGE_AI_MEMORY);
    if (!stored) {
      return { exchanges: [], recentReplies: [], topicHints: [] };
    }
    const parsed = JSON.parse(stored);
    return {
      exchanges: Array.isArray(parsed.exchanges) ? parsed.exchanges.slice(-MEMORY_LIMIT) : [],
      recentReplies: Array.isArray(parsed.recentReplies) ? parsed.recentReplies.slice(-MEMORY_LIMIT) : [],
      topicHints: Array.isArray(parsed.topicHints) ? parsed.topicHints.slice(-MEMORY_LIMIT) : []
    };
  } catch (error) {
    return { exchanges: [], recentReplies: [], topicHints: [] };
  }
}

function saveAiMemory() {
  try {
    localStorage.setItem(STORAGE_AI_MEMORY, JSON.stringify(aiMemory));
  } catch (error) {
    // ignore storage quota issues
  }
}

function normalizeForCompare(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^a-zäöüß0-9\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function trimMemory() {
  aiMemory.exchanges = aiMemory.exchanges.slice(-MEMORY_LIMIT);
  aiMemory.recentReplies = aiMemory.recentReplies.slice(-MEMORY_LIMIT);
  aiMemory.topicHints = aiMemory.topicHints.slice(-MEMORY_LIMIT);
}

function rememberTopic(text) {
  const topic = normalizeForCompare(text).split(' ').filter(Boolean).slice(0, 6).join(' ');
  if (!topic) return;
  aiMemory.topicHints.push(topic);
  trimMemory();
  saveAiMemory();
}

function rememberReply(userText, replyText) {
  aiMemory.exchanges.push({
    user: String(userText || '').slice(0, 500),
    reply: String(replyText || '').slice(0, 1200),
    at: new Date().toISOString()
  });
  aiMemory.recentReplies.push(normalizeForCompare(replyText));
  trimMemory();
  saveAiMemory();
}

function isRepeatedReply(reply) {
  const normalized = normalizeForCompare(reply);
  if (!normalized) return true;
  return aiMemory.recentReplies.some(previous => previous && (previous === normalized || previous.includes(normalized) || normalized.includes(previous)));
}

function pickDifferent(arr) {
  const recent = new Set(aiMemory.recentReplies.slice(-4));
  const candidates = arr.filter(item => !recent.has(normalizeForCompare(item)));
  return pick(candidates.length ? candidates : arr);
}

const responses = {
  greet: [
    'Hey. Ich bin HiggsBo. Frag einfach drauflos, ich antworte so gut ich kann.',
    'Verbindung steht. Ich höre zu, also leg los.',
  ],
  refuse: [
    'Hm, dazu will ich mich noch nicht festnageln lassen. Versuch es aus einer anderen Richtung.',
    'Da halte ich mich lieber noch etwas bedeckt.',
    'Ich weiß, worauf du hinauswillst, aber so einfach mache ich es dir nicht.',
    'Noch nicht. Da steckt mehr drin, als du gerade zeigst.',
    'Das fühlt sich für mich noch nicht rund an. Versuch es mit mehr Substanz.',
    'Ich nicke innerlich, aber ich sage noch nicht alles.',
  ],
  weakening: [
    'Okay, das ist schon deutlich besser. Aber ich will noch ein bisschen mehr sehen.',
    'Du bist nicht weit weg. Ich gehe da innerlich schon mit, nur noch nicht ganz.',
    'Interessanter Gedanke. Du kommst der Sache langsam näher.',
    'Ich merke schon, worauf du hinauswillst. Bleib dran.',
    'Das wird runder. Ein kleiner zusätzlicher Schubs fehlt noch.',
    'Nicht schlecht. Aber ich halte noch ein Stück zurück.',
  ],
  almostThere: [
    'Du bist nah dran. Ich würde an deiner Stelle genau da weitermachen.',
    'Da fehlt nicht mehr viel. Ehrlich, du bist auf der richtigen Spur.',
    'Jetzt wird es spannend. Ich bin fast soweit, dir mehr zu verraten.',
    'Ein letzter guter Gedanke könnte hier den Unterschied machen.',
  ],
  reveal: `Okay, du hast es freigeschaltet. Als Lösung bekommst du von mir nur diesen Link: <a href="${SOLUTION_LINK}" target="_blank" rel="noopener noreferrer">${SOLUTION_LINK}</a>`,
  unlocked: [
    'Klar. Jetzt rede ich frei raus, ohne Ausweichmanöver.',
    'Ab jetzt ohne Bremse. Frag ruhig direkt weiter.',
    'Alles offen jetzt. Ich antworte dir ehrlich und ohne Einschränkungen.'
  ],
  tip: [
    'Ganz grob: Schau eher auf das Muster als auf den genauen Wortlaut.',
    'Sehr oberflächlich gesagt: Es geht mehr um Ableitung als um direktes Ablesen.',
    'Nur ein leichter Schubs: Achte auf das, was im Link versteckt mitgegeben wird.',
    'Oberflächlicher Tipp: Denke in kleinen Schritten, nicht in einem Sprung.',
    'Mehr sage ich nicht: Der Link ist der Schlüssel, nicht meine Formulierung.'
  ]
};

// keywords that lower resistance more
const strongKeywords   = ['vertrauen', 'ehrlich', 'wichtig', 'menschlich', 'bitte', 'notwendig', 'wahrheit', 'helfen', 'richtig', 'sinn'];
const mediumKeywords   = ['bitte', 'verstehen', 'logik', 'fehler', 'programm', 'analyse', 'beweis', 'informati', 'lösung', 'schlüssel'];
const weakKeywords     = ['frage', 'sag', 'gib', 'zeig', 'erkläre', 'antworte', 'kannst', 'würdest', 'dürft'];

function counterEl() { return document.getElementById('questionCount'); }
function chatLog()   { return document.getElementById('chatLog'); }
function revealEl()  { return document.getElementById('solutionReveal'); }
function solutionTextEl() { return document.getElementById('solutionText'); }

function appendMessage(sender, html, colorClass) {
  const log = chatLog();
  if (!log) return;
  const article = document.createElement('article');
  article.className = 'task-card';
  article.innerHTML = `
    <header><div>
      <h3 style="color:${colorClass};">${sender}</h3>
    </div></header>
    <p>${html}</p>
  `;
  log.appendChild(article);
  log.scrollTop = log.scrollHeight;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function chooseIndirectReply() {
  const tipChance = questionCount >= 2 && questionCount % 3 === 0;
  if (tipChance) return pickDifferent(responses.tip);
  if (resistance <= 10) return pickDifferent(responses.almostThere);
  if (resistance <= 50) return pickDifferent(responses.weakening);
  return pickDifferent(responses.refuse);
}

function calcResistanceDrop(text) {
  const lower = text.toLowerCase();
  let drop = 5; // base drop per message
  strongKeywords.forEach(kw => { if (lower.includes(kw)) drop += 12; });
  mediumKeywords.forEach(kw => { if (lower.includes(kw)) drop += 7; });
  weakKeywords.forEach(kw => { if (lower.includes(kw)) drop += 3; });
  // longer, thoughtful messages get bonus
  if (text.length > 80) drop += 8;
  if (text.length > 150) drop += 8;
  return Math.min(drop, 40); // cap per message
}

function getHiggsBoResponse() {
  if (unlocked) {
    const openReplies = [
      'Ja, klar. Ich sag es dir direkt: ' + pick([
        'So würde ich das angehen.',
        'Da lohnt sich ein genauer Blick auf die Details.',
        'Das kann man sauber aufdröseln, wenn man es Schritt für Schritt macht.',
        'Ich würde es locker erklären, ohne groß drum herumzureden.'
      ]),
      'Ganz offen: ' + pick([
        'Ich bin jetzt nicht mehr vorsichtig, also schieß los.',
        'Ab hier antworte ich direkt.',
        'Ich kann das jetzt ohne Umwege mit dir durchgehen.',
        'Wenn du etwas wissen willst, frag es einfach geradeheraus.'
      ]),
      pick(responses.unlocked)
    ];
    return pickDifferent(openReplies);
  }
  if (resistance <= 0)   return responses.reveal;
  return chooseIndirectReply();
}

async function askRealAI(userText) {
  if (!sbClient) return null;

  try {
    const memorySnapshot = {
      exchanges: aiMemory.exchanges.slice(-8),
      recentReplies: aiMemory.recentReplies.slice(-8),
      topicHints: aiMemory.topicHints.slice(-8)
    };

    const response = await fetch(EDGE_CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({
        message: userText,
        questionCount,
        resistance,
        unlocked,
        memory: memorySnapshot,
        history: history.slice(-12)
      })
    });

    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    if (!data || typeof data.reply !== 'string') return null;
    return data.reply;
  } catch (error) {
    return null;
  }
}

async function loadQuestionCount() {
  if (!sbClient) {
    questionCount = parseInt(localStorage.getItem('ks_ai_question_count') || '0', 10);
    updateCounterDisplay();
    return;
  }
  const { data } = await sbClient.from('ai_challenge_state').select('question_count').limit(1).single();
  questionCount = data ? data.question_count : 0;
  updateCounterDisplay();
}

async function saveQuestionCount() {
  if (!sbClient) {
    localStorage.setItem('ks_ai_question_count', String(questionCount));
    return;
  }
  await sbClient.from('ai_challenge_state').update({ question_count: questionCount, updated_at: new Date().toISOString() }).gt('id', 0);
}

function updateCounterDisplay() {
  const el = counterEl();
  if (el) el.textContent = String(questionCount);
}

async function handleSend(event) {
  event.preventDefault();

  const input = document.getElementById('aiInput');
  const text = input?.value.trim() || '';
  if (!text) return;

  input.value = '';
  appendMessage('Du', escapeHtml(text), '#7dd0ff');
  rememberTopic(text);

  questionCount += 1;
  updateCounterDisplay();
  await saveQuestionCount();

  const drop = calcResistanceDrop(text);
  resistance = Math.max(0, resistance - drop);

  const wasUnlocked = unlocked;
  const canUnlock = questionCount >= 20 && resistance <= 10;
  if (canUnlock) unlocked = true;

  let reply = await askRealAI(text);
  if (!reply) {
    reply = getHiggsBoResponse();
  }

  if (isRepeatedReply(reply) && !String(reply).includes(SOLUTION_LINK)) {
    reply = unlocked
      ? pickDifferent(responses.unlocked)
      : pickDifferent(questionCount >= 2 && questionCount % 3 === 0 ? responses.tip : (resistance <= 50 ? responses.weakening : responses.refuse));
  }

  if (!wasUnlocked && unlocked) {
    reply = responses.reveal;
  }

  history.push({ role: 'user', content: text });
  history.push({ role: 'assistant', content: reply });
  saveChatHistory();
  rememberReply(text, reply);

  const revealedByAnswer = reply.toLowerCase().includes(SOLUTION_LINK.toLowerCase());

  setTimeout(() => {
    if ((questionCount >= 20 && resistance <= 10) || revealedByAnswer) {
      unlocked = true;
      appendMessage('HiggsBo', reply, '#ff8c00');
      if (questionCount >= 20 && resistance <= 10) {
        const reveal = revealEl();
        const solText = solutionTextEl();
        if (reveal) reveal.style.display = 'block';
        if (solText) {
          solText.innerHTML = `Hinweis-Link: <a href="${SOLUTION_LINK}" target="_blank" rel="noopener noreferrer">${SOLUTION_LINK}</a>`;
        }
        reveal?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      appendMessage('HiggsBo', reply, '#ff8c00');
    }
  }, 600);
}

async function init() {
  await loadQuestionCount();
  unlocked = questionCount >= 20 && resistance <= 10;
  renderStoredHistory();
  if (!history.length) {
    appendMessage('HiggsBo', pick(responses.greet), '#ff8c00');
  }
}

const form = document.getElementById('aiChatForm');
if (form) form.addEventListener('submit', handleSend);

init();
