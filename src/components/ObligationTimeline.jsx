import React from 'react';

const W = 700;
const H = 82;
const AXIS_Y = 58;
const DOT_Y  = 36;
const STAG_Y = 18;
const L = 24;
const R = 24;
const PLOT_W = W - L - R;

const STATUS_STROKE = { overdue: '#9f241f', 'due-soon': '#a86a08', upcoming: '#496daf', completed: '#237045' };
const STATUS_FILL   = { overdue: '#fff1ef', 'due-soon': '#fff6dc', upcoming: '#edf3ff', completed: '#eef8f1' };
const STATUS_GLOW   = { overdue: '#d97a73', 'due-soon': '#d69b37', upcoming: '#88a5df', completed: '#78bd91' };

function ObligationTimeline({ tasks, onOpenTask }) {
  if (!tasks || tasks.length === 0) return null;

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayMs  = new Date(todayStr + 'T00:00:00').getTime();

  const tMs = tasks.map(t => new Date(t.dueDate + 'T00:00:00').getTime());
  const minT = Math.min(...tMs);
  const maxT = Math.max(...tMs);

  const start = Math.min(todayMs - 10 * 86400000, minT - 7 * 86400000);
  const end   = Math.max(todayMs + 60 * 86400000, maxT + 14 * 86400000);
  const span  = end - start;

  function xFor(ms) {
    return L + ((ms - start) / span) * PLOT_W;
  }

  const todayX = xFor(todayMs);

  // Sorted dot positions with vertical stagger for collision
  const sorted = [...tasks]
    .map(t => ({ ...t, ms: new Date(t.dueDate + 'T00:00:00').getTime() }))
    .sort((a, b) => a.ms - b.ms);

  const dots = [];
  for (const t of sorted) {
    const x = xFor(t.ms);
    const close = dots.filter(d => Math.abs(d.x - x) < 20);
    dots.push({ ...t, x, y: close.length > 0 ? STAG_Y : DOT_Y });
  }

  // Month axis ticks
  const ticks = [];
  const cur = new Date(start);
  cur.setDate(1);
  cur.setHours(0, 0, 0, 0);
  if (cur.getTime() < start) cur.setMonth(cur.getMonth() + 1);
  while (cur.getTime() <= end) {
    const x = xFor(cur.getTime());
    if (x >= L - 2 && x <= W - R + 2) {
      ticks.push({
        x,
        label: cur.toLocaleDateString('en-AU', { month: 'short' }).toUpperCase(),
      });
    }
    cur.setMonth(cur.getMonth() + 1);
  }

  return (
    <div className="obligation-timeline">
      <div className="timeline-header">
        <span className="timeline-label">Obligations Timeline</span>
        <span className="timeline-legend">
          <span className="tl-dot tl-dot--overdue" />Overdue
          <span className="tl-dot tl-dot--soon" />Due Soon
          <span className="tl-dot tl-dot--upcoming" />Upcoming
          <span className="tl-dot tl-dot--completed" />Completed
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: 'block', overflow: 'visible' }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="timelineAxis" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#b9a182" stopOpacity="0.34" />
            <stop offset="48%" stopColor="#b14b12" stopOpacity="0.82" />
            <stop offset="100%" stopColor="#496daf" stopOpacity="0.48" />
          </linearGradient>
          <filter id="dotLift" x="-80%" y="-80%" width="260%" height="260%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#3c2b1d" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Axis baseline */}
        <line x1={L} y1={AXIS_Y} x2={W - R} y2={AXIS_Y} stroke="url(#timelineAxis)" strokeWidth="2.5" strokeLinecap="round" />

        {/* Month tick marks */}
        {ticks.map((tk, i) => (
          <g key={i}>
            <line x1={tk.x} y1={AXIS_Y - 3} x2={tk.x} y2={AXIS_Y + 6} stroke="#b9a182" strokeWidth="1" />
            <text
              x={tk.x} y={AXIS_Y + 15}
              textAnchor="middle" fontSize="8"
              fill="#6b5846" fontWeight="800" letterSpacing="0.07em"
              fontFamily="DM Sans, system-ui, sans-serif"
            >
              {tk.label}
            </text>
          </g>
        ))}

        {/* TODAY pill */}
        <line x1={todayX} y1={10} x2={todayX} y2={AXIS_Y} stroke="#b14b12" strokeWidth="1.7" strokeDasharray="3,3" />
        <rect x={todayX - 17} y="1" width="34" height="14" rx="7" fill="#271b14" />
        <text
          x={todayX} y="10.5"
          textAnchor="middle" fontSize="6.5"
          fill="#fff8ee" fontWeight="800" letterSpacing="0.07em"
          fontFamily="DM Sans, system-ui, sans-serif"
          dominantBaseline="middle"
        >
          TODAY
        </text>

        {/* Stems (behind dots) */}
        {dots.map(d => (
          <line
            key={`stem-${d.id}`}
            x1={d.x} y1={d.y + 7}
            x2={d.x} y2={AXIS_Y}
            stroke={STATUS_STROKE[d.status] || '#aaa'}
            strokeWidth="1"
            strokeDasharray={d.status === 'completed' ? '1,4' : '2,3'}
            opacity={d.status === 'completed' ? '0.35' : '0.58'}
          />
        ))}

        {/* Task dots — clickable */}
        {dots.map(d => (
          <g
            key={`dot-${d.id}`}
            style={{ cursor: onOpenTask ? 'pointer' : 'default' }}
            onClick={() => onOpenTask?.(d)}
            role={onOpenTask ? 'button' : undefined}
            aria-label={onOpenTask ? d.name : undefined}
          >
            <circle
              cx={d.x} cy={d.y} r="7.5"
              fill={STATUS_FILL[d.status] || '#f0f0f0'}
              stroke={STATUS_GLOW[d.status] || '#ddd'}
              strokeWidth="5"
              opacity="0.32"
            />
            <circle
              cx={d.x} cy={d.y} r="7.5"
              fill={STATUS_FILL[d.status] || '#f0f0f0'}
              stroke={STATUS_STROKE[d.status] || '#aaa'}
              strokeWidth="1.75"
              filter="url(#dotLift)"
            />
            {d.status === 'completed' && (
              <path
                d={`M ${d.x - 3.5} ${d.y} L ${d.x - 0.8} ${d.y + 3} L ${d.x + 4} ${d.y - 3.5}`}
                fill="none"
              stroke="#237045"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            <title>{d.name}</title>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default ObligationTimeline;
