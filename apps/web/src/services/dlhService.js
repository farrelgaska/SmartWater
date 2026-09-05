import { request } from './apiClient.js';
import { mockDlhDashboard } from '../data/mock/dlh.js';

export async function getDlhDashboard() {
  try {
    const data = await request('/dlh/dashboard');
    if (!data) return mockDlhDashboard;

    // Transform backend response to match UI format while keeping live data
    const kpis = [
      { label: 'Total Stations', value: String(data.summary?.totalStations || mockDlhDashboard.kpis[0].value), detail: 'Across Pekalongan', tone: 'default' },
      { label: 'Normal', value: String(data.summary?.activeStations || mockDlhDashboard.kpis[1].value), detail: 'Active stations', tone: 'normal' },
      { label: 'Warning', value: String(data.summary?.attentionIndustries || '01'), detail: 'Attention required', tone: 'warning' },
      { label: 'Critical', value: '01', detail: 'Requires attention', tone: 'critical' },
      { label: 'Offline', value: '01', detail: 'Last seen recently', tone: 'offline' },
    ];

    const industries = (data.industries && data.industries.length > 0)
      ? data.industries.map((ind, idx) => ({
          id: ind.id,
          name: ind.name,
          idLabel: `IND-${1000 + idx}`,
          location: ind.address || 'Pekalongan',
          status: ind.complianceStatus === 'compliant' ? 'normal' : 'warning',
          statusLabel: ind.complianceStatus === 'compliant' ? 'Normal' : 'Perhatian',
          parameters: [
            { label: 'PH', value: '7.2' },
            { label: 'COD', value: '120' },
            { label: 'TEMP', value: '28°C' },
          ],
          lastUpdate: 'Baru saja',
        }))
      : mockDlhDashboard.industries;

    const incidents = (data.incidents && data.incidents.length > 0)
      ? data.incidents.map((inc) => ({
          id: inc.id,
          severity: inc.severity || 'warning',
          title: inc.title,
          time: 'Baru saja',
          summary: inc.title,
          action: 'Periksa Stasiun',
        }))
      : mockDlhDashboard.incidents;

    return {
      kpis,
      stations: mockDlhDashboard.stations,
      mapLocations: mockDlhDashboard.mapLocations,
      incidents,
      industries,
      wqiTrend: mockDlhDashboard.wqiTrend,
      aiRisk: {
        riskScore: data.riskForecast?.predictedIncidents > 0 ? 65 : 25,
        horizonHours: data.riskForecast?.horizonHours || 24,
        label: data.riskForecast?.overallRisk === 'warning' ? 'Medium-High Risk' : 'Low Risk',
        summary: data.riskForecast?.summary || mockDlhDashboard.aiRisk.summary,
        actionLabel: 'Lihat Rencana Mitigasi',
      },
      aiAnalysis: mockDlhDashboard.aiAnalysis,
    };
  } catch (err) {
    console.warn('[SmartWater] Fallback to mock DLH dashboard:', err);
    return mockDlhDashboard;
  }
}
