import React, { useState } from 'react';
import { CheckIcon, ArrowLeftIcon, ArrowRightIcon } from './Icons';

const FREE_FEATURES = [
  'Compliance calendar for one business',
  'Up to 10 obligations tracked',
  'Step-by-step task checklists',
  'Monthly summary view',
  'Custom task creation',
];

const PRO_FEATURES = [
  'Everything in Free',
  'Unlimited obligations',
  'Email deadline reminders',
  'PDF export of monthly summary',
  'Multi-entity support (up to 3)',
  'Priority support',
  'Early access to new features',
];

const ROADMAP = [
  { label: 'BAS and IAS pre-fill', eta: 'Planned', detail: 'Draft figures would be staged for review before anything is lodged.' },
  { label: 'Accountant sharing mode', eta: 'Planned', detail: 'Invite a trusted adviser to review records without sharing your login.' },
  { label: 'Xero and MYOB integration', eta: 'Research', detail: 'Secure read-only connections are being evaluated for reliable reconciliation.' },
  { label: 'Mobile companion app', eta: 'Exploring', detail: 'The responsive web app comes first, with native reminders under exploration.' },
];

function PricingPlans({ onBack, onToast }) {
  const [showUpgradePreview, setShowUpgradePreview] = useState(false);
  const [openRoadmapItem, setOpenRoadmapItem] = useState(null);

  return (
    <section className="screen fade-in">
      <div className="pricing-wrap">
        <button type="button" className="btn btn-secondary back-btn" onClick={onBack}>
          <ArrowLeftIcon size={16} /> Back to Dashboard
        </button>

        <h2 className="pricing-heading">Simple, transparent pricing</h2>
        <p className="pricing-sub">Start with the essentials. Upgrade only when your calendar needs more room.</p>

        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="pricing-plan-name">Free</div>
            <div className="pricing-price">
              <span className="pricing-amount">$0</span>
              <span className="pricing-period">/ month</span>
            </div>
            <p className="pricing-desc">Everything you need to get started.</p>
            <ul className="pricing-features">
              {FREE_FEATURES.map(f => (
                <li key={f}>
                  <span className="feature-check" aria-hidden="true"><CheckIcon size={14} strokeWidth={2.5} /></span>
                  {f}
                </li>
              ))}
            </ul>
            <button type="button" className="btn btn-secondary pricing-cta" disabled aria-disabled="true">
              Current Plan
            </button>
          </div>

          <div className="pricing-card pricing-card--pro">
            <div className="pricing-badge">Most Popular</div>
            <div className="pricing-plan-name">Pro</div>
            <div className="pricing-price">
              <span className="pricing-amount">$12</span>
              <span className="pricing-period">/ month</span>
            </div>
            <p className="pricing-desc">For owners who want more reminders, records, and room to grow.</p>
            <ul className="pricing-features">
              {PRO_FEATURES.map(f => (
                <li key={f}>
                  <span className="feature-check" aria-hidden="true"><CheckIcon size={14} strokeWidth={2.5} /></span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="btn btn-primary pricing-cta"
              onClick={() => {
                setShowUpgradePreview(true);
                onToast?.('Pro plan preview opened', 'success');
              }}
              aria-expanded={showUpgradePreview}
            >
              Upgrade to Pro <ArrowRightIcon size={15} />
            </button>
          </div>
        </div>

        {showUpgradePreview && (
          <div className="upgrade-preview fade-in" role="status">
            <div>
              <span className="eyebrow">Pro preview</span>
              <h3>More room, same calm workflow</h3>
              <p>Billing is intentionally disabled in this project demo. The full upgrade flow would continue to a secure checkout.</p>
            </div>
            <button type="button" className="btn btn-secondary" onClick={() => setShowUpgradePreview(false)}>
              Close preview
            </button>
          </div>
        )}

        <div className="roadmap-section">
          <h3 className="roadmap-heading">Coming soon</h3>
          <div className="roadmap-list">
            {ROADMAP.map((item, index) => {
              const isOpen = openRoadmapItem === index;
              return (
                <button
                  type="button"
                  key={item.label}
                  className={`roadmap-row${isOpen ? ' roadmap-row--open' : ''}`}
                  onClick={() => setOpenRoadmapItem(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span>
                    <span className="roadmap-label">{item.label}</span>
                    {isOpen && <span className="roadmap-detail">{item.detail}</span>}
                  </span>
                  <span className="roadmap-eta">{item.eta}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PricingPlans;
