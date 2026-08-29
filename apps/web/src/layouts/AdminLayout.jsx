import { Bell, UserCircle } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import SideNav from '../components/navigation/SideNav.jsx';
import { webRoutes } from '../routes/routePaths.js';

const items = [{ label: 'System Admin', to: webRoutes.admin, icon: 'admin', end: true }];

export default function AdminLayout() {
  return <div className="app-layout"><SideNav role="SmartWater Admin" items={items} /><div className="app-main"><header className="top-bar"><span>System Management</span><span className="top-actions"><Bell size={18} aria-hidden="true" /><UserCircle size={20} aria-hidden="true" /></span></header><Outlet /></div></div>;
}

