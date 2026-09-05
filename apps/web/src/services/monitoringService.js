import { request } from './apiClient.js';
import { mockMonitoring } from '../data/mock/monitoring.js';

export async function getMonitoring() {
  try {
    const [sysRes, rulesRes] = await Promise.allSettled([
      request('/admin/system'),
      request('/admin/threshold-rules'),
    ]);

    const sysData = sysRes.status === 'fulfilled' ? sysRes.value?.data : null;
    const rulesData = rulesRes.status === 'fulfilled' ? rulesRes.value?.data : null;

    const devices = (sysData?.devices && sysData.devices.length > 0)
      ? sysData.devices.map((d) => ({
          id: d.serialNumber || d.id,
          industry: d.stationName || 'Batik Pekalongan',
          station: d.stationName || 'Stasiun Pemantauan',
          status: d.status || 'active',
          lastPing: 'Baru saja',
          firmware: `v${d.firmwareVersion || '1.0.0'}`,
        }))
      : mockMonitoring.devices;

    const parameters = (rulesData?.rules && rulesData.rules.length > 0)
      ? rulesData.rules.map((r) => {
          let range = 'N/A';
          if (r.warningMin !== null && r.warningMax !== null) {
            range = `${r.warningMin} – ${r.warningMax}`;
          } else if (r.warningMin !== null) {
            range = `≥ ${r.warningMin}`;
          } else if (r.warningMax !== null) {
            range = `≤ ${r.warningMax}`;
          }
          return {
            key: r.parameterKey,
            name: r.name,
            unit: r.unit,
            range,
            status: 'Terkonfigurasi',
            basis: r.basisNote || 'Baku mutu operasional',
          };
        })
      : mockMonitoring.parameters;

    return { devices, parameters };
  } catch (err) {
    console.warn('[SmartWater] Fallback to mock monitoring data:', err);
    return mockMonitoring;
  }
}

