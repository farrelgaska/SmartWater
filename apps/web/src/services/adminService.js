import { request } from './apiClient.js';
import { mockAdminSystem } from '../data/mock/admin.js';

export async function getAdminSystem() {
  try {
    const res = await request('/admin/system');
    if (!res?.data) return { scope: 'admin', ...mockAdminSystem };

    const { summary, devices, users } = res.data;

    const formattedSummary = {
      connectedNodes: { value: String(summary?.totalDevices ?? mockAdminSystem.summary.connectedNodes.value), detail: `${summary?.activeDevices || 0} Aktif di lapangan` },
      systemHealth: { value: '98.5%', detail: 'Target 99%' },
      failedNodes: { value: String((summary?.unstableDevices || 0) + (summary?.offlineDevices || 0)), detail: 'Perlu perhatian' },
      activeUsers: { value: String(summary?.totalUsers ?? mockAdminSystem.summary.activeUsers.value), detail: 'Akun terdaftar' },
    };

    const formattedDevices = (devices && devices.length > 0)
      ? devices.map((d) => ({
          id: d.serialNumber || d.id,
          industry: d.stationName || 'Batik Pekalongan',
          status: d.status,
          lastPing: 'Baru saja',
          firmware: `v${d.firmwareVersion || '1.0.0'}`,
        }))
      : mockAdminSystem.devices;

    const formattedUsers = (users && users.length > 0)
      ? users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role.toUpperCase(),
          status: u.status,
        }))
      : mockAdminSystem.users;

    return {
      scope: 'admin',
      summary: formattedSummary,
      devices: formattedDevices,
      users: formattedUsers,
      thresholdRules: mockAdminSystem.thresholdRules,
    };
  } catch (err) {
    console.warn('[SmartWater] Fallback to mock Admin system:', err);
    return { scope: 'admin', ...mockAdminSystem };
  }
}
