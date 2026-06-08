import React, { useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon, ClockIcon, InfoIcon, CheckIcon } from './Icons';

const slides = [
  {
    label: 'Calendar',
    title: 'See every obligation in one place',
    body: 'Ledgerly turns BAS, super, PAYG, and renewals into a clear monthly view.',
    Icon: CalendarIcon,
    stat: '12',
    statLabel: 'obligations mapped',
  },
  {
    label: 'Timeline',
    title: 'Know what needs attention first',
    body: 'Overdue, due soon, upcoming, and completed tasks stay visible with their own status language.',
    Icon: ClockIcon,
    stat: '14d',
    statLabel: 'due-soon window',
  },
  {
    label: 'Help',
    title: 'Open a task for the exact next step',
    body: 'Use each task card to review the checklist, mark progress, and keep a completion record.',
    Icon: InfoIcon,
    stat: '3',
    statLabel: 'guided steps',
  },
];

function OnboardingTour({ onContinue, onBack }) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const isLast = index === slides.length - 1;
  const Icon = slide.Icon;

  const goNext = () => {
    if (isLast) onContinue();
    else setIndex((current) => current + 1);
  };

  return (
    <section className="screen tour-screen fade-in">
      <div className="tour-shell">
        <div className="tour-copy">
          <p className="brand-mini">Ledgerly quick start</p>
          <h2>Three things worth knowing before your calendar opens.</h2>
          <p className="subtitle">No setup maze. Just the parts that help you stay in control.</p>
        </div>

        <div className="tour-card" data-slide={index}>
          <div className="tour-orbit" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="tour-card-top">
            <span className="tour-kicker">{slide.label}</span>
            <span className="tour-count">{index + 1} / {slides.length}</span>
          </div>

          <div key={`visual-${index}`} className="tour-visual" aria-hidden="true">
            <div className="tour-visual-icon">
              <Icon size={30} strokeWidth={1.9} />
            </div>
            <div className="tour-ledger-preview">
              <span className="tour-ledger-line tour-ledger-line--strong" />
              <span className="tour-ledger-line" />
              <span className="tour-ledger-line" />
            </div>
            <div className="tour-stat">
              <strong>{slide.stat}</strong>
              <span>{slide.statLabel}</span>
            </div>
          </div>

          <div key={`text-${index}`} className="tour-slide-text">
            <h3>{slide.title}</h3>
            <p>{slide.body}</p>
          </div>

          <div className="tour-progress" aria-hidden="true">
            {slides.map((item, i) => (
              <button
                key={item.label}
                type="button"
                className={`tour-dot${i === index ? ' tour-dot--active' : ''}`}
                onClick={() => setIndex(i)}
                aria-label={`Show ${item.label} slide`}
              />
            ))}
          </div>

          <div className="tour-actions">
            <button type="button" className="btn btn-secondary" onClick={index === 0 ? onBack : () => setIndex(index - 1)}>
              <ArrowLeftIcon size={15} /> {index === 0 ? 'Back' : 'Previous'}
            </button>
            <button type="button" className="btn btn-primary" onClick={goNext}>
              {isLast ? <><CheckIcon size={16} /> Start setup</> : <>Next <ArrowRightIcon size={15} /></>}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OnboardingTour;
