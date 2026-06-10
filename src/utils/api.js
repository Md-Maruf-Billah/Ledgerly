/**
 * Ledgerly API client.
 *
 * [Security] All requests include:
 *   - Authorization: Bearer <token>  (server validates this; client header is convenience)
 *   - X-Request-ID                   (UUID for correlating frontend errors with backend logs)
 *
 * [Security] 401 responses fire a 'ledgerly:unauthorized' event so App.jsx
 * can clear state and redirect to login, so expired tokens never silently fail.
 */

import { sanitizeText, isValidISODate } from './sanitize.js';

// Resolve the API base URL.
// - If VITE_API_BASE_URL is set to a localhost address but the page is
//   served over HTTPS (i.e. production), the browser blocks the request
//   as mixed content and fetch() throws. Guard against that by falling
//   back to '' (relative URL = same domain) in that case.
// - Empty string → relative URL → always resolves to the current domain.
// - For local dev, .env.local sets VITE_API_BASE_URL=http://localhost:8000.
const _configuredBase = import.meta.env.VITE_API_BASE_URL ?? '';
const BASE_URL =
  _configuredBase.startsWith('http://') &&
  typeof window !== 'undefined' &&
  window.location.protocol === 'https:'
    ? ''   // localhost over HTTPS = mixed content → use relative URL
    : _configuredBase;
if (import.meta.env.DEV || BASE_URL !== _configuredBase) {
  console.info('[api] BASE_URL =', BASE_URL || '(relative)');
}
const TOKEN_KEY = 'ledgerly_token';

// ─── Token helpers ────────────────────────────────────────────────────────────

export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY) || null; } catch { return null; }
}

export function setToken(token) {
  if (!token || token === 'null') return; // [Security] never store null string
  try { localStorage.setItem(TOKEN_KEY, token); } catch {}
}

export function clearToken() {
  try { localStorage.removeItem(TOKEN_KEY); } catch {}
}

function newRequestId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `req-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

async function readResponseData(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { detail: text };
  }
}

function getErrorMessage(data, fallback) {
  if (typeof data?.detail === 'string') return data.detail;
  if (Array.isArray(data?.detail)) {
    const message = data.detail.find((item) => typeof item?.msg === 'string')?.msg;
    if (message) return message.replace(/^Value error,\s*/i, '');
  }
  return fallback;
}

// ─── Core request ─────────────────────────────────────────────────────────────

async function request(method, path, body) {
  const token = getToken();
  const requestId = newRequestId();

  const headers = {
    'Content-Type': 'application/json',
    'X-Request-ID': requestId,
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    const data = await readResponseData(res);

    // [Security] 401 with an existing token means the session expired.
    // A failed login also returns 401, but should stay inside LoginScreen.
    if (res.status === 401) {
      const isAuthAttempt = path === '/api/auth/login' || path === '/api/auth/register';
      if (token && !isAuthAttempt) {
        window.dispatchEvent(new CustomEvent('ledgerly:unauthorized', {
          detail: { requestId, path },
        }));
        return { data: null, error: 'Your session has expired. Please sign in again.' };
      }
      return { data: null, error: getErrorMessage(data, 'Incorrect email or password.') };
    }

    if (!res.ok) return { data: null, error: getErrorMessage(data, 'Request failed.') };
    return { data, error: null };
  } catch (err) {
    // Network error: don't expose raw browser error message to UI
    console.error(`[api] ${method} ${path} failed`, err);
    return { data: null, error: 'Could not reach the server. Check your connection.' };
  }
}

// ─── Data transformers ────────────────────────────────────────────────────────
// [Security] Sanitize user-provided strings coming FROM the backend before
// rendering, as defence-in-depth in case backend storage was compromised.

export function transformTask(t) {
  return {
    id: t.id,
    name: sanitizeText(t.name ?? '', 200),
    description: sanitizeText(t.description ?? '', 500),
    dueDate: isValidISODate(t.due_date) ? t.due_date : '',
    status: t.status,
    steps: Array.isArray(t.steps)
      ? t.steps.map(s => sanitizeText(typeof s === 'string' ? s : s.label, 300))
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
  const timestamp = Date.parse(n.created_at);
  return {
    id: n.id,
    type: n.type,
    title: sanitizeText(n.title ?? '', 200),
    body: sanitizeText(n.body ?? '', 500),
    timestamp: Number.isFinite(timestamp) ? timestamp : Date.now(),
    read: n.is_read,
  };
}

export function transformProfile(p) {
  return {
    fullName: sanitizeText(p.full_name ?? '', 100),
    businessName: sanitizeText(p.business_name ?? '', 120),
    email: p.email ?? '',
    state: p.state ?? '',
    type: p.business_type ?? '',
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

export const getMe = () => request('GET', '/api/auth/me');

// ─── Profile ──────────────────────────────────────────────────────────────────

export const saveProfile = (profileData, taskList) =>
  request('POST', '/api/profile', {
    full_name: profileData.fullName,
    business_name: profileData.businessName,
    email: profileData.email,
    state: profileData.state,
    business_type: profileData.type,
    tasks: taskList,
  });

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
