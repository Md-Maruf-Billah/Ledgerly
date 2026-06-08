import React, { useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from './Icons';

const states = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];

function BusinessProfileForm({ initialData, onContinue, onBack }) {
  const [form, setForm] = useState({
    fullName: initialData.fullName || '',
    businessName: initialData.businessName || '',
    email: initialData.email || '',
    state: initialData.state || '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.fullName.trim()) nextErrors.fullName = 'Full name is required.';
    if (!form.businessName.trim()) nextErrors.businessName = 'Business name is required.';
    if (!form.email.trim()) nextErrors.email = 'Email address is required.';
    if (!form.state) nextErrors.state = 'Please select your state.';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onContinue(form);
  };

  return (
    <section className="screen fade-in">
      <div className="form-card">
        <div className="step-row">
          <button className="back-link" onClick={onBack} type="button">
            <ArrowLeftIcon size={14} /> Back
          </button>
          <span>Step 1 of 2</span>
          <div className="progress-track"><div className="progress-fill step-one"></div></div>
        </div>

        <h2>Tell us about your business</h2>

        <form onSubmit={handleSubmit} className="form-grid" noValidate>
          <label>
            Full name
            <input value={form.fullName} onChange={(e) => handleChange('fullName', e.target.value)} placeholder="e.g. Jordan Miller" />
            {errors.fullName && <small className="error-text">{errors.fullName}</small>}
          </label>

          <label>
            Business name
            <input value={form.businessName} onChange={(e) => handleChange('businessName', e.target.value)} placeholder="e.g. Miller Garden Services" />
            {errors.businessName && <small className="error-text">{errors.businessName}</small>}
          </label>

          <label>
            Email address
            <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="e.g. jordan@example.com" />
            {errors.email && <small className="error-text">{errors.email}</small>}
          </label>

          <label>
            State
            <select value={form.state} onChange={(e) => handleChange('state', e.target.value)}>
              <option value="">Select your state</option>
              {states.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.state && <small className="error-text">{errors.state}</small>}
          </label>

          <button type="submit" className="btn btn-primary">
            Continue <ArrowRightIcon size={16} />
          </button>
        </form>
      </div>
    </section>
  );
}

export default BusinessProfileForm;
