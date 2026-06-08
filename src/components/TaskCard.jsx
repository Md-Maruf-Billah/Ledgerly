import React, { memo } from 'react';
import { formatDate, getDaysLeft } from '../utils/dates';

function urgencyLabel(task) {
  const days = getDaysLeft(task.dueDate);
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return '1 day left';
  if (days <= 14) return `${days} days left`;
  return null;
}

const statusLabel = {
  overdue:    'Overdue',
  'due-soon': 'Due Soon',
  upcoming:   'Upcoming',
  completed:  'Completed',
};

function TaskCard({ task, onOpen, index = 0 }) {
  const isCompleted = task.status === 'completed';
  const label = isCompleted ? null : urgencyLabel(task);
  const days = getDaysLeft(task.dueDate);
  const urgencyHint = isCompleted ? 'completed' : days < 0 ? `${Math.abs(days)} days overdue` : days === 0 ? 'due today' : `${days} days remaining`;

  return (
    <button
      className={`task-card fade-in-task task-card--${task.status}`}
      style={{ '--stagger-delay': `${index * 45}ms` }}
      onClick={() => onOpen(task)}
      aria-label={`${task.name}, ${urgencyHint}. ${task.steps.length} steps.`}
    >
      <div className="task-card-body">
        <h4>{task.name}</h4>
        <p>Due: {formatDate(task.dueDate)}</p>
        <small>{isCompleted && task.completedAt ? `Completed ${task.completedAt}` : `${task.steps.length} steps`}</small>
        {label && (
          <span className={`urgency-tag urgency-${task.status}`} aria-hidden="true">{label}</span>
        )}
      </div>
      <span className={`badge ${task.status}`} aria-hidden="true">{statusLabel[task.status] || task.status}</span>
    </button>
  );
}

// memo: TaskCard is a pure presentational component. Without this, every
// parent state change (toast, notifications, etc.) re-renders all visible
// task cards even when the task data has not changed.
export default memo(TaskCard);
