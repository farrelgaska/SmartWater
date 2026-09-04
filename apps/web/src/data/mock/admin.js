export const mockAdminSystem = {
  summary: {
    connectedNodes: { value: '52', detail: '+4.2% this month' },
    systemHealth: { value: '98.2%', detail: 'Target 99%' },
    failedNodes: { value: '1.8%', detail: 'Critical attention' },
    activeUsers: { value: '124', detail: 'Session: 4h' },
  },
  users: [
    { id: 'user-admin-01', name: 'Rina Prasetyo', email: 'rina.admin@smartwater.id', role: 'Administrator', status: 'active' },
    { id: 'user-dlh-07', name: 'Dimas Santoso', email: 'dimas.dlh@pekalongan.go.id', role: 'DLH', status: 'active' },
    { id: 'user-industry-14', name: 'Nadia Lestari', email: 'nadia@batiksejahtera.id', role: 'Industry', status: 'active' },
  ],
};

