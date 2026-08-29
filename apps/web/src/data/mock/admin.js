export const mockAdminSystem = {
  summary: {
    activeDevices: { value: '52', detail: '+4.2% this month' },
    systemHealth: { value: '98.2%', detail: 'Target 99%' },
    failedNodes: { value: '1.8%', detail: 'Critical attention' },
    activeUsers: { value: '124', detail: 'Session: 4h' },
  },
  devices: [
    { id: 'SW-ESP32-001', industry: 'PT. Pekalongan Textindo', status: 'active', lastPing: '2 min ago', firmware: 'v2.4.1' },
    { id: 'SW-ESP32-014', industry: 'Batik Sejahtera Abadi', status: 'unstable', lastPing: '8 min ago', firmware: 'v2.3.8' },
    { id: 'SW-ESP32-022', industry: 'Mandiri Dyeworks', status: 'active', lastPing: '1 min ago', firmware: 'v2.4.1' },
    { id: 'SW-ESP32-031', industry: 'Batik Lestari Pekalongan', status: 'offline', lastPing: '2 hrs ago', firmware: 'v2.2.9' },
    { id: 'SW-ESP32-044', industry: 'Pekalongan Textile Works', status: 'active', lastPing: '4 min ago', firmware: 'v2.4.0' },
    { id: 'SW-ESP32-051', industry: 'Batik Sumberjo Lestari', status: 'active', lastPing: '3 min ago', firmware: 'v2.4.1' },
  ],
  users: [
    { id: 'user-admin-01', name: 'Rina Prasetyo', email: 'rina.admin@smartwater.id', role: 'Administrator', status: 'active' },
    { id: 'user-dlh-07', name: 'Dimas Santoso', email: 'dimas.dlh@pekalongan.go.id', role: 'DLH', status: 'active' },
    { id: 'user-industry-14', name: 'Nadia Lestari', email: 'nadia@batiksejahtera.id', role: 'Industry', status: 'active' },
  ],
  thresholdRules: [
    { id: 'rule-ph', name: 'pH', value: 'Configured in demo profile', unit: '', basis: 'Demo configuration' },
    { id: 'rule-tss', name: 'TSS', value: 'Configured in demo profile', unit: 'mg/L', basis: 'Demo configuration' },
    { id: 'rule-cod', name: 'COD', value: 'Configured in demo profile', unit: 'mg/L', basis: 'Demo configuration' },
  ],
};

