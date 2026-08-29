import { Bell, UserCircle } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import BottomNav from '../components/navigation/BottomNav.jsx';
import { mobileRoutes } from '../routes/routePaths.js';

export default function IndustryLayout() {
  return <div className="industry-frame"><header className="mobile-top-bar"><span className="brand">SWA</span><span className="top-actions"><Bell size={18} aria-hidden="true" /><Link className="mobile-profile-link" to={mobileRoutes.profile} aria-label="Profile"><UserCircle size={20} aria-hidden="true" /></Link></span></header><Outlet /><BottomNav /></div>;
}

