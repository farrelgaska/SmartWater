export const WATER_QUALITY_PARAMETERS = [
  { key: 'ph', label: 'pH', unit: '' },
  { key: 'temperature', label: 'Temperature', unit: '°C' },
  { key: 'tds', label: 'TDS', unit: 'mg/L' },
  { key: 'turbidity', label: 'Turbidity', unit: 'NTU' },
  { key: 'do', label: 'DO', unit: 'mg/L' },
  { key: 'cod', label: 'COD', unit: 'mg/L' },
  { key: 'bod', label: 'BOD', unit: 'mg/L' },
  { key: 'tss', label: 'TSS', unit: 'mg/L' },
];

export const STATUS_TOKENS = {
  water: ['normal', 'warning', 'critical'],
  device: ['active', 'unstable', 'offline'],
  alert: ['new', 'acknowledged', 'resolved'],
};

