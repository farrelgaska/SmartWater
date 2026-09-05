import { request } from './apiClient.js';
import { mockIndustry } from '../data/mock/industry.js';

export async function getIndustryDashboard() {
  try {
    const data = await request('/industry/dashboard');
    if (!data || !data.industry) return mockIndustry;

    // Merge live data with UI formatted parameters
    const liveReadings = (data.latestReadings && data.latestReadings.length > 0)
      ? data.latestReadings.map((r) => ({
          id: `reading-${r.parameterKey}`,
          parameterKey: r.parameterKey,
          value: r.value,
          unit: r.unit || '',
          condition: r.condition,
          quality: r.quality || 'valid',
        }))
      : mockIndustry.readings;

    const liveAnalysis = data.latestAnalysis ? {
      ...mockIndustry.analysis,
      id: data.latestAnalysis.id,
      generatedAt: data.latestAnalysis.generatedAt,
      horizonHours: data.latestAnalysis.horizonHours,
      riskLevel: data.latestAnalysis.riskLevel,
      riskLabel: data.latestAnalysis.riskLevel === 'critical' ? 'TINGGI' : data.latestAnalysis.riskLevel === 'warning' ? 'SEDANG' : 'NORMAL',
      riskScore: Math.round(data.latestAnalysis.riskScore || 20),
      summary: data.latestAnalysis.summary,
    } : mockIndustry.analysis;

    const liveAlerts = (data.recentAlerts && data.recentAlerts.length > 0)
      ? data.recentAlerts.map((a) => ({
          id: a.id,
          title: a.title,
          severity: a.severity,
          severityLabel: a.severity === 'critical' ? 'Merah' : 'Amber',
          status: a.status,
          statusLabel: a.status === 'new' ? 'BARU' : a.status === 'acknowledged' ? 'DIKETAHUI' : 'SELESAI',
          parameterKeys: a.parameterKeys || [],
          parameterLabel: a.parameterKeys?.[0] ? a.parameterKeys[0].toUpperCase() : 'Limbah',
          value: null,
          unit: '',
          sensorLabel: data.station?.name || 'Outlet Stasiun IPAL',
          message: a.message,
          triggeredAt: a.triggeredAt,
          relativeTime: 'Baru saja',
          stationId: data.station?.id,
          aiAnalysisId: a.aiAnalysisId || liveAnalysis.id,
        }))
      : mockIndustry.alerts;

    return {
      ...mockIndustry,
      industry: { ...mockIndustry.industry, name: data.industry.name || mockIndustry.industry.name },
      station: { ...mockIndustry.station, name: data.station?.name || mockIndustry.station.name },
      readings: liveReadings,
      analysis: liveAnalysis,
      alerts: liveAlerts,
    };
  } catch (err) {
    console.warn('[SmartWater] Fallback to mock industry dashboard:', err);
    return mockIndustry;
  }
}

export async function getMonitoring(stationId) {
  try {
    const data = await request(`/industry/stations/${stationId || 'st-puspa-01'}`);
    if (!data || !data.station) {
      return { ...mockIndustry, station: { ...mockIndustry.station, id: stationId }, parameters: mockIndustry.monitoringParameters };
    }

    return {
      ...mockIndustry,
      station: { ...mockIndustry.station, id: stationId, name: data.station.name },
      parameters: mockIndustry.monitoringParameters,
    };
  } catch {
    return { ...mockIndustry, station: { ...mockIndustry.station, id: stationId }, parameters: mockIndustry.monitoringParameters };
  }
}
