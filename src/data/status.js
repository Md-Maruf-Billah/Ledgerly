export const STATUS_META = {
  overdue: {
    label: 'Overdue',
    shortLabel: 'Overdue',
    tone: 'overdue',
    description: 'Needs attention',
  },
  'due-soon': {
    label: 'Due soon',
    shortLabel: 'Due soon',
    tone: 'due-soon',
    description: 'Due within 14 days',
  },
  upcoming: {
    label: 'Upcoming',
    shortLabel: 'Upcoming',
    tone: 'upcoming',
    description: 'Scheduled ahead',
  },
  completed: {
    label: 'Completed',
    shortLabel: 'Done',
    tone: 'completed',
    description: 'Finished',
  },
};

export const STATUS_ORDER = ['overdue', 'due-soon', 'upcoming', 'completed'];

export function getStatusMeta(status) {
  return STATUS_META[status] || {
    label: status || 'Unknown',
    shortLabel: status || 'Unknown',
    tone: 'neutral',
    description: 'Status unavailable',
  };
}
