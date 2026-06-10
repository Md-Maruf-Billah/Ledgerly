import React, { useEffect, useRef, useState } from 'react';
import { formatDate } from '../utils/dates';
import { CalendarIcon, CheckIcon, CloseIcon } from './Icons';
import { getStatusMeta } from '../data/status';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function StepProgressRing({ checked, total }) {
  const done = checked.filter(Boolean).length;
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? done / total : 0;

  return (
    <div className={`step-progress${progress === 1 ? ' step-progress--complete' : ''}`}>
      <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden="true">
        <circle className="step-progress-track" cx="26" cy="26" r={radius} />
        <circle
          className="step-progress-value"
          cx="26"
          cy="26"
          r={radius}
          strokeDasharray={circumference}
          style={{ '--progress-offset': circumference * (1 - progress) }}
        />
      </svg>
      <span className="step-progress-label mono">{done}/{total}</span>
    </div>
  );
}

function TaskDetailPanel({ task, onClose, onMarkDone }) {
  const [checked, setChecked] = useState([]);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!task) return undefined;
    const steps = Array.isArray(task.steps) ? task.steps : [];
    setChecked(new Array(steps.length).fill(task.status === 'completed'));
    previousFocusRef.current = document.activeElement;
    document.body.classList.add('panel-open');
    requestAnimationFrame(() => closeRef.current?.focus());

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const nodes = [...panelRef.current.querySelectorAll(FOCUSABLE)].filter(
        (node) => !node.disabled
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('panel-open');
      previousFocusRef.current?.focus?.();
    };
  }, [task?.id, onClose]);

  if (!task) return null;

  const isCompleted = task.status === 'completed';
  const steps = Array.isArray(task.steps) ? task.steps : [];
  const allDone = checked.length > 0 && checked.every(Boolean);
  const meta = getStatusMeta(task.status);

  const toggle = (index) => {
    if (isCompleted) return;
    setChecked((current) => current.map((value, itemIndex) => (
      itemIndex === index ? !value : value
    )));
  };

  return (
    <div
      className="overlay task-detail-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="detail-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-detail-title"
        ref={panelRef}
      >
        <div className="detail-panel-header">
          <span className={`status-badge status-badge--${task.status}`}>
            <span className="status-dot" aria-hidden="true" />
            {meta.label}
          </span>
          <button ref={closeRef} className="icon-btn close-btn" onClick={onClose} aria-label="Close task detail">
            <CloseIcon size={17} />
          </button>
        </div>

        <div className="detail-panel-content">
          <div className="detail-title-row">
            <div>
              <p className="eyebrow">Obligation checklist</p>
              <h2 id="task-detail-title">{task.name}</h2>
            </div>
            <StepProgressRing checked={checked} total={steps.length} />
          </div>

          <p className="detail-description">{task.description}</p>
          <div className="detail-meta">
            <CalendarIcon size={16} />
            <span>Due {formatDate(task.dueDate)}</span>
            <span aria-hidden="true">•</span>
            <span>{steps.length} steps</span>
          </div>

          {isCompleted && task.completedAt && (
            <div className="completed-note">
              <CheckIcon size={16} />
              Completed {task.completedAt}
            </div>
          )}

          <div className="detail-section-heading">
            <h3>How to complete it</h3>
            <span className="mono">{checked.filter(Boolean).length}/{steps.length}</span>
          </div>

          <ul className="step-list" aria-label="Task steps">
            {steps.map((step, index) => (
              <li key={`${task.id}-${index}`}>
                <label className={`step-item${checked[index] ? ' step-done' : ''}`}>
                  <input
                    type="checkbox"
                    checked={Boolean(checked[index])}
                    disabled={isCompleted}
                    onChange={() => toggle(index)}
                  />
                  <span className="step-check" aria-hidden="true">
                    {checked[index] && <CheckIcon size={12} strokeWidth={3} />}
                  </span>
                  <span className="step-text">{step}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="detail-panel-footer">
          <button
            type="button"
            className={`btn btn-full${allDone && !isCompleted ? ' btn-primary' : ' btn-secondary'}`}
            onClick={allDone && !isCompleted ? () => onMarkDone(task.id) : undefined}
            disabled={!allDone || isCompleted}
          >
            {isCompleted
              ? <><CheckIcon size={16} /> Completed</>
              : allDone
                ? <><CheckIcon size={16} /> Mark as complete</>
                : `Complete all steps (${checked.filter(Boolean).length}/${steps.length})`}
          </button>
        </div>
      </section>
    </div>
  );
}

export default TaskDetailPanel;
