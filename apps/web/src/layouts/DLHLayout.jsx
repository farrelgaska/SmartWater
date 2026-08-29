import { Bell, UserCircle } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import SideNav from '../components/navigation/SideNav.jsx';
import { webRoutes } from '../routes/routePaths.js';

const items = [
  { label: 'Dashboard', to: webRoutes.dlh, icon: 'dashboard', end: true },
  { label: 'Monitoring', to: webRoutes.dlhMonitoring, icon: 'monitoring', end: true },
  { label: 'Alerts', to: webRoutes.dlhAlerts, icon: 'alerts', end: true },
  { label: 'AI Analysis', to: webRoutes.dlhAnalysis, icon: 'analysis', end: true },
];

export default function DLHLayout() {
  return <div className="app-layout"><SideNav role="DLH · Regional Oversight" items={items} /><div className="app-main"><header className="top-bar"><span>SmartWater Analytics</span><span className="top-actions"><Bell size={18} aria-hidden="true" /><UserCircle size={20} aria-hidden="true" /></span></header><Outlet /></div></div>;
}


