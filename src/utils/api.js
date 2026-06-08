/**
 * Ledgerly API client — connects to the FastAPI backend.
 * All functions return { data, error }.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const TOKEN_KEY = 'ledgerly_token';

// ─── Token helpers ────────────────────────────────────────────────────────────

export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

export function setToken(token) {
  try { localStorage.setItem(TOKEN_KEY, token); } catch {}
}

export function clearToken() {
  try { localStorage.removeItem(TOKEN_KEY); } catch {}
}

// ─── Core request ─────────────────────────────────────────────────────────────

async function request(method, path, body) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    const data = await res.json();
    if (!res.ok) return { data: null, error: data?.detail ?? 'Request failed.' };
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

// ─── Data transformers ────────────────────────────────────────────────────────
// Backend uses snake_case; frontend uses camelCase.

export function transformTask(t) {
  return {
    id: t.id,
    name: t.name,
    description: t.description ?? '',
    dueDate: t.due_date,
    status: t.status,
    // Steps are stored as [{label, done}] in DB; frontend needs ["label", ...]
    steps: Array.isArray(t.steps)
      ? t.steps.map(s => (typeof s === 'string' ? s : s.label))
      : [],
    isCustom: t.is_custom ?? false,
    priority: t.priority ?? 'medium',
    completedAt: t.completed_at
      ? new Date(t.completed_at).toLocaleDateString('en-AU', {
          day: 'numeric', month: 'long', year: 'numeric',
        })
      : null,
  };
}

export function transformNotification(n) {
  return {
    id: n.id,
    type: n.type,
    title: n.title,
    body: n.body,
    timestamp: new Date(n.created_at).getTime(),
    read: n.is_read,
  };
}

export function transformProfile(p) {
  return {
    fullName: p.full_name,
    businessName: p.business_name,
    email: p.email,
    state: p.state,
    type: p.business_type,
  };
}

// ─── Health ───────────────────────────────────────────────────────────────────

export const healthCheck = () => request('GET', '/health');

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const login = (email, password) =>
  request('POST', '/api/auth/login', { email, password });

export const register = (email, password) =>
  request('POST', '/api/auth/register', { email, password });

export const logout = () => request('POST', '/api/auth/logout');

/** Validate a stored token — returns user info or error. */
export const getMe = () => request('GET', '/api/auth/me');

// ─── Profile ──────────────────────────────────────────────────────────────────

/**
 * Called at the end of onboarding. Sends profile + seed task list in one request.
 * Returns { profile, tasks, notifications }.
 */
export const saveProfile = (profileData, taskList) =>
  request('POST', '/api/profile', {
    full_name: profileData.fullName,
    business_name: profileData.businessName,
    email: profileData.email,
    state: profileData.state,
    business_type: profileData.type,
    tasks: taskList,
  });

/**
 * Restore session — fetches profile + tasks + notifications for a returning user.
 */
export const getProfile = () => request('GET', '/api/profile/me');

// ─── Tasks ────────────────────────────────────────────────────────────────────

export const fetchTasks = () => request('GET', '/api/tasks');

export const createTask = (task) =>
  request('POST', '/api/tasks', {
    name: task.name,
    due_date: task.dueDate,
    priority: task.priority ?? 'medium',
    notes: task.notes ?? '',
    steps: task.steps ?? [],
  });

export const markTaskDone = (taskId) =>
  request('PUT', `/api/tasks/${taskId}/done`);

export const deleteTask = (taskId) =>
  request('DELETE', `/api/tasks/${taskId}`);

// ─── Notifications ────────────────────────────────────────────────────────────

export const fetchNotifications = () => request('GET', '/api/notifications');

export const markNotificationRead = (notifId) =>
  request('PUT', `/api/notifications/${notifId}/read`);

export const markAllNotificationsRead = () =>
  request('PUT', '/api/notifications/read-all');
