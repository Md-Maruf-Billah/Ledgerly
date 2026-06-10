import React from 'react';
import { AlertIcon, ClockIcon, CheckIcon, InfoIcon, BellIcon, ArrowLeftIcon, ArrowRightIcon } from './Icons';

const TYPE_ICON = {
  overdue:   <AlertIcon size={15} />,
  upcoming:  <ClockIcon size={15} />,
  completed: <CheckIcon size={15} strokeWidth={2.5} />,
  system:    <InfoIcon size={15} />,
};

function timeAgo(timestamp) {
  if (!Number.isFinite(timestamp)) return 'Just now';
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function Notifications({ notifications, tasks = [], onBack, onOpenTask, onOpenCalendar }) {
  const sorted = [...notifications].sort((a, b) => b.timestamp - a.timestamp);
  const getNotificationAction = (notification) => {
    const matchingTask = tasks.find((task) => notification.title?.startsWith(task.name));
    if (matchingTask) return () => onOpenTask?.(matchingTask);
    if (notification.type === 'system') return onOpenCalendar;
    return null;
  };

  return (
    <section className="screen fade-in">
      <div className="notif-wrap">
        <button type="button" className="btn btn-secondary back-btn" onClick={onBack}>
          <ArrowLeftIcon size={16} /> Back to Dashboard
        </button>

        <h2 className="notif-heading">Notifications</h2>

        {sorted.length === 0 ? (
          <div className="notif-empty">
            <div className="notif-empty-icon" aria-hidden="true"><BellIcon size={36} /></div>
            <p className="notif-empty-text">No notifications yet.</p>
          </div>
        ) : (
          <ul className="notif-list" aria-label="Notifications">
            {sorted.map(n => {
              const action = getNotificationAction(n);
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    className={`notif-item notif-type-${n.type}${n.read ? ' notif-read' : ''}`}
                    onClick={action || undefined}
                    disabled={!action}
                  >
                    <span className="notif-icon" aria-hidden="true">
                      {TYPE_ICON[n.type] || <InfoIcon size={15} />}
                    </span>
                    <span className="notif-body">
                      <span className="notif-title">{n.title}</span>
                      <span className="notif-text">{n.body}</span>
                      <span className="notif-time">{timeAgo(n.timestamp)}</span>
                    </span>
                    <span className="notif-end">
                      {!n.read && <span className="notif-dot" aria-label="Unread" />}
                      {action && <ArrowRightIcon size={15} />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

export default Notifications;
