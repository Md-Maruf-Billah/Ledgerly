/**
 * Google OAuth via Supabase Auth redirect.
 * No @supabase/supabase-js needed — we redirect to Supabase's authorize
 * endpoint directly. After Google auth, Supabase redirects back to the
 * app with the access token in the URL hash (#access_token=...).
 */

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://cvzptihhfcrqqbacevzl.supabase.co';

/** Redirect the browser to Google via Supabase OAuth. */
export function initiateGoogleSignIn() {
  const redirectTo = encodeURIComponent(window.location.origin);
  window.location.href =
    `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${redirectTo}`;
}

/**
 * After the OAuth redirect back to the app, Supabase puts the session
 * in the URL hash: #access_token=xxx&token_type=bearer&...
 * Extract and return the token, then clean the hash from the URL.
 * Returns null if there is no OAuth token in the current URL.
 */
export function extractOAuthToken() {
  const hash = window.location.hash;
  if (!hash || !hash.includes('access_token=')) return null;

  const params = new URLSearchParams(hash.slice(1)); // strip leading #
  const token = params.get('access_token');
  const error = params.get('error_description') || params.get('error');

  // Always clean the hash so the token is not visible in the address bar
  window.history.replaceState(null, '', window.location.pathname);

  if (error) {
    console.warn('[googleAuth] OAuth error:', error);
    return null;
  }
  return token || null;
}
