import { useEffect, useState } from 'react';
import { AlertTriangle, ArrowLeft, CheckCircle2, Clock3, Droplets, Info, MapPin, Thermometer, Waves } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import PageContainer from '../../components/common/PageContainer.jsx';
import LoadingState from '../../components/feedback/LoadingState.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import { getAlert, updateAlertStatus } from '../../services/alertsService.js';
import { mobileRoutes } from '../../routes/routePaths.js';

const severityLabels = { critical: 'MERAH', warning: 'AMBER' };
const lifecycleLabels = { new: 'BARU', acknowledged: 'DIKETAHUI', resolved: 'SELESAI' };

export default function AlertDetailPage() {
  const { alertId } = useParams();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    getAlert(alertId).then((data) => {
      if (active) {
        setAlert(data);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, [alertId]);

  async function handleStatusChange(nextStatus) {
    setUpdating(true);
    setMessage('');
    try {
      await updateAlertStatus(alertId, nextStatus);
      setAlert((prev) => ({ ...prev, status: nextStatus }));
      setMessage(nextStatus === 'acknowledged' ? 'Peringatan telah ditandai diketahui.' : 'Peringatan telah ditandai selesai.');
    } catch {
      setMessage('Gagal memperbarui status peringatan.');
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <PageContainer><LoadingState label="Memuat detail peringatan" /></PageContainer>;
  if (!alert) return <PageContainer><ErrorState message="Peringatan tidak ditemukan atau tidak dapat diakses." /></PageContainer>;

  const ParameterIcon = alert.parameterKeys[0] === 'temperature' ? Thermometer : alert.parameterKeys[0] === 'turbidity' ? Waves : Droplets;

  return (
    <PageContainer>
      <header className="alert-detail-header"><Link className="alert-detail-back" to={mobileRoutes.alerts} aria-label="Kembali ke daftar peringatan"><ArrowLeft size={22} /></Link><div><p>Detail Peringatan</p><h1>#{alert.id}</h1></div></header>
      <section className={'alert-detail-hero alert-detail-hero-' + alert.severity} aria-labelledby="alert-detail-title"><div className="alert-detail-icon"><AlertTriangle size={26} aria-hidden="true" /></div><div><span className="alert-detail-severity">{severityLabels[alert.severity]}</span><h2 id="alert-detail-title">{alert.title}</h2></div></section>
      <div className="alert-detail-badges"><span className={'lifecycle-badge lifecycle-' + alert.status}>{lifecycleLabels[alert.status]}</span><span className="alert-detail-source">Early Warning System</span></div>
      <section className="alert-detail-card" aria-labelledby="context-title"><h2 id="context-title">Konteks Kejadian</h2><dl className="alert-detail-facts"><div><dt><ParameterIcon size={16} aria-hidden="true" /> Parameter</dt><dd>{alert.parameterLabel}</dd></div><div><dt><MapPin size={16} aria-hidden="true" /> Sensor</dt><dd>{alert.sensorLabel}</dd></div><div><dt><Clock3 size={16} aria-hidden="true" /> Waktu</dt><dd><time dateTime={alert.triggeredAt}>{alert.relativeTime}</time></dd></div>{alert.value !== null && <div><dt><Info size={16} aria-hidden="true" /> Pembacaan</dt><dd>{alert.value} {alert.unit}</dd></div>}</dl></section>
      <section className="alert-detail-card" aria-labelledby="message-title"><h2 id="message-title">Penjelasan</h2><p>{alert.message}</p></section>
      <section className="alert-detail-guidance" aria-labelledby="guidance-title"><Info size={20} aria-hidden="true" /><div><h2 id="guidance-title">Tindak Lanjut</h2><p>{alert.status === 'resolved' ? 'Peringatan ini telah ditandai selesai. Simpan konteks ini sebagai riwayat penanganan.' : 'Tinjau pembacaan terkait dan lakukan pemeriksaan lapangan sesuai prosedur internal. Keputusan dan tindakan tetap dilakukan oleh operator.'}</p></div></section>
      {alert.status !== 'resolved' && (
        <div className="alert-detail-actions" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          {alert.status === 'new' && (
            <button type="button" className="ai-review-button" style={{ flex: 1 }} disabled={updating} onClick={() => handleStatusChange('acknowledged')}>
              Tandai Diketahui
            </button>
          )}
          <button type="button" className="ai-review-button" style={{ flex: 1, backgroundColor: '#10b981' }} disabled={updating} onClick={() => handleStatusChange('resolved')}>
            <CheckCircle2 size={16} style={{ marginRight: '4px' }} /> Tandai Selesai
          </button>
        </div>
      )}
      {message && <p className="ai-checklist-message" style={{ marginTop: '0.75rem', textAlign: 'center' }} role="status">{message}</p>}
    </PageContainer>
  );
}

