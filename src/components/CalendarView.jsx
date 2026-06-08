import React, { useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon } from './Icons';

const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const STATUS_COLOR = {
  overdue:   '#b02020',
  'due-soon': '#bf7a10',
  upcoming:   '#3a68cc',
  completed:  '#2a8050',
};

const STATUS_BG = {
  overdue:   'rgba(176,32,32,0.08)',
  'due-soon': 'rgba(191,122,16,0.09)',
  upcoming:   'rgba(58,104,204,0.08)',
  completed:  'rgba(42,128,80,0.10)',
};

function CalendarView({ tasks, onBack, onOpenTask }) {
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const todayMs = todayDate.getTime();

  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  function prevMonth() {
    setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }
  function nextMonth() {
    setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }
  function goToday() {
    setViewDate(new Date(todayDate.getFullYear(), todayDate.getMonth(), 1));
  }

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay    = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Monday-based offset: JS 0=Sun → Mon-based: (getDay()+6)%7
  const startOffset = (firstDay.getDay() + 6) % 7;

  // Build task map keyed by ISO date
  const taskMap = {};
  for (const t of tasks) {
    if (!taskMap[t.dueDate]) taskMap[t.dueDate] = [];
    taskMap[t.dueDate].push(t);
  }

  // Calendar cells
  const cells = [];
  for (let i = 0; i < startOffset; i++) {
    cells.push({ type: 'empty', key: `e-${i}` });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const mo = String(month + 1).padStart(2, '0');
    const dy = String(d).padStart(2, '0');
    const dateStr = `${year}-${mo}-${dy}`;
    const cellMs  = new Date(year, month, d).getTime();
    cells.push({
      type: 'day',
      key: dateStr,
      day: d,
      dateStr,
      isToday: cellMs === todayMs,
      isPast:  cellMs < todayMs,
      tasks: taskMap[dateStr] || [],
    });
  }

  const monthLabel = viewDate.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });
  const isCurrentMonthView =
    todayDate.getFullYear() === year && todayDate.getMonth() === month;

  // Summary counts for this view month
  const allMonthTasks = tasks.filter(t => {
    const [ty, tm] = t.dueDate.split('-').map(Number);
    return ty === year && (tm - 1) === month;
  });
  const overdueCount  = allMonthTasks.filter(t => t.status === 'overdue').length;
  const dueSoonCount  = allMonthTasks.filter(t => t.status === 'due-soon').length;
  const upcomingCount = allMonthTasks.filter(t => t.status === 'upcoming').length;
  const completedCount = allMonthTasks.filter(t => t.status === 'completed').length;

  return (
    <section className="screen fade-in">
      <div className="calendar-wrap">
        <div className="cal-top-row">
          <button type="button" className="btn btn-secondary back-btn" onClick={onBack}>
            <ArrowLeftIcon size={16} /> Back
          </button>
          <h2 className="cal-heading">
            <CalendarIcon size={18} />
            Compliance Calendar
          </h2>
        </div>

        {/* Month strip summary */}
        {allMonthTasks.length > 0 && (
          <div className="cal-month-summary">
            {overdueCount > 0 && (
              <span className="cal-summary-pill cal-summary-pill--overdue">
                {overdueCount} overdue
              </span>
            )}
            {dueSoonCount > 0 && (
              <span className="cal-summary-pill cal-summary-pill--soon">
                {dueSoonCount} due soon
              </span>
            )}
            {upcomingCount > 0 && (
              <span className="cal-summary-pill cal-summary-pill--upcoming">
                {upcomingCount} upcoming
              </span>
            )}
            {completedCount > 0 && (
              <span className="cal-summary-pill cal-summary-pill--completed">
                {completedCount} completed
              </span>
            )}
          </div>
        )}
        {allMonthTasks.length === 0 && (
          <div className="cal-month-summary">
            <span className="cal-summary-empty">No obligations this month</span>
          </div>
        )}

        {/* Navigation */}
        <div className="cal-nav">
          <button type="button" className="cal-nav-btn" onClick={prevMonth} aria-label="Previous month">
            <ArrowLeftIcon size={15} />
          </button>
          <div className="cal-nav-center">
            <span className="cal-month-label">{monthLabel}</span>
            {!isCurrentMonthView && (
              <button type="button" className="cal-today-btn" onClick={goToday}>
                Today
              </button>
            )}
          </div>
          <button type="button" className="cal-nav-btn" onClick={nextMonth} aria-label="Next month">
            <ArrowRightIcon size={15} />
          </button>
        </div>

        {/* Grid */}
        <div className="cal-grid-wrap">
          <div className="cal-grid">
            {/* Day-of-week headers */}
            {DOW.map(d => (
              <div key={d} className="cal-dow">{d}</div>
            ))}

            {/* Cells */}
            {cells.map(cell => {
              if (cell.type === 'empty') {
                return <div key={cell.key} className="cal-cell cal-cell--empty" />;
              }
              return (
                <div
                  key={cell.key}
                  className={[
                    'cal-cell',
                    cell.isToday  ? 'cal-cell--today'     : '',
                    cell.isPast   ? 'cal-cell--past'      : '',
                    cell.tasks.length > 0 ? 'cal-cell--has-tasks' : '',
                  ].filter(Boolean).join(' ')}
                >
                  <span className="cal-day-num">{cell.day}</span>
                  {cell.tasks.length > 0 && (
                    <div className="cal-task-pills">
                      {cell.tasks.map(task => (
                        <button
                          key={task.id}
                          type="button"
                          className="cal-task-pill"
                          data-status={task.status}
                          style={{
                            background: STATUS_BG[task.status] || 'rgba(0,0,0,0.05)',
                            color: STATUS_COLOR[task.status] || '#555',
                          }}
                          onClick={() => onOpenTask(task)}
                          title={task.name}
                        >
                          <span
                            className="cal-task-dot"
                            style={{ background: STATUS_COLOR[task.status] || '#888' }}
                          />
                          <span className="cal-task-name">{task.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="cal-legend">
          <span className="cal-legend-item">
            <span className="cal-legend-dot" style={{ background: '#b02020' }} />
            Overdue
          </span>
          <span className="cal-legend-item">
            <span className="cal-legend-dot" style={{ background: '#bf7a10' }} />
            Due Soon
          </span>
          <span className="cal-legend-item">
            <span className="cal-legend-dot" style={{ background: '#3a68cc' }} />
            Upcoming
          </span>
          <span className="cal-legend-item">
            <span className="cal-legend-dot" style={{ background: '#2a8050' }} />
            Completed
          </span>
        </div>
      </div>
    </section>
  );
}

export default CalendarView;
