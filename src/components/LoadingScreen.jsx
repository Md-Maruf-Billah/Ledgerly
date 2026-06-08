import React, { useEffect } from 'react';

function LoadingScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="loading-screen" role="status" aria-live="polite" aria-label="Building your compliance calendar">
      <div className="loading-content fade-in">
        <div className="loading-logo" aria-hidden="true">
          <div className="loading-logo-grid">
            <span></span><span></span><span></span><span></span>
          </div>
        </div>
        <h1 className="loading-title">Ledgerly</h1>
        <p className="loading-message">Building your compliance calendar&hellip;</p>
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
