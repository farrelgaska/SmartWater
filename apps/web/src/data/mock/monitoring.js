export const mockMonitoring = {
  devices: [
    { id: 'SW-ESP32-001', industry: 'PT. Pekalongan Textindo', station: 'Kedungwuni Inlet', status: 'active', lastPing: '2 min ago', firmware: 'v2.4.1' },
    { id: 'SW-ESP32-014', industry: 'Batik Sejahtera Abadi', station: 'Buaran Outlet', status: 'unstable', lastPing: '8 min ago', firmware: 'v2.3.8' },
    { id: 'SW-ESP32-022', industry: 'Mandiri Dyeworks', station: 'Pekalongan Utara', status: 'active', lastPing: '1 min ago', firmware: 'v2.4.1' },
    { id: 'SW-ESP32-031', industry: 'Batik Lestari Pekalongan', station: 'Tirto Outlet', status: 'offline', lastPing: '2 hrs ago', firmware: 'v2.2.9' },
    { id: 'SW-ESP32-044', industry: 'Pekalongan Textile Works', station: 'Jenggot Inlet', status: 'active', lastPing: '4 min ago', firmware: 'v2.4.0' },
    { id: 'SW-ESP32-051', industry: 'Batik Sumberjo Lestari', station: 'Sumberjo Outlet', status: 'active', lastPing: '3 min ago', firmware: 'v2.4.1' },
  ],
  parameters: [
    { key: 'ph', name: 'pH', unit: '', range: '6.5 – 8.5', status: 'Configured', basis: 'Demo operational range' },
    { key: 'temperature', name: 'Temperature', unit: '°C', range: '24 – 35', status: 'Configured', basis: 'Demo operational range' },
    { key: 'tds', name: 'TDS', unit: 'mg/L', range: '0 – 1,000', status: 'Configured', basis: 'Demo operational range' },
    { key: 'turbidity', name: 'Turbidity', unit: 'NTU', range: '0 – 50', status: 'Configured', basis: 'Demo operational range' },
    { key: 'do', name: 'Dissolved Oxygen (DO)', unit: 'mg/L', range: '≥ 2', status: 'Configured', basis: 'Demo operational range' },
    { key: 'cod', name: 'Chemical Oxygen Demand (COD)', unit: 'mg/L', range: '0 – 300', status: 'Configured', basis: 'Demo operational range' },
    { key: 'bod', name: 'Biochemical Oxygen Demand (BOD)', unit: 'mg/L', range: '0 – 150', status: 'Configured', basis: 'Demo operational range' },
    { key: 'tss', name: 'Total Suspended Solids (TSS)', unit: 'mg/L', range: '0 – 100', status: 'Configured', basis: 'Demo operational range' },
  ],
};
