export const PROBLEM_TYPES = {
  light: {
    label: 'Light problem',
    title: 'Report a light problem',
    hint: 'Broken or damaged light',
    icon: 'bulb',
    tone: 'light',
  },
  heater: {
    label: 'Heater problem',
    title: 'Report a heater problem',
    hint: 'Broken or faulty heater',
    icon: 'flame',
    tone: 'heater',
  },
};

export const STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In progress',
  fixed: 'Fixed',
};

export const STATUS_ICONS = {
  pending: 'clock',
  in_progress: 'tool',
  fixed: 'check-circle',
};

export const STATUS_FILTERS = [
  ['all', 'All'],
  ['pending', 'Pending'],
  ['in_progress', 'In progress'],
  ['fixed', 'Fixed'],
];