import React, { useEffect, useState } from 'react';
import { CheckIcon, ArrowRightIcon } from './Icons';

function WelcomeScreen({ profile, taskCount, onContinue }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const firstName = profile.fullName?.split(' ')[0] || 'there';

  return (
    <section className="screen welcome-screen fade-in">
      <div className={`welcome-card${visible ? ' welcome-card--in' : ''}`}>
        <div className="welcome-confetti" aria-hidden="true">
          {[...Array(12)].map((_, i) => (
            <span key={i} className={`confetti-dot confetti-dot--${i % 4}`} />
          ))}
        </div>

        <div className="welcome-check" aria-hidden="true">
          <CheckIcon size={28} strokeWidth={2.5} />
        </div>

        <h2 className="welcome-heading">You're all set, {firstName}!</h2>
        <p className="welcome-sub">Your compliance calendar has been built.</p>

        <div className="welcome-details">
          {profile.businessName && (
            <div className="welcome-detail-row">
              <span className="welcome-detail-label">Business</span>
              <span className="welcome-detail-value">{profile.businessName}</span>
            </div>
          )}
          {profile.type && (
            <div className="welcome-detail-row">
              <span className="welcome-detail-label">Type</span>
              <span className="welcome-detail-value">{profile.type}</span>
            </div>
          )}
          <div className="welcome-detail-row">
            <span className="welcome-detail-label">Obligations loaded</span>
            <span className="welcome-detail-value welcome-task-count">{taskCount}</span>
          </div>
        </div>

        <button type="button" className="btn btn-primary welcome-cta" onClick={onContinue}>
          View My Calendar <ArrowRightIcon size={16} />
        </button>
      </div>
    </section>
  );
}

export default WelcomeScreen;
