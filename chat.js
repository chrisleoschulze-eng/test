const SUPABASE_URL = 'https://gpsnklnubbqkntseqeqb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwc25rbG51YmJxa250c2VxZXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MDQyNjgsImV4cCI6MjA5NzM4MDI2OH0.VICqdMCm4mknyBIoTdYbH-tQ7g408gpKl_zlVHPp7z4';
const STORAGE_CHAT_USERS = 'ks_chat_users';
const STORAGE_CHAT_MESSAGES = 'ks_chat_messages';
const STORAGE_CHAT_SESSION = 'ks_chat_session';

const sbClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const state = {
  users: [],
  messages: [],
  sessionUser: null,
  sessionIsAdmin: false,
  sessionColor: '#7dd0ff'
};

const elements = {
  authArea: document.getElementById('authArea'),
  chatArea: document.getElementById('chatArea'),
  chatHeadline: document.getElementById('chatHeadline'),
  chatMessageList: document.getElementById('chatMessageList'),
  registerForm: document.getElementById('registerForm'),
  loginForm: document.getElementById('loginForm'),
  chatForm: document.getElementById('chatForm'),
  chatMessage: document.getElementById('chatMessage'),
  chatFileInput: document.getElementById('chatFileInput'),
  logoutChatButton: document.getElementById('logoutChatButton')
};

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

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('de-DE');
}

function dataUrlToBlob(dataUrl) {
  const parts = String(dataUrl || '').split(',');
  if (parts.length < 2) throw new Error('Ungueltige Datei.');

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

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Datei konnte nicht gelesen werden.'));
    reader.readAsDataURL(file);
  });
}

function saveLocalUsers() {
  localStorage.setItem(STORAGE_CHAT_USERS, JSON.stringify(state.users));
}

function saveLocalMessages() {
  localStorage.setItem(STORAGE_CHAT_MESSAGES, JSON.stringify(state.messages));
}

function setSessionUser(username, isAdmin = false, color = '#7dd0ff') {
  state.sessionUser = username;
  state.sessionIsAdmin = Boolean(isAdmin);
  state.sessionColor = color || '#7dd0ff';
  if (username) {
    localStorage.setItem(STORAGE_CHAT_SESSION, username);
  } else {
    localStorage.removeItem(STORAGE_CHAT_SESSION);
  }
}

async function ensureAdminUser() {
  const adminUser = state.users.find(user => String(user.username).toLowerCase() === 'admin');
  if (!adminUser) {
    const payload = { username: 'Admin', password: 'Chemtrail42', color: '#ff8c00', approved: true, is_admin: true };
    if (sbClient) {
      await sbClient.from('chat_users').upsert(payload, { onConflict: 'username' });
    } else {
      state.users.push(payload);
      saveLocalUsers();
    }
  } else if (!adminUser.color) {
    adminUser.color = '#ff8c00';
    if (sbClient) {
      await sbClient.from('chat_users').update({ color: '#ff8c00' }).eq('username', 'Admin');
    } else {
      saveLocalUsers();
    }
  }
}

async function loadUsers() {
  if (!sbClient) {
    const users = localStorage.getItem(STORAGE_CHAT_USERS);
    state.users = users ? JSON.parse(users) : [];
    await ensureAdminUser();
    return;
  }

  const { data, error } = await sbClient.from('chat_users').select('*').order('created_at', { ascending: true });
  if (error) throw error;
  state.users = data || [];
  await ensureAdminUser();

  const { data: refreshed } = await sbClient.from('chat_users').select('*').order('created_at', { ascending: true });
  state.users = refreshed || [];
  saveLocalUsers();
}

async function loadMessages() {
  if (!sbClient) {
    const messages = localStorage.getItem(STORAGE_CHAT_MESSAGES);
    state.messages = messages ? JSON.parse(messages) : [];
    return;
  }

  const { data, error } = await sbClient.from('chat_messages').select('*').order('created_at', { ascending: true }).limit(300);
  if (error) throw error;
  state.messages = data || [];
  saveLocalMessages();
}

function renderAuthState() {
  const isLoggedIn = Boolean(state.sessionUser);
  if (!elements.authArea || !elements.chatArea) return;

  elements.authArea.style.display = isLoggedIn ? 'none' : 'grid';
  elements.chatArea.style.display = isLoggedIn ? 'block' : 'none';

  if (isLoggedIn && elements.chatHeadline) {
    elements.chatHeadline.textContent = state.sessionIsAdmin
      ? `Chat - Angemeldet als ${state.sessionUser} (Admin)`
      : `Chat - Angemeldet als ${state.sessionUser}`;
  }
}

