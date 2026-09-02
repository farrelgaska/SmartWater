import { useEffect, useState } from 'react';
import { CheckCircle2, KeyRound, Mail, Pencil, Phone, UserRound, X } from 'lucide-react';
import PageContainer from '../../components/common/PageContainer.jsx';
import LoadingState from '../../components/feedback/LoadingState.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import { getAdminSystem } from '../../services/adminService.js';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [draft, setDraft] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    getAdminSystem().then((data) => { if (active) { const account = data.users.find((user) => user.role === 'Administrator') || data.users[0]; setProfile(account); setDraft({ name: account.name, email: account.email }); } }).catch(() => active && setError('Unable to load administrator profile.'));
    return () => { active = false; };
  }, []);

  if (error) return <PageContainer><ErrorState message={error} /></PageContainer>;
  if (!profile) return <PageContainer><LoadingState label="Loading administrator profile…" /></PageContainer>;

  const saveProfile = (event) => { event.preventDefault(); setProfile((current) => ({ ...current, ...draft })); setEditing(false); setMessage('Profile updated locally for this demo.'); };

  return <PageContainer><div className="profile-page"><header className="profile-page-header"><div><p className="eyebrow">ACCOUNT</p><h1>My Profile</h1><p>Review your administrator account details and local preferences.</p></div><span className="profile-status"><CheckCircle2 size={16} aria-hidden="true" />Active account</span></header><section className="profile-hero"><div className="profile-avatar-large">RP</div><div><h2>{profile.name}</h2><p>{profile.role}</p><span>{profile.email}</span></div></section><form className="profile-card" onSubmit={saveProfile}><div className="profile-card-heading"><div><p className="eyebrow">PERSONAL DETAILS</p><h2>Account information</h2></div>{!editing && <button type="button" className="profile-secondary-button" onClick={() => setEditing(true)}><Pencil size={15} aria-hidden="true" />Edit Profile</button>}</div><div className="profile-fields"><label><span>Full Name</span><div className="profile-input"><UserRound size={16} aria-hidden="true" /><input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} disabled={!editing} required /></div></label><label><span>Email</span><div className="profile-input"><Mail size={16} aria-hidden="true" /><input type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} disabled={!editing} required /></div></label><label><span>Phone Number</span><div className="profile-input"><Phone size={16} aria-hidden="true" /><input value="Not provided" disabled /></div></label><label><span>Role</span><div className="profile-input"><KeyRound size={16} aria-hidden="true" /><input value={profile.role} disabled /></div></label><label><span>Account Status</span><div className="profile-account-status"><CheckCircle2 size={16} aria-hidden="true" />Active</div></label></div>{editing && <div className="profile-form-actions"><button type="button" className="profile-secondary-button" onClick={() => { setDraft({ name: profile.name, email: profile.email }); setEditing(false); }}><X size={15} aria-hidden="true" />Cancel</button><button type="submit" className="profile-primary-button">Save Profile</button></div>}</form><section className="profile-card"><div className="profile-card-heading"><div><p className="eyebrow">SECURITY</p><h2>Password</h2></div><button type="button" className="profile-secondary-button" onClick={() => setPasswordMode((value) => !value)}><KeyRound size={15} aria-hidden="true" />Change Password</button></div>{passwordMode && <div className="profile-password-form"><label>Current Password<input type="password" autoComplete="current-password" /></label><label>New Password<input type="password" autoComplete="new-password" /></label><button type="button" className="profile-primary-button" onClick={() => { setPasswordMode(false); setMessage('Password change recorded locally for this demo.'); }}>Save Password</button></div>} {!passwordMode && <p className="profile-note">Password changes are local demo interactions only.</p>}</section>{message && <div className="admin-toast" role="status">{message}</div>}</div></PageContainer>;
}
