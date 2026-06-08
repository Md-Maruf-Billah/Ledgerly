import React, { useRef, useMemo, memo } from 'react';
import TaskCard from './TaskCard';
import ObligationTimeline from './ObligationTimeline';
import { StarIcon, BellIcon, SettingsIcon, AlertIcon, CheckIcon, PlusIcon, ArrowRightIcon, CalendarIcon } from './Icons';

function Dashboard({ userProfile, tasks, completedCount, onOpenTask, onOpenSummary, onOpenSettings, onOpenNotifications, onOpenPricing, onAddTask, onOpenCalendar, unreadCount }) {
  // monthLabel is stable for the lifetime of one dashboard mount
  const monthLabel = useMemo(
    () => new Date().toLocaleDateString('en-AU', { month: 'long', year: 'numeric' }),
    []
  );
  // Filtered task groups — only recompute when tasks array reference changes
  const overdue      = useMemo(() => tasks.filter(t => t.status === 'overdue'),    [tasks]);
  const dueSoon      = useMemo(() => tasks.filter(t => t.status === 'due-soon'),   [tasks]);
  const upcoming     = useMemo(() => tasks.filter(t => t.status === 'upcoming'),   [tasks]);
  const completed    = useMemo(() => tasks.filter(t => t.status === 'completed'),  [tasks]);
  const pendingCount = useMemo(() => tasks.length - completed.length, [tasks, completed]);
  const overdueRef = useRef(null);

  const scrollToOverdue = () =>
    overdueRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <section className="screen fade-in">
      <div className="dashboard-wrap">

        <header className="dashboard-head">
          <div className="dashboard-head-left">
            <p className="brand-mini">Ledgerly</p>
            <h2 className="dashboard-month">{monthLabel}</h2>
            <p className="subtitle">Welcome back, {userProfile.fullName?.split(' ')[0] || 'there'}.</p>
          </div>
          <div className="dash-actions">
            <button className="icon-btn" type="button" onClick={onOpenCalendar} aria-label="Open calendar">
              <CalendarIcon size={18} />
            </button>
            <button className="icon-btn" type="button" onClick={onOpenPricing} aria-label="Upgrade to Pro">
              <StarIcon size={18} />
            </button>
            <button className="icon-btn notif-btn" type="button" onClick={onOpenNotifications} aria-label="Notifications">
              <BellIcon size={18} />
              {unreadCount > 0 && (
                <span className="notif-badge" aria-label={`${unreadCount} unread`}>{unreadCount}</span>
              )}
            </button>
            <button className="icon-btn" type="button" onClick={onOpenSettings} aria-label="Open settings">
              <SettingsIcon size={18} />
            </button>
          </div>
        </header>

        <div className="metric-strip">
          <div className="metric">
            <span className="metric-num metric-num--complete">{completedCount}</span>
            <span className="metric-label">Completed</span>
          </div>
          <div className="metric-divider" aria-hidden="true" />
          <div className="metric">
            <span className={`metric-num${overdue.length > 0 ? ' metric-num--overdue' : ''}`}>{overdue.length}</span>
            <span className="metric-label">Overdue</span>
          </div>
          <div className="metric-divider" aria-hidden="true" />
          <div className="metric">
            <span className="metric-num">{pendingCount}</span>
            <span className="metric-label">Pending</span>
          </div>
          <button type="button" className="metric-summary-btn" onClick={onOpenSummary}>
            Monthly report
            <ArrowRightIcon size={14} />
          </button>
        </div>

        {tasks.length > 0 && (
          <ObligationTimeline tasks={tasks} onOpenTask={onOpenTask} />
        )}

        {overdue.length > 0 && (
          <div className="overdue-banner" role="alert">
            <span className="banner-icon"><AlertIcon size={18} /></span>
            <p className="banner-text">
              You have <strong>{overdue.length}</strong> overdue obligation{overdue.length !== 1 ? 's' : ''}.
              Review these first when you are ready.
            </p>
            <button type="button" className="banner-btn" onClick={scrollToOverdue}>
              View Overdue
            </button>
          </div>
        )}

        {pendingCount === 0 && (
          <div className="empty-state-card fade-in">
            <div className="empty-check" aria-hidden="true">
              <CheckIcon size={26} strokeWidth={2.5} />
            </div>
            <h3 className="empty-state-heading">You're all caught up</h3>
            <p className="empty-state-sub">No pending compliance tasks this month. Check back next month.</p>
          </div>
        )}

        {pendingCount > 0 && (
          <>
            <div className="task-section" ref={overdueRef}>
              <h3 className="section-label section-overdue">Overdue</h3>
              {overdue.length
                ? overdue.map((task, i) => (
                    <TaskCard key={task.id} task={task} onOpen={onOpenTask} index={i} />
                  ))
                : <p className="empty">No overdue tasks.</p>}
            </div>

            <div className="task-section">
              <h3 className="section-label section-due-soon">Due Soon</h3>
              {dueSoon.length
                ? dueSoon.map((task, i) => (
                    <TaskCard key={task.id} task={task} onOpen={onOpenTask} index={overdue.length + i} />
                  ))
                : <p className="empty">No tasks due soon.</p>}
            </div>

            <div className="task-section">
              <h3 className="section-label section-upcoming">Upcoming</h3>
              {upcoming.length
                ? upcoming.map((task, i) => (
                    <TaskCard key={task.id} task={task} onOpen={onOpenTask} index={overdue.length + dueSoon.length + i} />
                  ))
                : <p className="empty">No upcoming tasks.</p>}
            </div>
          </>
        )}

        {completed.length > 0 && (
          <div className="task-section">
            <h3 className="section-label section-completed">Completed</h3>
            {completed.map((task, i) => (
              <TaskCard
                key={task.id}
                task={task}
                onOpen={onOpenTask}
                index={overdue.length + dueSoon.length + upcoming.length + i}
              />
            ))}
          </div>
        )}

        <button type="button" className="add-task-btn" onClick={onAddTask}>
          <PlusIcon size={15} />
          Add Custom Task
        </button>

      </div>
    </section>
  );
}

// memo: Dashboard re-renders only when its props change.
// Without this it re-renders on every App.jsx state change (e.g. toast).
export default memo(Dashboard);
