import React, { useState } from 'react';
import { ArrowRightIcon, CalendarIcon, CheckIcon, ClockIcon } from './Icons';
import { getPasswordError, isValidEmail } from '../utils/sanitize.js';

function LoginScreen({ onLoginSuccess, onRegisterSuccess, onDemoLogin }) {
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleChange = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '' }));
    setAuthError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = 'Email is required.';
    else if (!isValidEmail(form.email)) nextErrors.email = 'Enter a valid email address.';
    if (!form.password) nextErrors.password = 'Password is required.';
    else if (form.password.length > 128) nextErrors.password = 'Password must be 128 characters or fewer.';
    else if (mode === 'signup') {
      const passwordError = getPasswordError(form.password);
      if (passwordError) nextErrors.password = passwordError;
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setAuthError('');
    const finish = () => setLoading(false);
    if (mode === 'signup') {
      onRegisterSuccess(form.email, form.password, setAuthError, finish);
    } else {
      onLoginSuccess(form.email, form.password, setAuthError, finish);
    }
  };

  const switchMode = () => {
    setMode((current) => current === 'signin' ? 'signup' : 'signin');
    setErrors({});
    setAuthError('');
  };

  return (
    <section className="login-screen">
      <aside className="login-story">
        <span className="login-ripple" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>

        <div className="login-brand-lockup">
          <img src="/logo-mark-light.svg" width="42" height="42" alt="" />
          <span>Ledgerly</span>
        </div>

        <div className="login-story-copy">
          <p className="login-eyebrow">Compliance, calmly handled</p>
          <h1>Every deadline in one clear place.</h1>
          <p>
            Ledgerly turns BAS, PAYG, super and renewals into a practical plan,
            so you always know what comes next.
          </p>
        </div>

        <div className="login-ledger-preview" aria-hidden="true">
          <div className="login-ledger-month">
            <span>June</span>
            <strong>2026</strong>
          </div>
          <div className="login-ledger-item login-ledger-item--soon">
            <span className="login-ledger-icon"><ClockIcon size={16} /></span>
            <span><strong>PAYG instalment</strong><small>Due in 11 days</small></span>
            <span className="login-ledger-date">21 JUN</span>
          </div>
          <div className="login-ledger-item login-ledger-item--upcoming">
            <span className="login-ledger-icon"><CalendarIcon size={16} /></span>
            <span><strong>BAS lodgement</strong><small>Scheduled ahead</small></span>
            <span className="login-ledger-date">28 JUL</span>
          </div>
          <div className="login-ledger-progress">
            <span><CheckIcon size={14} /> Your year is mapped</span>
            <strong>15 planning points</strong>
          </div>
        </div>

        <ul className="login-benefits">
          <li><CheckIcon size={15} /> Plain-English checklists for each obligation</li>
          <li><CheckIcon size={15} /> Calm reminders before deadlines arrive</li>
          <li><CheckIcon size={15} /> A completion record you can return to</li>
        </ul>
      </aside>

      <div className="login-form-panel">
        <div className="login-card fade-in">
          <div className="login-mobile-brand">
            <img src="/logo-mark.svg" width="34" height="34" alt="" />
            <span>Ledgerly</span>
          </div>

          <p className="eyebrow">{mode === 'signin' ? 'Your compliance workspace' : 'Start your calendar'}</p>
          <h2>{mode === 'signin' ? 'Sign in to Ledgerly' : 'Create your account'}</h2>
          <p className="login-subtitle">
            {mode === 'signin'
              ? 'Sign in to view your deadlines and next steps.'
              : 'Set up your compliance workspace in a few minutes.'}
          </p>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <label className="field">
              <span>Email address</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => handleChange('email', event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && <small className="error-text">{errors.email}</small>}
            </label>

            <label className="field">
              <span>Password</span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => handleChange('password', event.target.value)}
                placeholder={mode === 'signup' ? 'At least 12 characters' : 'Enter your password'}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                disabled={loading}
                aria-invalid={Boolean(errors.password)}
                minLength={mode === 'signup' ? 12 : undefined}
                maxLength={128}
              />
              {errors.password && <small className="error-text">{errors.password}</small>}
              {mode === 'signup' && !errors.password && (
                <small className="password-hint">Use 12+ characters. Passphrases and password managers work well.</small>
              )}
            </label>

            {authError && <p className="auth-error" role="alert">{authError}</p>}

            <button type="submit" className="btn btn-primary btn-full login-submit" disabled={loading}>
              {loading
                ? <><span className="btn-spinner" aria-hidden="true" /> Working...</>
                : <>{mode === 'signin' ? 'Sign in' : 'Create account'} <ArrowRightIcon size={16} /></>}
            </button>
          </form>

          <p className="login-switch">
            {mode === 'signin' ? 'New to Ledgerly?' : 'Already have an account?'}
            <button type="button" className="text-button" onClick={switchMode} disabled={loading}>
              {mode === 'signin' ? 'Create an account' : 'Sign in instead'}
            </button>
          </p>

          <div className="login-divider"><span>or explore first</span></div>

          <button type="button" className="btn btn-secondary btn-full" onClick={onDemoLogin} disabled={loading}>
            Open demo workspace
          </button>
          <p className="demo-hint">Uses sample data. No account or setup required.</p>
        </div>
      </div>
    </section>
  );
}

export default LoginScreen;
