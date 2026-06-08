function parseLocalISODate(isoDate) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate || '')) return null;
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

export function computeTaskStatus(isoDate) {
  const due = parseLocalISODate(isoDate);
  if (!due) return 'upcoming';
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
  const date = parseLocalISODate(isoStr);
  if (!date) return 'No date set';
  return date.toLocaleDateString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function getDaysLeft(isoDate) {
  const due = parseLocalISODate(isoDate);
  if (!due) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((due - today) / 86400000);
}