function renderMessages() {
  if (!elements.chatMessageList) return;

  if (state.messages.length === 0) {
    elements.chatMessageList.innerHTML = '<p class="small-note">Noch keine Nachrichten vorhanden.</p>';
    return;
  }

  elements.chatMessageList.innerHTML = state.messages.map(msg => {
    const safeName = escapeHtml(msg.username);
    const safeText = escapeHtml(msg.message || '');
    const safeFileName = escapeHtml(msg.file_name || '');
    const msgId = String(msg.id);
    const senderUser = state.users.find(u => String(u.username).toLowerCase() === String(msg.username).toLowerCase());
    const nameColor = (senderUser && senderUser.color) ? senderUser.color : '#7dd0ff';

    let fileHtml = '';
    if (msg.file_data) {
      if (String(msg.file_data).startsWith('data:image/')) {
        fileHtml = `<div class="solution-box"><img src="${msg.file_data}" alt="${safeFileName}" style="max-width:100%; border-radius:12px;" /></div>`;
      } else {
        fileHtml = `<div class="actions"><button class="secondary" data-open-file="${msg.id}">Datei oeffnen (${safeFileName || 'Anhang'})</button></div>`;
      }
    }

    const deleteBox = state.sessionIsAdmin
      ? `<div class="solution-box" data-delete-box="${msgId}" style="display:none; margin-top: 12px;"><p class="small-note">Diese Nachricht l\u00f6schen?</p><div class="actions"><button class="danger" data-delete-message="${msgId}">Jetzt l\u00f6schen</button></div></div>`
      : '';

    return `
      <article class="task-card ${state.sessionIsAdmin ? 'admin-deletable' : ''}" data-msg-id="${msgId}">
        <header>
          <div>
            <h3 style="color: ${nameColor};">${safeName}</h3>
            <p class="small-note">${formatDate(msg.created_at)}</p>
          </div>
        </header>
        ${safeText ? `<p>${safeText}</p>` : ''}
        ${fileHtml}
        ${deleteBox}
      </article>
    `;
  }).join('');
}

async function registerUser(event) {
  event.preventDefault();
  const username = document.getElementById('registerUsername')?.value.trim() || '';
  const password = document.getElementById('registerPassword')?.value.trim() || '';

  if (!username || !password) {
    alert('Bitte Benutzername und Passwort eingeben.');
    return;
  }

  if (isAdminLikeUsername(username)) {
    alert('Benutzername zu aehnlich zu Admin ist nicht erlaubt.');
    return;
  }

  const duplicate = state.users.find(user => String(user.username).toLowerCase() === username.toLowerCase());
  if (duplicate) {
    alert('Benutzername ist bereits vergeben.');
    return;
  }

  const color = document.getElementById('registerColor')?.value || '#7dd0ff';

  const newUser = {
    username,
    password,
    color,
    approved: false,
    is_admin: false
  };

  if (sbClient) {
    const { error } = await sbClient.from('chat_users').insert([newUser]);
    if (error) {
      alert('Registrierung fehlgeschlagen.');
      return;
    }
    await loadUsers();
  } else {
    state.users.push({ id: `local-user-${Date.now()}`, ...newUser });
    saveLocalUsers();
  }

  event.target.reset();
  alert('Registrierung gesendet. Ein Admin muss deinen Account freigeben.');
}

async function loginUser(event) {
  event.preventDefault();
  const username = document.getElementById('loginUsername')?.value.trim() || '';
  const password = document.getElementById('loginPassword')?.value.trim() || '';

  if (!username || !password) {
    alert('Bitte Benutzername und Passwort eingeben.');
    return;
  }

  await loadUsers();

  const user = state.users.find(item => String(item.username).toLowerCase() === username.toLowerCase());
  if (!user || user.password !== password) {
    alert('Login fehlgeschlagen.');
    return;
  }

  if (!user.approved) {
    alert('Dein Konto ist noch nicht durch den Admin freigegeben.');
    return;
  }

  setSessionUser(user.username, Boolean(user.is_admin), user.color || '#7dd0ff');
  renderAuthState();
  await loadMessages();
  renderMessages();
}

async function sendMessage(event) {
  event.preventDefault();
  if (!state.sessionUser) return;

  const text = elements.chatMessage?.value.trim() || '';
  const file = elements.chatFileInput?.files?.[0];

  if (!text && !file) {
    alert('Bitte Nachricht oder Datei senden.');
    return;
  }

  let fileData = '';
  let fileName = '';
  if (file) {
    fileData = await readFileAsDataUrl(file);
    fileName = file.name;
  }

  const payload = {
    username: state.sessionUser,
    message: text,
    file_name: fileName,
    file_data: fileData,
    created_at: new Date().toISOString()
  };

  if (sbClient) {
    const { error } = await sbClient.from('chat_messages').insert([payload]);
    if (error) {
      alert('Nachricht konnte nicht gesendet werden.');
      return;
    }
    await loadMessages();
  } else {
    state.messages.push({ id: `local-msg-${Date.now()}`, ...payload });
    saveLocalMessages();
  }

  if (elements.chatMessage) elements.chatMessage.value = '';
  if (elements.chatFileInput) elements.chatFileInput.value = '';
  renderMessages();
}

