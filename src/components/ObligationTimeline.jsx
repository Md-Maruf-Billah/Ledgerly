import React, { useMemo } from 'react';
import { formatDate } from '../utils/dates';
import { getStatusMeta } from '../data/status';

function ObligationTimeline({ tasks, onOpenTask }) {
  const timeline = useMemo(
    () => [...tasks]
      .filter((task) => task.status !== 'completed')
      .sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)))
      .slice(0, 6),
    [tasks]
  );

  if (!timeline.length) return null;

  const lastDate = new Date(`${timeline[timeline.length - 1].dueDate}T00:00:00`)
    .toLocaleDateString('en-AU', { month: 'short', year: 'numeric' });

  return (
    <section className="obligation-timeline" aria-labelledby="timeline-title">
      <div className="timeline-header">
        <div>
          <p className="eyebrow">Planner</p>
          <h2 id="timeline-title">What is ahead</h2>
        </div>
        <span className="timeline-range mono">Through {lastDate}</span>
      </div>

      <div className="timeline-track">
        {timeline.map((task) => {
          const meta = getStatusMeta(task.status);
          const date = new Date(`${task.dueDate}T00:00:00`);
          return (
            <button
              type="button"
              key={task.id}
              className={`timeline-node timeline-node--${task.status}`}
              onClick={() => onOpenTask?.(task)}
              aria-label={`${task.name}, ${meta.label}, due ${formatDate(task.dueDate)}`}
            >
              <span className="timeline-node-marker" aria-hidden="true">
                <span className="timeline-node-dot" />
              </span>
              <span className="timeline-node-date mono">
                {date.toLocaleDateString('en-AU', { day: '2-digit', month: 'short' })}
              </span>
              <span className="timeline-node-name">{task.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default ObligationTimeline;
