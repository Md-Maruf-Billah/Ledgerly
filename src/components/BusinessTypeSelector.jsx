import React, { useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, UserIcon, ShoppingBagIcon, UtensilsIcon, WrenchIcon, BriefcaseIcon, UsersIcon } from './Icons';

const types = [
  { label: 'Sole Trader',  Icon: UserIcon,        description: 'Independent operator with simple reporting obligations.' },
  { label: 'Retail',       Icon: ShoppingBagIcon,  description: 'Storefront-focused business with payroll and GST activity.' },
  { label: 'Hospitality',  Icon: UtensilsIcon,     description: 'Food or service venue with rotating staff and payroll tasks.' },
  { label: 'Trades',       Icon: WrenchIcon,       description: 'Field-based trade business with contractors and GST cycles.' },
  { label: 'Consulting',   Icon: BriefcaseIcon,    description: 'Professional service business with periodic tax obligations.' },
  { label: 'Small Team',   Icon: UsersIcon,        description: 'Growing micro-business managing employee compliance.' },
];

function BusinessTypeSelector({ selectedType, onBuildCalendar, onBack }) {
  const [activeType, setActiveType] = useState(selectedType || '');

  return (
    <section className="screen fade-in">
      <div className="form-card">
        <div className="step-row">
          <button className="back-link" onClick={onBack} type="button">
            <ArrowLeftIcon size={14} /> Back
          </button>
          <span>Step 2 of 2</span>
          <div className="progress-track"><div className="progress-fill step-two" /></div>
        </div>

        <h2>What kind of business do you run?</h2>
        <p className="subtitle">We'll customise your compliance calendar based on your selection.</p>

        <div className="type-grid">
          {types.map(({ label, Icon, description }) => (
            <button
              type="button"
              key={label}
              className={`type-card${activeType === label ? ' selected' : ''}`}
              onClick={() => setActiveType(label)}
            >
              <span className="type-icon"><Icon size={22} /></span>
              <h3>{label}</h3>
              <p>{description}</p>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="btn btn-primary"
          disabled={!activeType}
          onClick={() => onBuildCalendar(activeType)}
        >
          Build My Calendar <ArrowRightIcon size={16} />
        </button>
      </div>
    </section>
  );
}

export default BusinessTypeSelector;
