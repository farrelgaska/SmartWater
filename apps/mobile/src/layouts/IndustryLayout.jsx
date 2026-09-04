import { Bell, UserCircle } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import BottomNav from '../components/navigation/BottomNav.jsx';
import { mobileRoutes } from '../routes/routePaths.js';

export default function IndustryLayout() {
  return <div className="industry-frame"><header className="mobile-top-bar"><img className="mobile-brand-logo" src="/logosmartwater.png" alt="SmartWater" /><span className="top-actions"><Link className="mobile-profile-link" to={mobileRoutes.alerts} aria-label="Buka peringatan"><Bell size={18} aria-hidden="true" /></Link><Link className="mobile-profile-link" to={mobileRoutes.profile} aria-label="Buka profil"><UserCircle size={20} aria-hidden="true" /></Link></span></header><Outlet /><BottomNav /></div>;
}

