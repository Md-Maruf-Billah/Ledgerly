import React, { useState } from 'react';
import { ArrowRightIcon } from './Icons';
import { initiateGoogleSignIn } from '../utils/googleAuth';

const SIDE_IMAGE = 'https://picsum.photos/seed/ledgerly-calm-desk/1200/900';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
    <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
  </svg>
);

function LoginScreen({ onLoginSuccess, onRegisterSuccess, onDemoLogin }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
    setAuthError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = 'Email is required.';
    if (!form.password) nextErrors.password = 'Password is required.';
    if (mode === 'signup' && form.password.length < 6)
      nextErrors.password = 'Password must be at least 6 characters.';
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setAuthError('');

    if (mode === 'signup') {
      onRegisterSuccess(form.email, form.password, setAuthError, () => setLoading(false));
    } else {
      onLoginSuccess(form.email, form.password, setAuthError, () => setLoading(false));
    }
  };

  const switchMode = () => {
    setMode(m => (m === 'signin' ? 'signup' : 'signin'));
    setErrors({});
    setAuthError('');
  };

  return (
    <main className="simple-login-page">
      <section className="simple-login-shell" aria-label="Ledgerly sign in">
        <aside
          className="simple-login-story"
          style={{ '--login-bg-image': `url(${SIDE_IMAGE})` }}
        >
          <div className="simple-login-brand">
            <div className="brand-mark simple-login-mark" aria-hidden="true">
              <div className="brand-grid"><span /><span /><span /><span /></div>
            </div>
            <span>Ledgerly</span>
          </div>

          <div className="simple-login-copy">
            <h1>Keep every compliance date in view.</h1>
            <p>
              Ledgerly gives Australian sole traders a calm calendar for BAS, PAYG,
              super, renewals, and the records that prove each task was handled.
            </p>
          </div>
        </aside>

        <div className="simple-login-panel">
          <div className="login-card simple-login-card fade-in">
            <h2 className="login-form-heading">
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </h2>
            <p className="subtitle">
              {mode === 'signin'
                ? 'Access your compliance calendar.'
                : 'Set up your free Ledgerly account.'}
            </p>

            {/* ── Google OAuth ───────────────────────────────── */}
            <button
              type="button"
              className="btn-google"
              onClick={initiateGoogleSignIn}
              disabled={loading}
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="login-divider"><span>or</span></div>

            {/* ── Email / Password form ──────────────────────── */}
            <form onSubmit={handleSubmit} className="login-form" noValidate>
              <label className="login-label">
                Email
                <input
                  type="email"
                  className={`login-input${errors.email ? ' input-error' : ''}`}
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={loading}
                />
                {errors.email && <small className="error-text">{errors.email}</small>}
              </label>

              <label className="login-label">
                Password
                <input
                  type="password"
                  className={`login-input${errors.password ? ' input-error' : ''}`}
                  value={form.password}
                  onChange={e => handleChange('password', e.target.value)}
                  placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  disabled={loading}
                />
                {errors.password && <small className="error-text">{errors.password}</small>}
              </label>

              {authError && (
                <p className="auth-error" role="alert">{authError}</p>
              )}

              <button
                type="submit"
                className={`btn btn-primary login-submit${loading ? ' btn-loading' : ''}`}
                disabled={loading}
              >
                {loading
                  ? <><span className="btn-spinner" aria-hidden="true" /> {mode === 'signin' ? 'Signing in…' : 'Creating account…'}</>
                  : <><ArrowRightIcon size={16} /> {mode === 'signin' ? 'Sign in' : 'Create account'}</>}
              </button>
            </form>

            <p className="login-switch-mode">
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button type="button" className="link-btn" onClick={switchMode} disabled={loading}>
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>

            <div className="login-divider"><span>or</span></div>

            <button type="button" className="btn btn-secondary" onClick={onDemoLogin} disabled={loading}>
              Try demo mode
            </button>

            <p className="demo-hint">
              Explore Ledgerly with sample data — no account needed.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LoginScreen;
