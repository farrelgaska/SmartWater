import { Activity, Bell, Brain, CircleHelp, Grid2X2, LogOut, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const icons = { dashboard: Grid2X2, monitoring: Activity, alerts: Bell, analysis: Brain, admin: Settings };

export default function SideNav({ role, items }) {
  return (
    <aside className="side-nav">
      <div><p className="brand">SmartWater</p><p className="role-label">{role}</p></div>
      <nav aria-label={`${role} navigation`}>
        {items.map(({ label, to, icon, active, end }) => {
          const Icon = icons[icon] ?? Grid2X2;
          return <NavLink key={label} to={to} end={end} className={({ isActive }) => `nav-link${(active ?? isActive) ? ' nav-link-active' : ''}`} aria-current={active === true ? 'page' : undefined}><Icon size={18} aria-hidden="true" />{label}</NavLink>;
        })}
      </nav>
      <div className="side-nav-footer"><span className="side-nav-footer-item"><CircleHelp size={18} aria-hidden="true" />Support</span><span className="side-nav-footer-item"><LogOut size={18} aria-hidden="true" />Log out</span></div>
    </aside>
  );
}


