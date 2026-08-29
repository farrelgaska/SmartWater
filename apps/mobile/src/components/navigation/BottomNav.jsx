import { createElement } from 'react';
import { BarChart3, Bell, House, UserRound } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { mobileRoutes } from '../../routes/routePaths.js';

const items = [
  { label: 'Home', to: mobileRoutes.industry, icon: House },
  { label: 'Alerts', to: mobileRoutes.alerts, icon: Bell },
  { label: 'Analysis', to: mobileRoutes.aiAnalysis.replace(':analysisId', 'analysis-batik-001'), icon: BarChart3 },
  { label: 'Profile', to: mobileRoutes.profile, icon: UserRound },
];

function isActive(label, pathname) {
  if (label === 'Home') return pathname === mobileRoutes.industry || pathname.startsWith('/industry/monitoring/');
  if (label === 'Alerts') return pathname === mobileRoutes.alerts || pathname.startsWith('/industry/alerts/');
  if (label === 'Analysis') return pathname.startsWith('/industry/ai-analysis/');
  return pathname === mobileRoutes.profile;
}

export default function BottomNav() {
  const { pathname } = useLocation();
  return <nav className="bottom-nav" aria-label="Industry navigation">{items.map(({ label, to, icon }) => {
    const active = isActive(label, pathname);
    return <NavLink key={label} to={to} end={label === 'Home'} className={'bottom-link' + (active ? ' bottom-link-active' : '')} aria-current={active ? 'page' : undefined}>{createElement(icon, { size: 18, 'aria-hidden': true })}<span>{label}</span></NavLink>;
  })}</nav>;
}

