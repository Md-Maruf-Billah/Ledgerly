import React, { useEffect } from 'react';

function LoadingScreen({ onComplete, ready = true }) {
  useEffect(() => {
    if (!ready) return undefined;
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete, ready]);

  return (
    <div
      className={`loading-screen${ready ? ' loading-screen--ready' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Building your compliance calendar"
    >
      <div className="loading-content fade-in">
        <img className="loading-logo" src="/logo-mark.svg" width="64" height="64" alt="" />
        <h1 className="loading-title">Ledgerly</h1>
        <p className="loading-message">
          {ready ? 'Calendar ready. Opening your timeline...' : 'Building your compliance calendar...'}
        </p>
        <div className="loading-skeleton" aria-hidden="true">
          <span className="loading-skeleton-line loading-skeleton-line--wide" />
          <span className="loading-skeleton-line" />
          <span className="loading-skeleton-row" />
          <span className="loading-skeleton-row" />
          <span className="loading-skeleton-row loading-skeleton-row--short" />
        </div>
        <div className="loading-bar-track" aria-hidden="true">
          <div className="loading-bar-fill" />
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
