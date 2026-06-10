/**
 * Client-side sanitization helpers.
 *
 * These are a convenience layer — server-side validation is the real gate.
 * Never rely solely on client-side sanitization to prevent injection attacks.
 */

/**
 * Strip HTML tags and trim whitespace.
 * Prevents reflected XSS when user-entered strings are rendered via innerHTML
 * (we use React's textContent by default, so this is belt-and-suspenders).
 */
export function stripTags(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/<[^>]*>/g, '').trim();
}

/**
 * Enforce a maximum character length and strip tags.
 */
export function sanitizeText(value, maxLength = 200) {
  return stripTags(value).slice(0, maxLength);
}

/**
 * Validate an ISO date string (YYYY-MM-DD).
 * Returns true if valid, false otherwise.
 */
function parseISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

export function isValidISODate(value) {
  return parseISODate(value) !== null;
}

/**
 * Validate that a date string is not more than 5 years in the future.
 */
export function isDateInRange(value) {
  const d = parseISODate(value);
  if (!d) return false;
  const max = new Date();
  max.setFullYear(max.getFullYear() + 5);
  const min = new Date();
  min.setFullYear(min.getFullYear() - 2);
  return d >= min && d <= max;
}

/**
 * Validate an email address format (basic).
 */
export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

const COMMON_PASSWORDS = new Set([
  '123456789012',
  'password1234',
  'qwerty123456',
  'letmein123456',
  'admin12345678',
]);

export function getPasswordError(value) {
  if (!value) return 'Password is required.';
  if (value.length < 12) return 'Use at least 12 characters.';
  if (value.length > 128) return 'Password must be 128 characters or fewer.';
  if (COMMON_PASSWORDS.has(value.toLowerCase())) {
    return 'Choose a less common password.';
  }
  return '';
}
