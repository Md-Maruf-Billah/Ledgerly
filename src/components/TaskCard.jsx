import React, { memo } from 'react';
import { ArrowRightIcon, CheckIcon } from './Icons';
import { formatDate, getDaysLeft } from '../utils/dates';
import { getStatusMeta } from '../data/status';

function getUrgency(task) {
  if (task.status === 'completed') {
    return task.completedAt ? `Completed ${task.completedAt}` : 'Completed';
  }
  const days = getDaysLeft(task.dueDate);
  if (days === null) return `${task.steps?.length || 0} steps`;
  if (days < 0) return `${Math.abs(days)} days overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return '1 day remaining';
  if (days <= 14) return `${days} days remaining`;
  return `${task.steps?.length || 0} steps`;
}

function TaskCard({ task, onOpen, index = 0 }) {
  const steps = Array.isArray(task.steps) ? task.steps : [];
  const meta = getStatusMeta(task.status);
  const urgency = getUrgency(task);

  return (
    <button
      type="button"
      className={`task-card task-card--${task.status}`}
      style={{ '--stagger-delay': `${Math.min(index, 5) * 45}ms` }}
      onClick={() => onOpen(task)}
      aria-label={`${task.name}, ${meta.label}. Due ${formatDate(task.dueDate)}. ${steps.length} steps.`}
    >
      <span className="task-card-date" aria-hidden="true">
        <span className="task-card-date-day mono">
          {new Date(`${task.dueDate}T00:00:00`).toLocaleDateString('en-AU', { day: '2-digit' })}
        </span>
        <span className="task-card-date-month">
          {new Date(`${task.dueDate}T00:00:00`).toLocaleDateString('en-AU', { month: 'short' })}
        </span>
      </span>
      <span className="task-card-body">
        <span className="task-card-title">{task.name}</span>
        <span className="task-card-meta">
          <span className="mono">Due {formatDate(task.dueDate)}</span>
          <span aria-hidden="true">•</span>
          <span>{urgency}</span>
        </span>
      </span>
      <span className={`status-badge status-badge--${task.status}`}>
        <span className="status-dot" aria-hidden="true" />
        {meta.label}
      </span>
      <span className="task-card-arrow" aria-hidden="true">
        {task.status === 'completed' ? <CheckIcon size={17} /> : <ArrowRightIcon size={17} />}
      </span>
    </button>
  );
}

export default memo(TaskCard);
