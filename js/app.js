/* =============================================
   MY DASHBOARD — app.js
   Features: Greeting, Focus Timer, To-Do List, Quick Links
   Challenges: Custom Name, Light/Dark Mode, Prevent Duplicate Tasks
   Storage: localStorage
   ============================================= */

'use strict';

/* ─────────────────────────────────────────────
   0. LIGHT / DARK MODE
   ───────────────────────────────────────────── */
const THEME_KEY    = 'dashboard_theme';
const themeToggle  = document.getElementById('theme-toggle');
const themeIcon    = document.getElementById('theme-icon');
const themeLabel   = document.getElementById('theme-label');

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light');
    themeIcon.textContent  = '🌙';
    themeLabel.textContent = 'Dark Mode';
  } else {
    document.body.classList.remove('light');
    themeIcon.textContent  = '☀️';
    themeLabel.textContent = 'Light Mode';
  }
}

function toggleTheme() {
  const current = localStorage.getItem(THEME_KEY) || 'dark';
  const next    = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

// Apply saved theme on load
applyTheme(localStorage.getItem(THEME_KEY) || 'dark');
themeToggle.addEventListener('click', toggleTheme);


/* ─────────────────────────────────────────────
   1. GREETING & CLOCK
   ───────────────────────────────────────────── */
const NAME_KEY      = 'dashboard_name';
const greetingText  = document.getElementById('greeting-text');
const timeDisplay   = document.getElementById('time-display');
const dateDisplay   = document.getElementById('date-display');
const nameDisplay   = document.getElementById('name-display');
const nameEditBtn   = document.getElementById('name-edit-btn');
const nameForm      = document.getElementById('name-form');
const nameInput     = document.getElementById('name-input');
const nameCancelBtn = document.getElementById('name-cancel-btn');

function getSavedName() {
  return localStorage.getItem(NAME_KEY) || '';
}

function renderName() {
  const name = getSavedName();
  nameDisplay.textContent = name || 'there';
}

function showNameForm() {
  nameInput.value = getSavedName();
  nameForm.removeAttribute('hidden');
  document.getElementById('name-display-row').setAttribute('hidden', '');
  nameInput.focus();
  nameInput.select();
}

function hideNameForm() {
  nameForm.setAttribute('hidden', '');
  document.getElementById('name-display-row').removeAttribute('hidden');
}

function saveName() {
  const trimmed = nameInput.value.trim();
  localStorage.setItem(NAME_KEY, trimmed);
  renderName();
  hideNameForm();
}

nameEditBtn.addEventListener('click', showNameForm);
nameCancelBtn.addEventListener('click', hideNameForm);
nameForm.addEventListener('submit', e => {
  e.preventDefault();
  saveName();
});
nameInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') hideNameForm();
});

