import { useState } from 'react';
import { ArrowRight, CircleHelp, Droplets, Eye, EyeOff, Globe2, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { webRoutes } from '../../routes/routePaths.js';

function resolveDevelopmentRole(identifier) {
  const value = identifier.trim().toLowerCase();
  if (/^(admin|administrator)(@|$)/.test(value)) return 'admin';
  if (/^dlh(@|$)/.test(value)) return 'dlh';
  return null;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!identifier.trim()) nextErrors.identifier = 'Email atau username wajib diisi.';
    if (!password) nextErrors.password = 'Password wajib diisi.';
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setMessage('Periksa kembali data yang wajib diisi.');
      return;
    }
    const role = resolveDevelopmentRole(identifier);
    if (!role) {
      setErrors({ identifier: 'Gunakan username Administrator atau DLH untuk demo lokal.' });
      setMessage('Akun demo tidak dikenali.');
      return;
    }
    setErrors({});
    setMessage('');
    setIsSubmitting(true);
    navigate(role === 'admin' ? webRoutes.admin : webRoutes.dlh, { replace: true });
  }

  return (
    <main className="login-shell">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand-mark" aria-hidden="true"><Droplets size={30} strokeWidth={2.5} /></div>
        <header className="login-heading"><h1 id="login-title">SmartWater Analytics Platform</h1><p>Pantau &amp; Kelola Kualitas Air Limbah Industri<br />Secara Real-Time</p></header>
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field"><label htmlFor="login-identifier">Email atau Username</label><div className="login-input-wrap"><UserRound size={19} aria-hidden="true" /><input id="login-identifier" name="identifier" type="text" autoComplete="username" placeholder="nama@perusahaan.com" value={identifier} onChange={(event) => setIdentifier(event.target.value)} aria-invalid={Boolean(errors.identifier)} aria-describedby={errors.identifier ? 'login-identifier-error' : undefined} /></div>{errors.identifier && <p className="login-error" id="login-identifier-error" role="alert">{errors.identifier}</p>}</div>
          <div className="login-field"><label htmlFor="login-password">Password</label><div className="login-input-wrap"><LockKeyhole size={19} aria-hidden="true" /><input id="login-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'login-password-error' : undefined} /><button className="login-icon-button" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button></div>{errors.password && <p className="login-error" id="login-password-error" role="alert">{errors.password}</p>}</div>
          <div className="login-options"><label className="login-remember"><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} /> <span>Ingat Saya</span></label><button className="login-link" type="button" onClick={() => setMessage('Hubungi IT Support untuk mengatur ulang akses Anda.')}>Lupa Password?</button></div>
          {message && <p className="login-form-message" role="status">{message}</p>}
          <button className="login-submit" type="submit" disabled={isSubmitting}>Masuk Ke Platform <ArrowRight size={19} aria-hidden="true" /></button>
        </form>
        <div className="login-support"><p>Butuh bantuan akses? <a href="mailto:it-support@smartwater.local">Hubungi IT Support</a></p><div className="login-utility" aria-label="Informasi bantuan dan keamanan"><CircleHelp size={16} aria-label="Bantuan" /><Globe2 size={16} aria-label="Bahasa" /><ShieldCheck size={16} aria-label="Keamanan" /></div></div>
      </section>
      <footer className="login-footer"><span>SMARTWATER ENVIRONMENT V4.2.0</span><small>Encrypted Industrial Data Stream • ISO 14001 Compliant</small></footer>
    </main>
  );
}
