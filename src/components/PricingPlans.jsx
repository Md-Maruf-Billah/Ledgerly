import React from 'react';
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
  { label: 'BAS and IAS pre-fill', eta: 'Planned' },
  { label: 'Accountant sharing mode', eta: 'Planned' },
  { label: 'Xero and MYOB integration', eta: 'Research' },
  { label: 'Mobile companion app', eta: 'Exploring' },
];

function PricingPlans({ onBack }) {
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
            <button type="button" className="btn btn-primary pricing-cta">
              Upgrade to Pro <ArrowRightIcon size={15} />
            </button>
          </div>
        </div>

        <div className="roadmap-section">
          <h3 className="roadmap-heading">Coming soon</h3>
          <div className="roadmap-list">
            {ROADMAP.map(item => (
              <div key={item.label} className="roadmap-row">
                <span className="roadmap-label">{item.label}</span>
                <span className="roadmap-eta">{item.eta}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PricingPlans;
