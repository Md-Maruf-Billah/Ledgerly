/**
 * Ledgerly API client.
 *
 * Base URL is read from the VITE_API_BASE_URL env var so that
 * local dev (http://localhost:8000) and production URLs can both
 * be set without code changes.
 *
 * All functions return { data, error } — callers never need try/catch.
 *
 * INTEGRATION NOTE: Each function currently returns a local mock
 * response. Replace the mock block with the fetch() call once the
 * FastAPI backend is running and Supabase is connected.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

async function request(method, path, body) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const data = await res.json();
    if (!res.ok) return { data: null, error: data?.detail ?? 'Request failed' };
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

// ─── Health ──────────────────────────────────────────────────────────────────

export const healthCheck = () => request('GET', '/health');

// ─── Auth ─────────────────────────────────────────────────────────────────────

/**
 * INTEGRATION POINT — Auth: Login
 * Replace mock return with: return request('POST', '/api/auth/login', { email, password });
 */
export async function login(email, password) {
  // Mock: accepted by LoginScreen's own validation
  return { data: { message: 'ok' }, error: null };
}

/**
 * INTEGRATION POINT — Auth: Register
 * Replace mock return with: return request('POST', '/api/auth/register', payload);
 */
export async function register(payload) {
  return { data: { message: 'ok' }, error: null };
}

/**
 * INTEGRATION POINT — Auth: Logout
 * Replace mock return with: return request('POST', '/api/auth/logout');
 */
export async function logout() {
  return { data: { message: 'ok' }, error: null };
}

// ─── Business Profile ─────────────────────────────────────────────────────────

/**
 * INTEGRATION POINT — Profile: Save onboarding profile
 * Replace mock return with: return request('POST', '/api/profile', profile);
 */
export async function saveProfile(profile) {
  return { data: profile, error: null };
}

/**
 * INTEGRATION POINT — Profile: Fetch profile
 * Replace mock return with: return request('GET', `/api/profile/${userId}`);
 */
export async function fetchProfile(userId) {
  return { data: null, error: null };
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

/**
 * INTEGRATION POINT — Tasks: Fetch all tasks for user
 * Replace mock return with: return request('GET', `/api/tasks/${userId}`);
 */
export async function fetchTasks(userId) {
  return { data: null, error: null };
}

/**
 * INTEGRATION POINT — Tasks: Create a custom task
 * Replace mock return with: return request('POST', `/api/tasks/${userId}`, task);
 */
export async function createTask(userId, task) {
  return { data: task, error: null };
}

/**
 * INTEGRATION POINT — Tasks: Mark task as done
 * Replace mock return with: return request('PUT', `/api/tasks/${userId}/${taskId}`, { status: 'completed' });
 */
export async function markTaskDone(userId, taskId) {
  return { data: { status: 'completed' }, error: null };
}

/**
 * INTEGRATION POINT — Tasks: Delete a custom task
 * Replace mock return with: return request('DELETE', `/api/tasks/${userId}/${taskId}`);
 */
export async function deleteTask(userId, taskId) {
  return { data: { message: 'deleted' }, error: null };
}

// ─── Notifications ────────────────────────────────────────────────────────────

/**
 * INTEGRATION POINT — Notifications: Fetch notifications
 * Replace mock return with: return request('GET', `/api/notifications/${userId}`);
 */
export async function fetchNotifications(userId) {
  return { data: null, error: null };
}

/**
 * INTEGRATION POINT — Notifications: Mark notification read
 * Replace mock return with: return request('PUT', `/api/notifications/${userId}/${notifId}/read`);
 */
export async function markNotificationRead(userId, notifId) {
  return { data: { message: 'ok' }, error: null };
}
