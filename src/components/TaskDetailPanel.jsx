import React, { useState, useEffect } from 'react';
import { formatDate } from '../utils/dates';
import { CloseIcon, CheckIcon } from './Icons';

function StepProgressRing({ checked, total }) {
  const done = checked.filter(Boolean).length;
  const r = 20;
  const cx = 26;
  const cy = 26;
  const circ = 2 * Math.PI * r;
  const pct    = total > 0 ? done / total : 0;
  const offset = circ * (1 - pct);
  const color  = pct === 1 ? 'var(--brand-green, #246b45)' : 'var(--brand-orange, #ff6200)';
  const textColor = pct === 1 ? 'var(--brand-green, #246b45)' : 'var(--brand-ink, #1a1a1a)';

  return (
    <svg
      width="48" height="48"
      viewBox="0 0 52 52"
      className="step-ring"
      aria-label={`${done} of ${total} steps complete`}
    >
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(63,43,28,0.1)" strokeWidth="3" />
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dashoffset 300ms cubic-bezier(0.23,1,0.32,1), stroke 200ms ease' }}
      />
      <text
        x={cx} y={cy + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="10"
        fontWeight="700"
        fill={textColor}
        fontFamily="DM Sans, system-ui, sans-serif"
      >
        {done}/{total}
      </text>
    </svg>
  );
}

function TaskDetailPanel({ task, onClose, onMarkDone }) {
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    if (task) {
      const steps = Array.isArray(task.steps) ? task.steps : [];
      setChecked(new Array(steps.length).fill(task.status === 'completed'));
    }
  }, [task?.id]);

  if (!task) return null;

  const isCompleted = task.status === 'completed';
  const steps = Array.isArray(task.steps) ? task.steps : [];
  const allDone = checked.length > 0 && checked.every(Boolean);

  const toggle = (i) => {
    if (isCompleted) return;
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  const handleKeyDown = (e, i) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle(i);
    }
  };

  return (
    <div
      className="overlay"
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="detail-panel slide-up">

        {/* Header row: title + ring + close */}
        <div className="panel-header">
          <div className="panel-title-text">
            <h3>{task.name}</h3>
            <p className="subtitle">{task.description}</p>
          </div>
          <div className="panel-header-right">
            <StepProgressRing checked={checked} total={steps.length} />
            <button className="close-btn" onClick={onClose} aria-label="Close">
              <CloseIcon size={16} />
            </button>
          </div>
        </div>

        <p className="panel-meta"><strong>Due date:</strong> {formatDate(task.dueDate)}</p>
        {isCompleted && task.completedAt && (
          <p className="completed-note">
            <CheckIcon size={13} strokeWidth={2.5} /> Completed {task.completedAt}
          </p>
        )}

        <ul className="step-list" aria-label="Task steps">
          {steps.map((step, i) => (
            <li
              key={`${task.id}-${i}`}
              className={`step-item${checked[i] ? ' step-done' : ''}`}
              role="checkbox"
              aria-checked={checked[i]}
              tabIndex={isCompleted ? -1 : 0}
              onClick={() => toggle(i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              style={{ cursor: isCompleted ? 'default' : 'pointer' }}
            >
              <span className="step-check" aria-hidden="true">
                {checked[i] ? <CheckIcon size={11} strokeWidth={3} /> : null}
              </span>
              <span className="step-text">{step}</span>
            </li>
          ))}
        </ul>

        <button
          className={`btn btn-full${allDone ? ' btn-primary' : ' btn-locked'}`}
          onClick={allDone && !isCompleted ? () => onMarkDone(task.id) : undefined}
          disabled={!allDone || isCompleted}
          aria-disabled={!allDone || isCompleted}
        >
          {isCompleted
            ? <><CheckIcon size={16} strokeWidth={2.5} /> Completed</>
            : allDone
            ? <><CheckIcon size={16} strokeWidth={2.5} /> Mark as Done</>
            : 'Complete all steps first'}
        </button>
      </div>
    </div>
  );
}

export default TaskDetailPanel;
