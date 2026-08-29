import { Navigate, Route, Routes } from 'react-router-dom';
import { mobileRoutes } from './routes/routePaths.js';
import AuthLayout from './layouts/AuthLayout.jsx';
import IndustryLayout from './layouts/IndustryLayout.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import IndustryPage from './pages/industry/IndustryPage.jsx';
import MonitoringPage from './pages/industry/MonitoringPage.jsx';
import AlertsPage from './pages/industry/AlertsPage.jsx';
import AlertDetailPage from './pages/industry/AlertDetailPage.jsx';
import AIAnalysisPage from './pages/industry/AIAnalysisPage.jsx';
import ProfilePage from './pages/industry/ProfilePage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}><Route path={mobileRoutes.login} element={<LoginPage />} /></Route>
      <Route element={<IndustryLayout />}>
        <Route path={mobileRoutes.industry} element={<IndustryPage />} />
        <Route path={mobileRoutes.monitoring} element={<MonitoringPage />} />
        <Route path={mobileRoutes.alerts} element={<AlertsPage />} />
        <Route path={mobileRoutes.alertDetail} element={<AlertDetailPage />} />
        <Route path={mobileRoutes.aiAnalysis} element={<AIAnalysisPage />} />
        <Route path={mobileRoutes.profile} element={<ProfilePage />} />
      </Route>
      <Route path="/" element={<Navigate to={mobileRoutes.login} replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

