import React from 'react';
import { CheckIcon, ArrowRightIcon } from './Icons';

function ConfirmationScreen({ completedCount, onBackToTimeline, onViewSummary }) {
  return (
    <section className="screen fade-in">
      <div className="confirm-card">
        <div className="checkmark" aria-hidden="true">
          <CheckIcon size={32} strokeWidth={2.5} />
        </div>
        <h2>Task Completed</h2>
        <p className="subtitle">Your timeline is up to date.</p>
        <p className="confirm-stat">
          <strong>{completedCount}</strong> task{completedCount !== 1 ? 's' : ''} completed this month
        </p>
        <div className="action-stack">
          <button type="button" className="btn btn-primary" onClick={onBackToTimeline}>Back to Timeline</button>
          <button type="button" className="btn btn-secondary" onClick={onViewSummary}>
            View Monthly Summary <ArrowRightIcon size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default ConfirmationScreen;
