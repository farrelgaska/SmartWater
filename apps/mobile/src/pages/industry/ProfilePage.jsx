import { useEffect, useState } from 'react';
import { Building2, CheckCircle2, LogOut, MapPin, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/common/PageContainer.jsx';
import LoadingState from '../../components/feedback/LoadingState.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import { getIndustryDashboard } from '../../services/monitoringService.js';

export default function ProfilePage() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    let active = true;
    getIndustryDashboard().then((data) => active && setDashboard(data)).catch(() => active && setError('Profil belum dapat dimuat.'));
    return () => { active = false; };
  }, []);
  if (error) return <PageContainer><ErrorState message={error} /></PageContainer>;
  if (!dashboard) return <PageContainer><LoadingState label="Memuat profil" /></PageContainer>;
  return <PageContainer>
    <header className="profile-page-header"><p className="profile-eyebrow">SmartWater</p><h1>Profil</h1><p>Informasi akun dan lokasi industri.</p></header>
    <section className="profile-identity-card" aria-labelledby="profile-identity-title"><div className="profile-avatar"><UserRound size={25} aria-hidden="true" /></div><div><h2 id="profile-identity-title">Pak Budi</h2><p>Pengguna Industri · Pemilik Batik</p></div><span className="profile-active"><CheckCircle2 size={14} aria-hidden="true" /> Aktif</span></section>
    <section className="profile-info-card" aria-labelledby="profile-business-title"><h2 id="profile-business-title">Identitas Industri</h2><dl><div><dt><Building2 size={16} aria-hidden="true" /> Nama Industri</dt><dd>{dashboard.industry.name}</dd></div><div><dt><MapPin size={16} aria-hidden="true" /> Lokasi</dt><dd>{dashboard.industry.city}</dd></div><div><dt>Stasiun terpantau</dt><dd>{dashboard.station.name}</dd></div><div><dt>Perangkat IoT</dt><dd>{dashboard.station.deviceId.toUpperCase()}</dd></div><div><dt>Status akun</dt><dd>Aktif</dd></div></dl></section>
    <p className="profile-note">Lokasi pemantauan dan perangkat terhubung ke akun industri ini.</p>
    <button type="button" className="profile-action-button" onClick={() => navigate('/login', { replace: true })}><LogOut size={17} aria-hidden="true" />Keluar</button>
  </PageContainer>;
}

