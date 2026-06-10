import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
} from './Icons';
import { formatDate } from '../utils/dates';
import { getStatusMeta, STATUS_ORDER } from '../data/status';

const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function CalendarView({ tasks, onBack, onOpenTask }) {
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeStatus, setActiveStatus] = useState('all');

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthLabel = viewDate.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const monthTasks = useMemo(
    () => tasks
      .filter((task) => {
        const date = new Date(`${task.dueDate}T00:00:00`);
        return date.getFullYear() === year && date.getMonth() === month;
      })
      .sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate))),
    [tasks, year, month]
  );
  const visibleMonthTasks = useMemo(
    () => activeStatus === 'all'
      ? monthTasks
      : monthTasks.filter((task) => task.status === activeStatus),
    [monthTasks, activeStatus]
  );
  const yearMonths = useMemo(
    () => Array.from({ length: 12 }, (_, index) => {
      const count = tasks.filter((task) => {
        const date = new Date(`${task.dueDate}T00:00:00`);
        return date.getFullYear() === year && date.getMonth() === index;
      }).length;
      return {
        index,
        count,
        label: new Date(year, index, 1).toLocaleDateString('en-AU', { month: 'short' }),
      };
    }),
    [tasks, year]
  );

  useEffect(() => {
    setSelectedTask((current) => {
      if (current && visibleMonthTasks.some((task) => task.id === current.id)) return current;
      return visibleMonthTasks[0] || null;
    });
  }, [visibleMonthTasks]);

  const taskMap = useMemo(() => {
    const map = {};
    visibleMonthTasks.forEach((task) => {
      if (!map[task.dueDate]) map[task.dueDate] = [];
      map[task.dueDate].push(task);
    });
    return map;
  }, [visibleMonthTasks]);

  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startOffset = (firstDay.getDay() + 6) % 7;
    const result = Array.from({ length: startOffset }, (_, index) => ({
      type: 'empty',
      key: `empty-${index}`,
    }));

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      result.push({
        type: 'day',
        key: dateStr,
        day,
        dateStr,
        isToday: date.getTime() === today.getTime(),
        tasks: taskMap[dateStr] || [],
      });
    }
    return result;
  }, [year, month, taskMap, today]);

  const counts = Object.fromEntries(
    STATUS_ORDER.map((status) => [
      status,
      monthTasks.filter((task) => task.status === status).length,
    ])
  );

  const changeMonth = (offset) => {
    setActiveStatus('all');
    setViewDate((date) => new Date(date.getFullYear(), date.getMonth() + offset, 1));
  };
  const selectMonth = (monthIndex) => {
    setActiveStatus('all');
    setViewDate(new Date(year, monthIndex, 1));
  };

  return (
    <section className="screen calendar-screen fade-in">
      <header className="page-header calendar-page-header">
        <div>
          <button type="button" className="back-link page-back-link" onClick={onBack}>
            <ArrowLeftIcon size={15} /> Overview
          </button>
          <p className="eyebrow">Planner canvas</p>
          <h1>Compliance calendar</h1>
          <p className="page-intro">See the shape of the month, then focus on one obligation at a time.</p>
        </div>
      </header>

      <div className="calendar-toolbar">
        <div className="calendar-navigation">
          <button type="button" className="icon-btn" onClick={() => changeMonth(-1)} aria-label="Previous month">
            <ArrowLeftIcon size={18} />
          </button>
          <div>
            <span className="calendar-month-label">{monthLabel}</span>
            <span className="calendar-month-meta mono">{monthTasks.length} obligations</span>
          </div>
          <button type="button" className="icon-btn" onClick={() => changeMonth(1)} aria-label="Next month">
            <ArrowRightIcon size={18} />
          </button>
        </div>
        {!isCurrentMonth && (
          <button
            type="button"
            className="btn btn-secondary btn-compact"
            onClick={() => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))}
          >
            Today
          </button>
        )}
        <div className="calendar-status-summary" aria-label="Month status counts">
          {STATUS_ORDER.map((status) => {
            if (!counts[status]) return null;
            return (
              <button
                type="button"
                key={status}
                className={`calendar-summary-item calendar-summary-item--${status}${activeStatus === status ? ' calendar-summary-item--active' : ''}`}
                onClick={() => setActiveStatus(activeStatus === status ? 'all' : status)}
                aria-pressed={activeStatus === status}
              >
                <span className="status-dot" aria-hidden="true" />
                <span>{getStatusMeta(status).label}</span>
                <strong className="mono">{counts[status]}</strong>
              </button>
            );
          })}
        </div>
      </div>

      <div className="calendar-year-rail" aria-label={`${year} month overview`}>
        <span className="calendar-year-label mono">{year}</span>
        <div className="calendar-year-months">
          {yearMonths.map((item) => (
            <button
              type="button"
              key={item.index}
              className={`calendar-year-month${month === item.index ? ' calendar-year-month--active' : ''}`}
              onClick={() => selectMonth(item.index)}
              aria-current={month === item.index ? 'date' : undefined}
              aria-label={`${item.label} ${year}, ${item.count} obligations`}
            >
              <span>{item.label}</span>
              <strong className="mono">{item.count || '·'}</strong>
            </button>
          ))}
        </div>
      </div>

      <div className="planner-layout">
        <div className="calendar-canvas">
          <div className="calendar-grid" role="grid" aria-label={`${monthLabel} calendar`}>
            {DOW.map((day) => (
              <div key={day} className="calendar-dow" role="columnheader">{day}</div>
            ))}
            {cells.map((cell) => {
              if (cell.type === 'empty') {
                return <div key={cell.key} className="calendar-cell calendar-cell--empty" role="gridcell" />;
              }
              return (
                <div
                  key={cell.key}
                  className={`calendar-cell${cell.isToday ? ' calendar-cell--today' : ''}${cell.tasks.length ? ' calendar-cell--active' : ''}`}
                  role="gridcell"
                >
                  <span className="calendar-day mono">{cell.day}</span>
                  <div className="calendar-cell-tasks">
                    {cell.tasks.map((task) => (
                      <button
                        key={task.id}
                        type="button"
                        className={`calendar-task calendar-task--${task.status}${selectedTask?.id === task.id ? ' calendar-task--selected' : ''}`}
                        onClick={() => setSelectedTask(task)}
                        aria-pressed={selectedTask?.id === task.id}
                        aria-label={`${task.name}, ${getStatusMeta(task.status).label}, due ${formatDate(task.dueDate)}`}
                      >
                        <span className="status-dot" aria-hidden="true" />
                        <span>{task.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="calendar-focus" aria-live="polite">
          {selectedTask ? (
            <div key={selectedTask.id} className="calendar-focus-content">
              <span className="calendar-focus-motif" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <div className="calendar-focus-heading">
                <div>
              <p className="eyebrow">Focus</p>
                  <span className={`status-badge status-badge--${selectedTask.status}`}>
                    <span className="status-dot" aria-hidden="true" />
                    {getStatusMeta(selectedTask.status).label}
                  </span>
                </div>
                <CalendarIcon size={22} />
              </div>
              <h2>{selectedTask.name}</h2>
              {selectedTask.isPlanning && <span className="planning-label">Planning checkpoint</span>}
              <p className="calendar-focus-description">{selectedTask.description || 'Open the checklist for guidance and a completion record.'}</p>
              <div className="calendar-focus-meta">
                <span><CalendarIcon size={15} /> Due {formatDate(selectedTask.dueDate)}</span>
                <span><ClockIcon size={15} /> {selectedTask.steps?.length || 0} guided steps</span>
                {selectedTask.status === 'completed' && selectedTask.completedAt && (
                  <span><CheckIcon size={15} /> Completed {selectedTask.completedAt}</span>
                )}
              </div>
              <button type="button" className="btn btn-primary btn-full" onClick={() => onOpenTask(selectedTask)}>
                {selectedTask.status === 'completed' ? 'View record' : 'Open checklist'}
                <ArrowRightIcon size={16} />
              </button>
            </div>
          ) : (
            <div className="calendar-focus-empty">
              <CalendarIcon size={28} />
              <h2>No obligations this month</h2>
              <p>Move to another month or add a task when a new date needs tracking.</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

export default CalendarView;
