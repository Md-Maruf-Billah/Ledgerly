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
export function isValidISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
}

/**
 * Validate that a date string is not more than 5 years in the future.
 */
export function isDateInRange(value) {
  if (!isValidISODate(value)) return false;
  const d = new Date(value);
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
