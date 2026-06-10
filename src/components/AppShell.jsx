import React from 'react';
import {
  BellIcon,
  CalendarIcon,
  ChartIcon,
  HomeIcon,
  PlusIcon,
  SettingsIcon,
  StarIcon,
} from './Icons';

const PRIMARY_NAV = [
  { screen: 'dashboard', label: 'Overview', Icon: HomeIcon },
  { screen: 'calendar', label: 'Calendar', Icon: CalendarIcon },
  { screen: 'summary', label: 'Reports', Icon: ChartIcon },
  { screen: 'notifications', label: 'Alerts', Icon: BellIcon },
];

function NavButton({ item, activeScreen, onNavigate, unreadCount }) {
  const isActive = activeScreen === item.screen;
  const badge = item.screen === 'notifications' ? unreadCount : 0;
  const Icon = item.Icon;

  return (
    <button
      type="button"
      className={`shell-nav-item${isActive ? ' shell-nav-item--active' : ''}`}
      onClick={() => onNavigate(item.screen)}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="shell-nav-icon">
        <Icon size={20} />
        {badge > 0 && <span className="shell-nav-badge">{badge}</span>}
      </span>
      <span>{item.label}</span>
    </button>
  );
}

function AppShell({
  activeScreen,
  onNavigate,
  unreadCount = 0,
  onAddTask,
  profile,
  children,
}) {
  const firstName = profile?.fullName?.split(' ')[0] || 'Account';

  return (
    <div className="workspace-shell">
      <aside className="workspace-rail" aria-label="Primary navigation">
        <button
          type="button"
          className="shell-brand"
          onClick={() => onNavigate('dashboard')}
          aria-label="Ledgerly overview"
        >
          <img src="/logo-mark.svg" width="40" height="40" alt="" />
          <span>Ledgerly</span>
        </button>

        <nav className="shell-nav">
          {PRIMARY_NAV.map((item) => (
            <NavButton
              key={item.screen}
              item={item}
              activeScreen={activeScreen}
              onNavigate={onNavigate}
              unreadCount={unreadCount}
            />
          ))}
        </nav>

        <div className="shell-rail-bottom">
          <button
            type="button"
            className={`shell-nav-item${activeScreen === 'pricing' ? ' shell-nav-item--active' : ''}`}
            onClick={() => onNavigate('pricing')}
            aria-current={activeScreen === 'pricing' ? 'page' : undefined}
          >
            <span className="shell-nav-icon"><StarIcon size={20} /></span>
            <span>Plan</span>
          </button>
          <button
            type="button"
            className={`shell-profile${activeScreen === 'settings' ? ' shell-profile--active' : ''}`}
            onClick={() => onNavigate('settings')}
            aria-label="Open profile and settings"
          >
            <span className="shell-avatar" aria-hidden="true">
              {firstName.slice(0, 1).toUpperCase()}
            </span>
            <span className="shell-profile-copy">
              <strong>{firstName}</strong>
              <small>Settings</small>
            </span>
            <SettingsIcon size={17} />
          </button>
        </div>
      </aside>

      <div className="workspace-main">
        <header className="workspace-topbar">
          <button
            type="button"
            className="mobile-brand"
            onClick={() => onNavigate('dashboard')}
            aria-label="Ledgerly overview"
          >
            <img src="/logo-mark.svg" width="32" height="32" alt="" />
            <span>Ledgerly</span>
          </button>
          <button type="button" className="btn btn-primary shell-add-button" onClick={onAddTask}>
            <PlusIcon size={17} />
            Add task
          </button>
        </header>

        <div className="workspace-content">{children}</div>
      </div>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {PRIMARY_NAV.slice(0, 3).map((item) => (
          <NavButton
            key={item.screen}
            item={item}
            activeScreen={activeScreen}
            onNavigate={onNavigate}
            unreadCount={unreadCount}
          />
        ))}
        <button type="button" className="mobile-add-button" onClick={onAddTask} aria-label="Add task">
          <PlusIcon size={22} />
        </button>
        <NavButton
          item={PRIMARY_NAV[3]}
          activeScreen={activeScreen}
          onNavigate={onNavigate}
          unreadCount={unreadCount}
        />
        <button
          type="button"
          className={`shell-nav-item${['settings', 'pricing'].includes(activeScreen) ? ' shell-nav-item--active' : ''}`}
          onClick={() => onNavigate('settings')}
          aria-current={activeScreen === 'settings' ? 'page' : undefined}
        >
          <span className="shell-nav-icon"><SettingsIcon size={20} /></span>
          <span>More</span>
        </button>
      </nav>
    </div>
  );
}

export default AppShell;
