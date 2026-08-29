import { mockIndustry } from '../data/mock/industry.js';

export function getAlerts() {
  return Promise.resolve(mockIndustry.alerts);
}

export function getAlert(alertId) {
  return Promise.resolve(mockIndustry.alerts.find((alert) => alert.id === alertId) ?? null);
}