async function deleteChatMessage(messageId) {
  const message = state.messages.find(msg => String(msg.id) === String(messageId));
  if (!message) return;

  const confirmed = window.confirm('Diese Chat-Nachricht wirklich löschen?');
  if (!confirmed) return;

  if (sbClient) {
    const { error } = await sbClient.from('chat_messages').delete().eq('id', message.id);
    if (error) {
      alert('Nachricht konnte nicht gelöscht werden.');
      return;
    }
    await loadMessages();
  } else {
    state.messages = state.messages.filter(msg => String(msg.id) !== String(messageId));
    saveLocalMessages();
  }

  renderMessages();
}

function handleMessageListClick(event) {
  const deleteButton = event.target.closest('button[data-delete-message]');
  if (deleteButton && state.sessionIsAdmin) {
    deleteChatMessage(deleteButton.dataset.deleteMessage);
    return;
  }

  const openButton = event.target.closest('button[data-open-file]');
  if (openButton) {
    const messageId = openButton.dataset.openFile;
    const message = state.messages.find(msg => String(msg.id) === String(messageId));
    if (!message || !message.file_data) return;

    try {
      const blob = dataUrlToBlob(message.file_data);
      const blobUrl = URL.createObjectURL(blob);
      const opened = window.open(blobUrl, '_blank');
      if (!opened) {
        URL.revokeObjectURL(blobUrl);
        alert('Datei konnte nicht geoeffnet werden.');
        return;
      }
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    } catch (error) {
      alert('Datei ist beschaedigt.');
    }
    return;
  }

  if (!state.sessionIsAdmin) return;

  const messageCard = event.target.closest('article[data-msg-id]');
  if (!messageCard) return;
  if (event.target.closest('[data-delete-box]')) return;

  const msgId = messageCard.dataset.msgId;
  const deleteBox = messageCard.querySelector(`[data-delete-box="${msgId}"]`);
  if (!deleteBox) return;

  deleteBox.style.display = deleteBox.style.display === 'none' ? 'block' : 'none';
}

function logoutChat() {
  setSessionUser(null, false);
  renderAuthState();
}

function setupRealtime() {
  if (!sbClient || !sbClient.channel) return;

  sbClient
    .channel('public:chat_sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages' }, async () => {
      await loadMessages();
      renderMessages();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_users' }, async () => {
      await loadUsers();
      if (state.sessionUser) {
        const current = state.users.find(user => String(user.username).toLowerCase() === String(state.sessionUser).toLowerCase());
        if (!current || !current.approved) {
          logoutChat();
          alert('Dein Account wurde geaendert oder gesperrt.');
        } else {
          state.sessionIsAdmin = Boolean(current.is_admin);
          state.sessionColor = current.color || '#7dd0ff';
          renderAuthState();
          renderMessages();
        }
      }
    })
    .subscribe();
}

async function initChat() {
  try {
    await loadUsers();
    await loadMessages();
  } catch (error) {
    console.warn('Chat arbeitet im lokalen Fallback:', error);
    const users = localStorage.getItem(STORAGE_CHAT_USERS);
    const messages = localStorage.getItem(STORAGE_CHAT_MESSAGES);
    state.users = users ? JSON.parse(users) : [];
    state.messages = messages ? JSON.parse(messages) : [];
  }

  const session = localStorage.getItem(STORAGE_CHAT_SESSION);
  if (session) {
    const existing = state.users.find(user => String(user.username).toLowerCase() === session.toLowerCase() && user.approved);
    if (existing) {
      setSessionUser(existing.username, Boolean(existing.is_admin), existing.color || '#7dd0ff');
    } else {
      setSessionUser(null, false);
    }
  }

  renderAuthState();
  renderMessages();
  setupRealtime();
}

if (elements.registerForm) elements.registerForm.addEventListener('submit', registerUser);
if (elements.loginForm) elements.loginForm.addEventListener('submit', loginUser);
if (elements.chatForm) elements.chatForm.addEventListener('submit', sendMessage);
if (elements.logoutChatButton) elements.logoutChatButton.addEventListener('click', logoutChat);
if (elements.chatMessageList) elements.chatMessageList.addEventListener('click', handleMessageListClick);

initChat();
