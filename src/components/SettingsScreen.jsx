import React, { useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, StarIcon } from './Icons';

const getInitials = (name) => {
  if (!name?.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  return (parts.length === 1
    ? parts[0][0]
    : parts[0][0] + parts[parts.length - 1][0]
  ).toUpperCase();
};

const PREFERENCES = [
  {
    key: 'emailReminders',
    label: 'Email Reminders',
    description: 'Deadline reminders sent to your inbox',
    defaultOn: true,
  },
  {
    key: 'pushNotifications',
    label: 'Push Notifications',
    description: 'Browser alerts for upcoming due dates',
    defaultOn: true,
  },
  {
    key: 'monthlySummary',
    label: 'Monthly Summary Email',
    description: 'A digest of your compliance activity each month',
    defaultOn: false,
  },
];

function SettingsScreen({ profile, onBack, onLogout, onToast, onOpenPricing }) {
  const [prefs, setPrefs] = useState(() =>
    Object.fromEntries(PREFERENCES.map(({ key, defaultOn }) => [key, defaultOn]))
  );

  const toggle = (key) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      onToast?.(`${PREFERENCES.find(p => p.key === key)?.label} ${next[key] ? 'enabled' : 'disabled'}`);
      return next;
    });
  };

  const initials = getInitials(profile.fullName);
  const displayName  = profile.fullName     || 'Your Name';
  const businessName = profile.businessName || 'Business Name';

  return (
    <section className="screen fade-in">
      <div className="settings-card">
        <button type="button" className="btn btn-secondary back-btn" onClick={onBack}>
          <ArrowLeftIcon size={16} /> Back to Dashboard
        </button>

        <h2>Profile &amp; Settings</h2>

        {/* ── Profile card ── */}
        <div className="profile-card">
          <div className="profile-avatar" aria-hidden="true">{initials}</div>
          <div className="profile-details">
            <p className="profile-name">{displayName}</p>
            <p className="profile-business">{businessName}</p>
            <div className="profile-tags">
              {profile.type  && <span className="profile-tag">{profile.type}</span>}
              {profile.state && <span className="profile-tag">{profile.state}</span>}
            </div>
            {profile.email && <p className="profile-email">{profile.email}</p>}
          </div>
        </div>

        {/* ── Preferences ── */}
        <h3 className="pref-heading">Preferences</h3>
        <div className="pref-list">
          {PREFERENCES.map(({ key, label, description }) => (
            <div key={key} className="pref-row">
              <div className="pref-text">
                <span className="pref-label">{label}</span>
                <span className="pref-desc">{description}</span>
              </div>
              <label className="toggle-switch" aria-label={label}>
                <input
                  type="checkbox"
                  checked={prefs[key]}
                  onChange={() => toggle(key)}
                />
                <span className="toggle-track" />
              </label>
            </div>
          ))}
        </div>

        <p className="settings-demo-note">
          This is a demo environment. Preference changes are saved locally and do not send real notifications.
        </p>

        {/* ── Log Out ── */}
        <button type="button" className="settings-plan-row" onClick={onOpenPricing}>
          <span className="settings-plan-icon"><StarIcon size={18} /></span>
          <span>
            <strong>Ledgerly Free</strong>
            <small>Compare plans and upcoming features</small>
          </span>
          <ArrowRightIcon size={17} />
        </button>

        <div className="settings-footer">
          <button className="btn logout-btn" onClick={onLogout}>Log Out</button>
        </div>
      </div>
    </section>
  );
}

export default SettingsScreen;
