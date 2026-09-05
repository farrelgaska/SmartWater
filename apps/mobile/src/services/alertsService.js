import { request } from './apiClient.js';
import { mockIndustry } from '../data/mock/industry.js';

export async function getAlerts() {
  try {
    const res = await request('/industry/alerts');
    if (!res?.data?.alerts || res.data.alerts.length === 0) {
      return mockIndustry.alerts;
    }

    return res.data.alerts.map((a) => ({
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
      sensorLabel: 'Outlet Stasiun IPAL',
      message: a.message,
      triggeredAt: a.triggeredAt,
      relativeTime: 'Baru saja',
      stationId: a.stationId,
      aiAnalysisId: a.aiAnalysisId,
    }));
  } catch (err) {
    console.warn('[SmartWater] Fallback to mock alerts:', err);
    return mockIndustry.alerts;
  }
}

export async function getAlert(alertId) {
  try {
    const res = await request(`/industry/alerts/${alertId}`);
    if (!res?.data?.alert) {
      return mockIndustry.alerts.find((alert) => alert.id === alertId) ?? null;
    }
    const a = res.data.alert;
    return {
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
      sensorLabel: res.data.station?.name || 'Outlet Stasiun IPAL',
      message: a.message,
      triggeredAt: a.triggeredAt,
      relativeTime: 'Baru saja',
      stationId: a.stationId,
      aiAnalysisId: a.aiAnalysisId,
    };
  } catch {
    return mockIndustry.alerts.find((alert) => alert.id === alertId) ?? null;
  }
}

export async function updateAlertStatus(alertId, status) {
  try {
    const res = await request(`/industry/alerts/${alertId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return res?.data?.alert;
  } catch (err) {
    console.warn(`[SmartWater] Error updating alert ${alertId}:`, err);
    return { id: alertId, status };
  }
}


