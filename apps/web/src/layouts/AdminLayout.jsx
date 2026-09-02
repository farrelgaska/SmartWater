import { UserCircle } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import SideNav from '../components/navigation/SideNav.jsx';
import { webRoutes } from '../routes/routePaths.js';

const items = [
  { label: 'Dashboard', to: webRoutes.adminDashboard, icon: 'dashboard', end: true },
  { label: 'Monitoring', to: webRoutes.adminMonitoring, icon: 'monitoring', end: true },
  { label: 'AI Analysis', to: webRoutes.adminAnalysis, icon: 'analysis', end: true },
  { label: 'System Admin', to: webRoutes.admin, icon: 'admin', end: true, active: ({ pathname }) => pathname === webRoutes.admin || pathname === webRoutes.adminProfile },
];

export default function AdminLayout() {
  return <div className="app-layout"><SideNav role="SmartWater Admin" variant="admin" items={items} /><div className="app-main admin-main"><header className="top-bar"><span>SmartWater Admin</span><Link className="admin-profile-link" to={webRoutes.adminProfile} aria-label="Open administrator profile"><span className="admin-avatar">RP</span><span className="admin-profile-copy"><strong>Rina Prasetyo</strong><small>Administrator</small></span><UserCircle size={18} aria-hidden="true" /></Link></header><Outlet /></div></div>;
}

