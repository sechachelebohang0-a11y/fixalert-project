import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { api } from '../api';
import Icon from '../components/Icon';
import PageHeader from '../components/PageHeader';

const ROLE_LABELS = {
  reporter: 'Reporter',
  staff: 'Maintenance staff',
  admin: 'Administrator',
};

function Message({ message }) {
  if (!message) return null;
  return (
    <div
      className={`alert alert-${message.type}`}
      role={message.type === 'error' ? 'alert' : 'status'}
    >
      {message.text}
    </div>
  );
}

export default function Profile({ fallback = '/home' }) {
  const { token, updateUser, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadError, setLoadError] = useState('');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [infoMessage, setInfoMessage] = useState(null);
  const [infoBusy, setInfoBusy] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [passwordBusy, setPasswordBusy] = useState(false);

  useEffect(() => {
    api('/api/profile', { token })
      .then((p) => {
        setProfile(p);
        setFullName(p.fullName);
        setEmail(p.email || '');
      })
      .catch((e) => setLoadError(e.message));
  }, [token]);

  const emailChanging =
    profile &&
    email.trim() !== '' &&
    email.trim().toLowerCase() !== (profile.email || '');

  async function saveInfo(e) {
    e.preventDefault();
    setInfoMessage(null);
    setInfoBusy(true);
    try {
      const updated = await api('/api/profile', {
        method: 'PUT',
        token,
        body: { fullName, email, currentPassword: emailPassword || null },
      });
      setProfile(updated);
      setFullName(updated.fullName);
      setEmail(updated.email || '');
      setEmailPassword('');
      updateUser({ fullName: updated.fullName });
      setInfoMessage({ type: 'success', text: 'Profile updated.' });
    } catch (err) {
      setInfoMessage({ type: 'error', text: err.message });
    } finally {
      setInfoBusy(false);
    }
  }

  async function savePassword(e) {
    e.preventDefault();
    setPasswordMessage(null);
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'The new passwords do not match.' });
      return;
    }
    setPasswordBusy(true);
    try {
      await api('/api/profile/password', {
        method: 'PUT',
        token,
        body: { currentPassword, newPassword },
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMessage({ type: 'success', text: 'Password updated.' });
    } catch (err) {
      setPasswordMessage({ type: 'error', text: err.message });
    } finally {
      setPasswordBusy(false);
    }
  }

  const initials = profile
    ? profile.fullName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join('')
    : '';

  return (
    <>
      <PageHeader back fallback={fallback} title="My profile" subtitle="Update your details" />
      <main className="body">
        {loadError && <div className="alert alert-error" role="alert">{loadError}</div>}
        {!profile && !loadError && <div className="skeleton" />}

        {profile && (
          <>
            <div className="card report-head">
              <span className="avatar">{initials}</span>
              <div className="meta">
                <strong>{profile.fullName}</strong>
                <span className="muted">{ROLE_LABELS[profile.role] || profile.role}</span>
              </div>
            </div>

            <form className="card" onSubmit={saveInfo}>
              <h2 className="form-title">Personal details</h2>

              {profile.staffId && (
                <div className="field">
                  <label htmlFor="staffId">Staff ID</label>
                  <input id="staffId" value={profile.staffId} disabled />
                </div>
              )}

              <div className="field">
                <label htmlFor="fullName">Full name</label>
                <input id="fullName" value={fullName} maxLength={100}
                  onChange={(e) => setFullName(e.target.value)} required />
              </div>

              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={email} placeholder="name@email.com"
                  autoComplete="email" onChange={(e) => setEmail(e.target.value)} />
              </div>

              {emailChanging && (
                <div className="field">
                  <label htmlFor="emailPassword">Current password (needed to change email)</label>
                  <input id="emailPassword" type="password" value={emailPassword}
                    autoComplete="current-password"
                    onChange={(e) => setEmailPassword(e.target.value)} required />
                </div>
              )}

              <Message message={infoMessage} />
              <button className="btn" type="submit" disabled={infoBusy}>
                {infoBusy ? 'Saving...' : 'Save changes'}
              </button>
            </form>

            <form className="card" onSubmit={savePassword}>
              <h2 className="form-title">Change password</h2>

              <div className="field">
                <label htmlFor="currentPassword">Current password</label>
                <input id="currentPassword" type="password" value={currentPassword}
                  autoComplete="current-password"
                  onChange={(e) => setCurrentPassword(e.target.value)} required />
              </div>

              <div className="field">
                <label htmlFor="newPassword">New password</label>
                <input id="newPassword" type="password" value={newPassword} minLength={8}
                  placeholder="At least 8 characters" autoComplete="new-password"
                  onChange={(e) => setNewPassword(e.target.value)} required />
              </div>

              <div className="field">
                <label htmlFor="confirmPassword">Confirm new password</label>
                <input id="confirmPassword" type="password" value={confirmPassword} minLength={8}
                  autoComplete="new-password"
                  onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>

              <Message message={passwordMessage} />
              <button className="btn" type="submit" disabled={passwordBusy}>
                {passwordBusy ? 'Updating...' : 'Update password'}
              </button>
            </form>

            <button type="button" className="btn btn-ghost" onClick={logout}>
              <Icon name="log-out" size={18} /> Log out
            </button>
          </>
        )}
      </main>
    </>
  );
}