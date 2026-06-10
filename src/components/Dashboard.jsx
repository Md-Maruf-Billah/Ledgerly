import React, { useMemo, useState, memo } from 'react';
import TaskCard from './TaskCard';
import ObligationTimeline from './ObligationTimeline';
import {
  AlertIcon,
  ArrowRightIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
} from './Icons';
import { formatDate, getDaysLeft } from '../utils/dates';
import { STATUS_ORDER, getStatusMeta } from '../data/status';

function getNextTask(tasks) {
  const priority = { overdue: 0, 'due-soon': 1, upcoming: 2, completed: 3 };
  return [...tasks]
    .filter((task) => task.status !== 'completed')
    .sort((a, b) => {
      const statusDiff = priority[a.status] - priority[b.status];
      if (statusDiff !== 0) return statusDiff;
      return String(a.dueDate).localeCompare(String(b.dueDate));
    })[0] || null;
}

function getNextTaskMessage(task) {
  if (!task) return 'Your calendar is clear.';
  const days = getDaysLeft(task.dueDate);
  if (days === null) return 'Review this obligation when you are ready.';
  if (days < 0) return `${Math.abs(days)} days overdue. Take it one step at a time.`;
  if (days === 0) return 'Due today. Everything you need is in the checklist.';
  if (days === 1) return 'Due tomorrow. A quick review now will keep you ahead.';
  return `Due in ${days} days. You have time to plan it properly.`;
}

