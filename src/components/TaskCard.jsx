import React from 'react';
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

  return (
    <button
      className={`task-card fade-in-task${isCompleted ? ' task-card--completed' : ''}`}
      style={{ '--stagger-delay': `${index * 45}ms` }}
      onClick={() => onOpen(task)}
    >
      <div className="task-card-body">
        <h4>{task.name}</h4>
        <p>Due: {formatDate(task.dueDate)}</p>
        <small>{isCompleted && task.completedAt ? `Completed ${task.completedAt}` : `${task.steps.length} steps`}</small>
        {label && (
          <span className={`urgency-tag urgency-${task.status}`}>{label}</span>
        )}
      </div>
      <span className={`badge ${task.status}`}>{statusLabel[task.status] || task.status}</span>
    </button>
  );
}

export default TaskCard;
