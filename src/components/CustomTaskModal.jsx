import React, { useState, useEffect, useRef } from 'react';

const today = () => new Date().toISOString().split('T')[0];

const FOCUSABLE = 'button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

function CustomTaskModal({ onSave, onClose }) {
  const [form, setForm] = useState({ name: '', dueDate: today(), notes: '', priority: 'medium' });
  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => { nameRef.current?.focus(); }, []);

  useEffect(() => {
    const el = modalRef.current;
    if (!el) return;
    const trap = (e) => {
      if (e.key !== 'Tab') return;
      const nodes = [...el.querySelectorAll(FOCUSABLE)];
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', trap);
    return () => document.removeEventListener('keydown', trap);
  }, []);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Task name is required.';
    if (!form.dueDate) nextErrors.dueDate = 'Due date is required.';
    if (Object.keys(nextErrors).length > 0) { setErrors(nextErrors); return; }
    onSave(form);
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Add custom task"
      onClick={handleBackdrop} onKeyDown={handleKeyDown}>
      <div className="modal-card slide-up" ref={modalRef}>
        <button className="close-btn" onClick={onClose} aria-label="Close">&times;</button>
        <h3 className="modal-title">Add Custom Task</h3>
        <p className="modal-sub">Track any compliance obligation not on your calendar.</p>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <label className="modal-label">
            Task Name
            <input
              ref={nameRef}
              className={`modal-input${errors.name ? ' input-error' : ''}`}
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="e.g. Lodge TPAR"
            />
            {errors.name && <small className="error-text">{errors.name}</small>}
          </label>

          <label className="modal-label">
            Due Date
            <input
              type="date"
              className={`modal-input${errors.dueDate ? ' input-error' : ''}`}
              value={form.dueDate}
              min={today()}
              onChange={e => handleChange('dueDate', e.target.value)}
            />
            {errors.dueDate && <small className="error-text">{errors.dueDate}</small>}
          </label>

          <label className="modal-label">
            Priority
            <select
              className="modal-input modal-select"
              value={form.priority}
              onChange={e => handleChange('priority', e.target.value)}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>

          <label className="modal-label">
            Notes <span className="modal-optional">(optional)</span>
            <textarea
              className="modal-textarea"
              value={form.notes}
              onChange={e => handleChange('notes', e.target.value)}
              placeholder="Any additional context..."
              rows={3}
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Task &rarr;</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomTaskModal;
