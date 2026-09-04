export const mockDlhDashboard = {
  kpis: [
    { label: 'Total Stations', value: '48', detail: 'Across Pekalongan', tone: 'default' },
    { label: 'Normal', value: '38', detail: '79% of stations', tone: 'normal' },
    { label: 'Warning', value: '07', detail: '+2 since yesterday', tone: 'warning' },
    { label: 'Critical', value: '03', detail: 'Requires attention', tone: 'critical' },
    { label: 'Offline', value: '02', detail: 'Last seen recently', tone: 'offline' },
  ],
  stations: [
    { id: 'station-01', name: 'Kedungwuni', status: 'normal', x: 30, y: 38 },
    { id: 'station-02', name: 'Buaran', status: 'critical', x: 56, y: 48 },
    { id: 'station-03', name: 'Pekalongan Utara', status: 'warning', x: 72, y: 28 },
    { id: 'station-04', name: 'Tirto', status: 'offline', x: 42, y: 68 },
    { id: 'station-05', name: 'Pekalongan Barat', status: 'normal', x: 20, y: 61 },
  ],
  mapLocations: [
    { id: 'map-industry-sejahtera', name: 'Batik Sejahtera', type: 'industry', latitude: -6.889, longitude: 109.668, status: 'normal', relatedIndustryId: 'industry-sejahtera', parameter: 'Turbidity', reading: '22 NTU', x: 56, y: 48 },
    { id: 'map-industry-textindo', name: 'PT. Pekalongan Textindo', type: 'industry', latitude: -6.913, longitude: 109.641, status: 'normal', relatedIndustryId: 'industry-textindo', parameter: 'pH', reading: '7.2', x: 30, y: 38 },
    { id: 'map-monitoring-inlet', name: 'Inlet Limbah 02', type: 'monitoring-point', latitude: -6.882, longitude: 109.684, status: 'warning', relatedIndustryId: 'industry-sejahtera', parameter: 'Debit / Volume', reading: 'Waspada', x: 72, y: 28 },
    { id: 'map-monitoring-buaran', name: 'Buaran Outlet', type: 'monitoring-point', latitude: -6.921, longitude: 109.672, status: 'critical', relatedIndustryId: 'industry-sejahtera', parameter: 'TSS', reading: '310 mg/L', x: 63, y: 60 },
    { id: 'map-station-tirto', name: 'Tirto Station', type: 'monitoring-point', latitude: -6.931, longitude: 109.62, status: 'offline', relatedIndustryId: 'industry-lestari', parameter: 'Sensor health', reading: 'Offline', x: 42, y: 68 },
  ],
  incidents: [
    {
      id: 'incident-tss', severity: 'critical', title: 'TSS Alert', time: '2 mins ago',
      summary: 'Batik Pekalongan Sejahtera â€” Facility 04 reported TSS 450 mg/L (Limit: 50 mg/L).',
      action: 'Dispatch Inspector',
    },
    {
      id: 'incident-ph', severity: 'warning', title: 'pH Level', time: '15 mins ago',
      summary: 'Sumberjo Municipal â€” pH trending low (5.4). Probable chemical discharge.',
      action: 'Remote Check',
    },
    {
      id: 'incident-calibration', severity: 'info', title: 'System Update', time: '45 mins ago',
      summary: 'Station 08 (North Coastal) re-calibrated successfully.', action: 'View Log',
    },
  ],
  industries: [
    {
      id: 'industry-textindo', name: 'PT. Pekalongan Textindo', idLabel: 'IND-2039-A', location: 'Kedungwuni', status: 'normal', statusLabel: 'Normal',
      parameters: [{ label: 'PH', value: '7.2' }, { label: 'COD', value: '120' }, { label: 'TEMP', value: '28Â°C' }], lastUpdate: '2 min ago',
    },
    {
      id: 'industry-sejahtera', name: 'Batik Sejahtera Abadi', idLabel: 'IND-5521-F', location: 'Buaran', status: 'critical', statusLabel: 'High TSS',
      parameters: [{ label: 'PH', value: '6.8' }, { label: 'COD', value: '480' }, { label: 'TSS', value: '310' }], lastUpdate: '5 min ago',
    },
    {
      id: 'industry-dyeworks', name: 'Mandiri Dyeworks', idLabel: 'IND-1102-C', location: 'Pekalongan Utara', status: 'warning', statusLabel: 'Trending',
      parameters: [{ label: 'PH', value: '8.1' }, { label: 'COD', value: '210' }, { label: 'DO', value: '4.2' }], lastUpdate: '12 min ago',
    },
    {
      id: 'industry-lestari', name: 'Batik Lestari Pekalongan', idLabel: 'IND-9918-B', location: 'Tirto', status: 'offline', statusLabel: 'Offline',
      parameters: [{ label: 'PH', value: 'â€”' }, { label: 'COD', value: 'â€”' }, { label: 'TSS', value: 'â€”' }], lastUpdate: '2 hrs ago',
    },
  ],
  wqiTrend: [
    { label: 'MON', value: 64 }, { label: 'TUE', value: 75 }, { label: 'WED', value: 52 },
    { label: 'THU', value: 34 }, { label: 'FRI', value: 61 }, { label: 'SAT', value: 82 }, { label: 'SUN', value: 72 },
  ],
  aiRisk: {
    riskScore: 75, horizonHours: 24, label: 'Medium-High Risk',
    summary: 'High tides combined with heavy rainfall may increase runoff from textile hubs.',
    actionLabel: 'View Mitigation Plan',
  },
  aiAnalysis: {
    riskScore: 75,
    horizonHours: 24,
    riskLevel: 'warning',
    summary: 'Turbidity and low pH trends may increase regional discharge risk over the next 24 hours.',
    factors: [
      { label: 'Turbidity spikes', detail: '3 stations above configured range', contribution: '+28%' },
      { label: 'pH drift', detail: 'Buaran and Kedungwuni trending low', contribution: '+19%' },
      { label: 'Device instability', detail: '1 station reporting suspect readings', contribution: '+11%' },
    ],
    affected: ['Batik Sejahtera Abadi', 'PT. Pekalongan Textindo', 'Inlet Limbah 02'],
    recommendations: ['Review affected station readings with the environmental team.', 'Prioritize a human inspection of the Buaran outlet.', 'Record follow-up actions in the incident log.'],
  },
};