function Dashboard({ userProfile, tasks, completedCount, onOpenTask, onOpenSummary }) {
  const [expandedGroups, setExpandedGroups] = useState({});
  const monthLabel = useMemo(
    () => new Date().toLocaleDateString('en-AU', { month: 'long', year: 'numeric' }),
    []
  );
  const grouped = useMemo(
    () => Object.fromEntries(STATUS_ORDER.map((status) => [
      status,
      tasks.filter((task) => task.status === status),
    ])),
    [tasks]
  );
  const pendingCount = tasks.length - grouped.completed.length;
  const nextTask = useMemo(() => getNextTask(tasks), [tasks]);
  const firstName = userProfile.fullName?.split(' ')[0] || 'there';
  const scrollToGroup = (status) => {
    document.getElementById(`task-section-${status}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };
  const toggleGroup = (status) => {
    setExpandedGroups((current) => ({ ...current, [status]: !current[status] }));
  };

  return (
    <section className="screen dashboard-screen fade-in">
      <header className="page-header dashboard-page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>{monthLabel}</h1>
          <p className="page-intro">Good morning, {firstName}. Here is what deserves your attention.</p>
        </div>
        <button type="button" className="btn btn-secondary page-header-action" onClick={onOpenSummary}>
          Monthly report <ArrowRightIcon size={15} />
        </button>
      </header>

      <div className="dashboard-focus-grid">
        {nextTask ? (
          <button
            type="button"
            className={`next-obligation next-obligation--${nextTask.status}`}
            onClick={() => onOpenTask(nextTask)}
          >
            <span className="obligation-motion" aria-hidden="true">
              <span className="obligation-motion-sheet obligation-motion-sheet--one" />
              <span className="obligation-motion-sheet obligation-motion-sheet--two" />
              <span className="obligation-motion-ring" />
            </span>
            <span className="next-obligation-topline">
              <span className="eyebrow">Next obligation</span>
              <span className={`status-badge status-badge--${nextTask.status}`}>
                <span className="status-dot" aria-hidden="true" />
                {getStatusMeta(nextTask.status).label}
              </span>
            </span>
            <span className="next-obligation-title">{nextTask.name}</span>
            <span className="next-obligation-date">
              <CalendarIcon size={16} />
              Due {formatDate(nextTask.dueDate)}
            </span>
            <span className="next-obligation-message">{getNextTaskMessage(nextTask)}</span>
            <span className="next-obligation-link">
              Open checklist <ArrowRightIcon size={16} />
            </span>
          </button>
        ) : (
          <div className="next-obligation next-obligation--clear">
            <span className="next-obligation-clear-icon"><CheckIcon size={24} /></span>
            <span className="eyebrow">All clear</span>
            <span className="next-obligation-title">You are caught up</span>
            <span className="next-obligation-message">There are no pending obligations on your calendar.</span>
          </div>
        )}

        <div className="status-overview" aria-label="Monthly status summary">
          <div className="status-overview-heading">
            <div>
              <p className="eyebrow">Plan at a glance</p>
              <h2>{pendingCount === 0 ? 'Everything is handled' : `${pendingCount} open obligations`}</h2>
            </div>
            <span className="status-overview-total mono">{tasks.length}</span>
          </div>
          <div className="status-overview-list">
            <button type="button" className="status-overview-row" onClick={() => scrollToGroup('completed')}>
              <span className="metric-icon metric-icon--completed"><CheckIcon size={16} /></span>
              <span>Completed</span>
              <strong className="mono">{completedCount}</strong>
            </button>
            <button type="button" className="status-overview-row" onClick={() => scrollToGroup('overdue')}>
              <span className="metric-icon metric-icon--overdue"><AlertIcon size={16} /></span>
              <span>Needs attention</span>
              <strong className="mono">{grouped.overdue.length}</strong>
            </button>
            <button type="button" className="status-overview-row" onClick={() => scrollToGroup('due-soon')}>
              <span className="metric-icon metric-icon--due-soon"><ClockIcon size={16} /></span>
              <span>Due soon</span>
              <strong className="mono">{grouped['due-soon'].length}</strong>
            </button>
            <button type="button" className="status-overview-row" onClick={() => scrollToGroup('upcoming')}>
              <span className="metric-icon metric-icon--upcoming"><CalendarIcon size={16} /></span>
              <span>Scheduled ahead</span>
              <strong className="mono">{grouped.upcoming.length}</strong>
            </button>
          </div>
        </div>
      </div>

      {tasks.length > 0 && (
        <ObligationTimeline tasks={tasks} onOpenTask={onOpenTask} />
      )}

      {grouped.overdue.length > 0 && (
        <div className="overdue-banner" role="status">
          <span className="banner-icon"><AlertIcon size={18} /></span>
          <p className="banner-text">
            <strong>{grouped.overdue.length} obligation{grouped.overdue.length === 1 ? '' : 's'} need attention.</strong>
            {' '}Nothing is hidden, and each one has a clear checklist.
          </p>
          <button type="button" className="banner-btn" onClick={() => onOpenTask(grouped.overdue[0])}>
            Review first
          </button>
        </div>
      )}

      {pendingCount === 0 && (
        <div className="empty-state-card">
          <div className="empty-check" aria-hidden="true"><CheckIcon size={24} /></div>
          <div>
            <h2>You are all caught up</h2>
            <p>No pending compliance tasks this month. Your completed records remain below.</p>
          </div>
        </div>
      )}

      <div className="task-groups">
        {STATUS_ORDER.map((status) => {
          const list = grouped[status];
          if (!list.length) return null;
          const meta = getStatusMeta(status);
          const isExpanded = Boolean(expandedGroups[status]);
          const visibleTasks = isExpanded ? list : list.slice(0, 4);
          return (
            <section
              key={status}
              id={`task-section-${status}`}
              className={`task-section task-section--${status}`}
            >
              <div className="task-section-heading">
                <div>
                  <span className={`section-status-dot section-status-dot--${status}`} aria-hidden="true" />
                  <h2>{meta.label}</h2>
                </div>
                <span className="task-section-count mono">{list.length}</span>
              </div>
              <div className="task-list">
                {visibleTasks.map((task, index) => (
                  <TaskCard key={task.id} task={task} onOpen={onOpenTask} index={index} />
                ))}
              </div>
              {list.length > 4 && (
                <button
                  type="button"
                  className="task-group-toggle"
                  onClick={() => toggleGroup(status)}
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? 'Show fewer' : `Show ${list.length - 4} more`}
                  <ArrowRightIcon size={14} />
                </button>
              )}
            </section>
          );
        })}
      </div>
    </section>
  );
}

export default memo(Dashboard);
