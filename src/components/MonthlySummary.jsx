import React, { useState } from 'react';
import { formatDate } from '../utils/dates';
import { CheckIcon, AlertIcon, ClockIcon, ArrowLeftIcon, ArrowRightIcon, DownloadIcon } from './Icons';

function ComplianceBreakdown({ completedCount, overdue, dueSoon, upcoming, activeStatus, onSelectStatus }) {
  const total = completedCount + overdue.length + dueSoon.length + upcoming.length;
  if (total === 0) return null;

  const items = [
    { key: 'completed', label: 'Completed', count: completedCount },
    { key: 'overdue', label: 'Overdue', count: overdue.length },
    { key: 'due-soon', label: 'Due soon', count: dueSoon.length },
    { key: 'upcoming', label: 'Upcoming', count: upcoming.length },
  ].filter(i => i.count > 0);
  const highest = [...items].sort((a, b) => b.count - a.count)[0];
  const activeItem = items.find((item) => item.key === activeStatus);
  const selectedLabel = activeItem ? activeItem.label : 'All statuses';

  return (
    <div className="compliance-breakdown">
      <div className="breakdown-head">
        <div>
          <p className="breakdown-title">Status Breakdown</p>
          <p className="breakdown-insight">
            {highest.label} is the largest segment at {Math.round((highest.count / total) * 100)}%.
          </p>
        </div>
        <button
          type="button"
          className={`breakdown-reset${activeStatus === 'all' ? ' breakdown-reset--active' : ''}`}
          onClick={() => onSelectStatus('all')}
        >
          {selectedLabel}
        </button>
      </div>
      {items.map(item => {
        const pct = Math.round((item.count / total) * 100);
        const isActive = activeStatus === item.key;
        const isDimmed = activeStatus !== 'all' && !isActive;
        return (
          <button
            type="button"
            key={item.label}
            className={`breakdown-row${isActive ? ' breakdown-row--active' : ''}${isDimmed ? ' breakdown-row--dimmed' : ''}`}
            onClick={() => onSelectStatus(isActive ? 'all' : item.key)}
            aria-pressed={isActive}
          >
            <span className="breakdown-label">{item.label}</span>
            <div className={`breakdown-track breakdown-track--${item.key}`}>
              <div
                className={`breakdown-fill breakdown-fill--${item.key}`}
                style={{ '--bar-pct': pct / 100 }}
              />
            </div>
            <span className={`breakdown-count breakdown-count--${item.key}`}>
              {item.count}
              <span className="breakdown-pct"> {pct}%</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function MonthlySummary({
  onBack,
  completedCount = 0,
  tasks = [],
  completedTasks = [],
  profile = {},
  onExportSuccess,
  onExportError,
  onOpenTask,
}) {
  const monthLabel = new Date().toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });
  const overdue  = tasks.filter((t) => t.status === 'overdue');
  const dueSoon  = tasks.filter((t) => t.status === 'due-soon');
  const upcoming = tasks.filter((t) => t.status === 'upcoming');
  const total = completedCount + tasks.length;
  const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const [activeStatus, setActiveStatus] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const showCompleted = activeStatus === 'all' || activeStatus === 'completed';
  const showOverdue = activeStatus === 'all' || activeStatus === 'overdue';
  const showDueSoon = activeStatus === 'all' || activeStatus === 'due-soon';
  const showUpcoming = activeStatus === 'all' || activeStatus === 'upcoming';

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await new Promise((resolve) => window.requestAnimationFrame(resolve));
      const { generateCompliancePdf } = await import('../utils/pdfReport.js');
      await generateCompliancePdf({
        tasks,
        completedTasks,
        completedCount,
        profile,
      });
      onExportSuccess?.();
    } catch (error) {
      console.error('Could not generate PDF report.', error);
      onExportError?.();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="screen fade-in">
      <div className="summary-card">
        <div className="summary-top-row">
          <button type="button" className="btn btn-secondary back-btn" onClick={onBack}>
            <ArrowLeftIcon size={16} /> Back
          </button>
          <button
            type="button"
            className="btn-export"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting
              ? <><span className="btn-spinner btn-spinner--ink" aria-hidden="true" /> Preparing PDF</>
              : <><DownloadIcon size={14} /> Download PDF</>}
          </button>
        </div>

        <h2>Compliance Plan Summary</h2>
        <p className="summary-period">Updated {monthLabel}</p>

        <div className="stats-row">
          <button
            type="button"
            className={`stat-card complete${activeStatus === 'completed' ? ' stat-card--active' : ''}`}
            onClick={() => setActiveStatus(activeStatus === 'completed' ? 'all' : 'completed')}
            aria-pressed={activeStatus === 'completed'}
          >
            <strong>{completedCount}</strong>
            <span>Completed</span>
          </button>
          <button
            type="button"
            className={`stat-card overdue${activeStatus === 'overdue' ? ' stat-card--active' : ''}`}
            onClick={() => setActiveStatus(activeStatus === 'overdue' ? 'all' : 'overdue')}
            aria-pressed={activeStatus === 'overdue'}
          >
            <strong>{overdue.length}</strong>
            <span>Overdue</span>
          </button>
          <button
            type="button"
            className={`stat-card pending${activeStatus === 'upcoming' ? ' stat-card--active' : ''}`}
            onClick={() => setActiveStatus(activeStatus === 'upcoming' ? 'all' : 'upcoming')}
            aria-pressed={activeStatus === 'upcoming'}
          >
            <strong>{upcoming.length}</strong>
            <span>Upcoming</span>
          </button>
        </div>

        {total > 0 && (
          <div className="completion-rate">
            <div className="completion-rate-row">
              <span className="completion-rate-label">Completion rate</span>
              <span className="completion-rate-pct">{completionRate}%</span>
            </div>
            <div className="completion-bar-track">
              <div
                className="completion-bar-fill"
                style={{ '--completion-pct': completionRate / 100 }}
                role="progressbar"
                aria-valuenow={completionRate}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        )}

        <ComplianceBreakdown
          completedCount={completedCount}
          overdue={overdue}
          dueSoon={dueSoon}
          upcoming={upcoming}
          activeStatus={activeStatus}
          onSelectStatus={setActiveStatus}
        />

        <div className="summary-list">
          {showCompleted && completedTasks.length > 0 && (
            <div className="summary-group">
              <h4 className="summary-group-label label-complete">
                <CheckIcon size={11} strokeWidth={3} /> Completed
              </h4>
              {completedTasks.map((t) => (
                <button
                  type="button"
                  key={t.id + t.completedAt}
                  className="summary-task-row"
                  onClick={() => onOpenTask?.(t)}
                >
                  <span className="summary-task-name">{t.name}</span>
                  <span className="summary-task-date">{t.completedAt}</span>
                  <ArrowRightIcon size={14} />
                </button>
              ))}
            </div>
          )}

          {showCompleted && completedTasks.length === 0 && completedCount === 0 && (
            <div className="summary-group">
              <h4 className="summary-group-label label-complete">
                <CheckIcon size={11} strokeWidth={3} /> Completed
              </h4>
              <p className="summary-meta">No completed tasks yet this month.</p>
            </div>
          )}

          {showOverdue && overdue.length > 0 && (
            <div className="summary-group">
              <h4 className="summary-group-label label-overdue">
                <AlertIcon size={11} /> Overdue
              </h4>
              {overdue.map((t) => (
                <button type="button" key={t.id} className="summary-task-row" onClick={() => onOpenTask?.(t)}>
                  <span className="summary-task-name">{t.name}</span>
                  <span className="summary-task-date">Due {formatDate(t.dueDate)}</span>
                  <ArrowRightIcon size={14} />
                </button>
              ))}
            </div>
          )}

          {showDueSoon && dueSoon.length > 0 && (
            <div className="summary-group">
              <h4 className="summary-group-label label-due-soon">
                <ClockIcon size={11} /> Due Soon
              </h4>
              {dueSoon.map((t) => (
                <button type="button" key={t.id} className="summary-task-row" onClick={() => onOpenTask?.(t)}>
                  <span className="summary-task-name">{t.name}</span>
                  <span className="summary-task-date">Due {formatDate(t.dueDate)}</span>
                  <ArrowRightIcon size={14} />
                </button>
              ))}
            </div>
          )}

          {showUpcoming && upcoming.length > 0 && (
            <div className="summary-group">
              <h4 className="summary-group-label label-upcoming">
                <ClockIcon size={11} /> Upcoming
              </h4>
              {upcoming.map((t) => (
                <button type="button" key={t.id} className="summary-task-row" onClick={() => onOpenTask?.(t)}>
                  <span className="summary-task-name">{t.name}</span>
                  <span className="summary-task-date">Due {formatDate(t.dueDate)}</span>
                  <ArrowRightIcon size={14} />
                </button>
              ))}
            </div>
          )}

          {tasks.length === 0 && completedCount === 0 && (
            <p className="empty">No tasks recorded for this month.</p>
          )}
          {activeStatus !== 'all' && (
            <button type="button" className="summary-clear-filter" onClick={() => setActiveStatus('all')}>
              Show all statuses
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default MonthlySummary;
