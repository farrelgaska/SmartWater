import { Activity, Bell, Brain, CircleHelp, Grid2X2, LogOut, Settings } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { webRoutes } from '../../routes/routePaths.js';

const icons = { dashboard: Grid2X2, monitoring: Activity, alerts: Bell, analysis: Brain, admin: Settings };

export default function SideNav({ role, items, variant }) {
  const location = useLocation();
  return (
    <aside className={`side-nav${variant ? ` side-nav-${variant}` : ''}`}>
      <div className="side-nav-brand"><div className="side-nav-brand-card"><img src="/logosmartwater.png" alt="SmartWater" /><p className="side-nav-title">SmartWater Analytics Platform</p></div><p className="role-label">{role}</p></div>
      <nav aria-label={`${role} navigation`}>
        {items.map(({ label, to, icon, active, end }) => {
          const Icon = icons[icon] ?? Grid2X2;
          return <NavLink key={label} to={to} end={end} className={({ isActive }) => { const itemActive = typeof active === 'function' ? active(location) : active ?? isActive; return `nav-link${itemActive ? ' nav-link-active' : ''}`; }} aria-current={(typeof active === 'function' ? active(location) : active) ? 'page' : undefined}><Icon size={18} aria-hidden="true" />{label}</NavLink>;
        })}
      </nav>
      <div className="side-nav-footer"><a className="side-nav-footer-item" href="mailto:it-support@smartwater.local"><CircleHelp size={18} aria-hidden="true" />Support</a><a className="side-nav-footer-item" href={webRoutes.login}><LogOut size={18} aria-hidden="true" />Log out</a></div>
    </aside>
  );
}


