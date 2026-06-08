export function computeTaskStatus(isoDate) {
  const due = new Date(isoDate + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((due - today) / 86400000);
  if (diff < 0) return 'overdue';
  if (diff <= 14) return 'due-soon';
  return 'upcoming';
}

export function recomputeStatuses(taskList) {
  return taskList.map(t => (
    t.status === 'completed'
      ? t
      : { ...t, status: computeTaskStatus(t.dueDate) }
  ));
}

export function formatDate(isoStr) {
  return new Date(isoStr + 'T00:00:00').toLocaleDateString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function getDaysLeft(isoDate) {
  const due = new Date(isoDate + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((due - today) / 86400000);
}
