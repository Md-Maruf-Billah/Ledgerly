import React, { useState } from 'react';
import { ArrowRightIcon } from './Icons';

const SIDE_IMAGE = 'https://picsum.photos/seed/ledgerly-calm-desk/1200/900';

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
