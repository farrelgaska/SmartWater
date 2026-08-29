import { Navigate, Route, Routes } from 'react-router-dom';
import { webRoutes } from './routes/routePaths.js';
import AdminLayout from './layouts/AdminLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import DLHLayout from './layouts/DLHLayout.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import SystemPage from './pages/admin/SystemPage.jsx';
import DashboardPage from './pages/dlh/DashboardPage.jsx';
import DLHSectionPage from './pages/dlh/DLHSectionPage.jsx';

export default function App() {
  return <Routes>
    <Route element={<AuthLayout />}><Route path={webRoutes.login} element={<LoginPage />} /></Route>
    <Route element={<DLHLayout />}>
      <Route path={webRoutes.dlh} element={<DashboardPage />} />
      <Route path={webRoutes.dlhMonitoring} element={<DLHSectionPage title="Regional Monitoring" description="Reserved shell for DLH station monitoring workflows." />} />
      <Route path={webRoutes.dlhAlerts} element={<DLHSectionPage title="Regional Alerts" description="Reserved shell for DLH incident review workflows." />} />
      <Route path={webRoutes.dlhAnalysis} element={<DLHSectionPage title="AI Analysis" description="Reserved shell for decision-support review; no model or controls are connected." />} />
    </Route>
    <Route element={<AdminLayout />}><Route path={webRoutes.admin} element={<SystemPage />} /></Route>
    <Route path="/" element={<Navigate to={webRoutes.login} replace />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>;
}

