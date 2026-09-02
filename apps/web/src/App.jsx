import { Navigate, Route, Routes } from 'react-router-dom';
import { webRoutes } from './routes/routePaths.js';
import AdminLayout from './layouts/AdminLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import DLHLayout from './layouts/DLHLayout.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import SystemPage from './pages/admin/SystemPage.jsx';
import ProfilePage from './pages/admin/ProfilePage.jsx';
import DashboardPage from './pages/dlh/DashboardPage.jsx';
import MonitoringPage from './pages/dlh/MonitoringPage.jsx';
import AIAnalysisPage from './pages/dlh/AIAnalysisPage.jsx';

export default function App() {
  return <Routes>
    <Route element={<AuthLayout />}><Route path={webRoutes.login} element={<LoginPage />} /></Route>
    <Route element={<DLHLayout />}>
      <Route path={webRoutes.dlh} element={<DashboardPage />} />
      <Route path={webRoutes.dlhMonitoring} element={<MonitoringPage />} />
      <Route path={webRoutes.dlhAlerts} element={<Navigate to={webRoutes.dlhMonitoring} replace />} />
      <Route path={webRoutes.dlhAnalysis} element={<AIAnalysisPage />} />
    </Route>
    <Route element={<AdminLayout />}>
      <Route path={webRoutes.adminDashboard} element={<DashboardPage />} />
      <Route path={webRoutes.adminMonitoring} element={<MonitoringPage />} />
      <Route path={webRoutes.adminAnalysis} element={<AIAnalysisPage />} />
      <Route path={webRoutes.admin} element={<SystemPage />} />
      <Route path={webRoutes.adminProfile} element={<ProfilePage />} />
    </Route>
    <Route path="/" element={<Navigate to={webRoutes.login} replace />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>;
}