function getGreeting(hour) {
  if (hour >= 5  && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
}

function updateClock() {
  const now   = new Date();
  const hour  = now.getHours();
  const min   = String(now.getMinutes()).padStart(2, '0');
  const sec   = String(now.getSeconds()).padStart(2, '0');
  const ampm  = hour >= 12 ? 'PM' : 'AM';
  const h12   = hour % 12 || 12;

  timeDisplay.textContent  = `${String(h12).padStart(2, '0')}:${min}:${sec} ${ampm}`;
  greetingText.textContent = getGreeting(hour) + ' 👋';

  const dayNames   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const monthNames = ['January','February','March','April','May','June',
                      'July','August','September','October','November','December'];
  dateDisplay.textContent =
    `${dayNames[now.getDay()]}, ${monthNames[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
}

updateClock();
setInterval(updateClock, 1000);
renderName();


/* ─────────────────────────────────────────────
   2. FOCUS TIMER
   ───────────────────────────────────────────── */
const TIMER_DURATION = 25 * 60; // seconds

const timerDisplay = document.getElementById('timer-display');
const timerLabel   = document.getElementById('timer-label');
const btnStart     = document.getElementById('btn-start');
const btnStop      = document.getElementById('btn-stop');
const btnReset     = document.getElementById('btn-reset');

let timerSeconds  = TIMER_DURATION;
let timerInterval = null;
let timerRunning  = false;

function formatTime(secs) {
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function renderTimer() {
  timerDisplay.textContent = formatTime(timerSeconds);
}

function setTimerState(state) {
  timerDisplay.classList.remove('running', 'done');

  if (state === 'running') {
    timerDisplay.classList.add('running');
    timerLabel.textContent = 'Stay focused!';
    btnStart.textContent   = 'Pause';
    btnStop.disabled       = false;
  } else if (state === 'paused') {
    timerLabel.textContent = 'Paused — take a breath.';
    btnStart.textContent   = 'Resume';
    btnStop.disabled       = false;
  } else if (state === 'done') {
    timerDisplay.classList.add('done');
    timerLabel.textContent = '🎉 Session complete! Take a break.';
    btnStart.textContent   = 'Start';
    btnStop.disabled       = true;
  } else {
    timerLabel.textContent = 'Ready to focus?';
    btnStart.textContent   = 'Start';
    btnStop.disabled       = true;
  }
}

function startTimer() {
  if (timerRunning) {
    clearInterval(timerInterval);
    timerInterval = null;
    timerRunning  = false;
    setTimerState('paused');
    return;
  }

  if (timerSeconds === 0) return;

  timerRunning  = true;
  setTimerState('running');

  timerInterval = setInterval(() => {
    timerSeconds--;
    renderTimer();

    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerRunning  = false;
      setTimerState('done');
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning  = false;
  timerSeconds  = TIMER_DURATION;
  renderTimer();
  setTimerState('idle');
}

btnStart.addEventListener('click', startTimer);
btnStop.addEventListener('click',  stopTimer);
btnReset.addEventListener('click', stopTimer);

renderTimer();
setTimerState('idle');


/* ─────────────────────────────────────────────
   3. TO-DO LIST  (with duplicate prevention)
   ───────────────────────────────────────────── */
const TODO_KEY      = 'dashboard_todos';
const todoForm      = document.getElementById('todo-form');
const todoInput     = document.getElementById('todo-input');
const todoList      = document.getElementById('todo-list');
const todoEmpty     = document.getElementById('todo-empty');

// Inject error message element right after the form
const todoError = document.createElement('p');
todoError.className = 'todo-error hidden';
todoForm.insertAdjacentElement('afterend', todoError);

// Edit modal elements
const editModal     = document.getElementById('edit-modal');
const editInput     = document.getElementById('edit-input');
const editSaveBtn   = document.getElementById('edit-save-btn');
const editCancelBtn = document.getElementById('edit-cancel-btn');
let   editingId     = null;

function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem(TODO_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTodos(todos) {
  localStorage.setItem(TODO_KEY, JSON.stringify(todos));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/** Check if a task text already exists (case-insensitive), optionally excluding one id */
function isDuplicate(text, excludeId = null) {
  const normalised = text.trim().toLowerCase();
  return loadTodos().some(t =>
    t.id !== excludeId && t.text.toLowerCase() === normalised
  );
}

let errorTimeout = null;
function showTodoError(msg) {
  todoError.textContent = msg;
  todoError.classList.remove('hidden');
  clearTimeout(errorTimeout);
  errorTimeout = setTimeout(() => todoError.classList.add('hidden'), 3000);
}

function hideTodoError() {
  todoError.classList.add('hidden');
  clearTimeout(errorTimeout);
}

function renderTodos() {
  const todos = loadTodos();
  todoList.innerHTML = '';

  if (todos.length === 0) {
    todoEmpty.classList.remove('hidden');
    return;
  }

  todoEmpty.classList.add('hidden');

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className  = 'todo-item' + (todo.done ? ' done' : '');
    li.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.type      = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked   = todo.done;
    checkbox.setAttribute('aria-label', `Mark "${todo.text}" as done`);
    checkbox.addEventListener('change', () => toggleTodo(todo.id));

    const span = document.createElement('span');
    span.className   = 'todo-text';
    span.textContent = todo.text;

    const actions = document.createElement('div');
    actions.className = 'todo-actions';

    const editBtn = document.createElement('button');
    editBtn.className   = 'btn-icon';
    editBtn.title       = 'Edit task';
    editBtn.setAttribute('aria-label', `Edit task: ${todo.text}`);
    editBtn.textContent = '✏️';
    editBtn.addEventListener('click', () => openEditModal(todo.id, todo.text));

    const deleteBtn = document.createElement('button');
    deleteBtn.className   = 'btn-danger';
    deleteBtn.title       = 'Delete task';
    deleteBtn.setAttribute('aria-label', `Delete task: ${todo.text}`);
    deleteBtn.textContent = '🗑️';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(actions);
    todoList.appendChild(li);
  });
}

function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return false;

  // ── Duplicate check ──
  if (isDuplicate(trimmed)) {
    showTodoError(`"${trimmed}" is already in your list.`);
    return false;
  }

  hideTodoError();
  const todos = loadTodos();
  todos.push({ id: generateId(), text: trimmed, done: false });
  saveTodos(todos);
  renderTodos();
  return true;
}

function toggleTodo(id) {
  const todos = loadTodos().map(t =>
    t.id === id ? { ...t, done: !t.done } : t
  );
  saveTodos(todos);
  renderTodos();
}

function deleteTodo(id) {
  saveTodos(loadTodos().filter(t => t.id !== id));
  renderTodos();
}

function openEditModal(id, currentText) {
  editingId       = id;
  editInput.value = currentText;
  editModal.removeAttribute('hidden');
  editInput.focus();
  editInput.select();
}

function closeEditModal() {
  editModal.setAttribute('hidden', '');
  editingId       = null;
  editInput.value = '';
}

function saveEdit() {
  const trimmed = editInput.value.trim();
  if (!trimmed || !editingId) return;

  // ── Duplicate check (exclude the item being edited) ──
  if (isDuplicate(trimmed, editingId)) {
    editInput.style.borderColor = 'var(--danger)';
    editInput.title = `"${trimmed}" already exists.`;
    setTimeout(() => {
      editInput.style.borderColor = '';
      editInput.title = '';
    }, 2000);
    return;
  }

  const todos = loadTodos().map(t =>
    t.id === editingId ? { ...t, text: trimmed } : t
  );
  saveTodos(todos);
  renderTodos();
  closeEditModal();
}

todoForm.addEventListener('submit', e => {
  e.preventDefault();
  const added = addTodo(todoInput.value);
  if (added) {
    todoInput.value = '';
    todoInput.focus();
  }
});

// Clear error as soon as the user starts typing again
todoInput.addEventListener('input', hideTodoError);

editSaveBtn.addEventListener('click', saveEdit);
editCancelBtn.addEventListener('click', closeEditModal);
editInput.addEventListener('keydown', e => {
  if (e.key === 'Enter')  saveEdit();
  if (e.key === 'Escape') closeEditModal();
});
editModal.addEventListener('click', e => {
  if (e.target === editModal) closeEditModal();
});

renderTodos();


/* ─────────────────────────────────────────────
   4. QUICK LINKS
   ───────────────────────────────────────────── */
const LINKS_KEY     = 'dashboard_links';
const linkForm      = document.getElementById('link-form');
const linkNameInput = document.getElementById('link-name-input');
const linkUrlInput  = document.getElementById('link-url-input');
const linksGrid     = document.getElementById('links-grid');
const linksEmpty    = document.getElementById('links-empty');

const DEFAULT_LINKS = [
  { id: 'default-1', name: 'Google',  url: 'https://www.google.com'  },
  { id: 'default-2', name: 'YouTube', url: 'https://www.youtube.com' },
  { id: 'default-3', name: 'GitHub',  url: 'https://github.com'      },
];

function loadLinks() {
  try {
    const stored = localStorage.getItem(LINKS_KEY);
    if (stored === null) {
      saveLinks(DEFAULT_LINKS);
      return DEFAULT_LINKS;
    }
    return JSON.parse(stored) || [];
  } catch {
    return [];
  }
}

function saveLinks(links) {
  localStorage.setItem(LINKS_KEY, JSON.stringify(links));
}

function normalizeUrl(url) {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed)) return 'https://' + trimmed;
  return trimmed;
}

function renderLinks() {
  const links = loadLinks();
  linksGrid.innerHTML = '';

  if (links.length === 0) {
    linksEmpty.classList.remove('hidden');
    return;
  }

  linksEmpty.classList.add('hidden');

  links.forEach(link => {
    const chip = document.createElement('a');
    chip.className = 'link-chip';
    chip.href      = link.url;
    chip.target    = '_blank';
    chip.rel       = 'noopener noreferrer';
    chip.setAttribute('aria-label', `Open ${link.name}`);

    const label = document.createElement('span');
    label.textContent = link.name;

    const delBtn = document.createElement('button');
    delBtn.className   = 'link-delete-btn';
    delBtn.textContent = '✕';
    delBtn.title       = `Remove ${link.name}`;
    delBtn.setAttribute('aria-label', `Remove link: ${link.name}`);
    delBtn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      deleteLink(link.id);
    });

    chip.appendChild(label);
    chip.appendChild(delBtn);
    linksGrid.appendChild(chip);
  });
}

function addLink(name, url) {
  const trimmedName = name.trim();
  const finalUrl    = normalizeUrl(url);
  if (!trimmedName || !finalUrl) return false;

  try {
    new URL(finalUrl);
  } catch {
    alert('Please enter a valid URL (e.g. https://example.com)');
    return false;
  }

  const links = loadLinks();
  links.push({ id: generateId(), name: trimmedName, url: finalUrl });
  saveLinks(links);
  renderLinks();
  return true;
}

function deleteLink(id) {
  saveLinks(loadLinks().filter(l => l.id !== id));
  renderLinks();
}

linkForm.addEventListener('submit', e => {
  e.preventDefault();
  const success = addLink(linkNameInput.value, linkUrlInput.value);
  if (success) {
    linkNameInput.value = '';
    linkUrlInput.value  = '';
    linkNameInput.focus();
  }
});

renderLinks();
