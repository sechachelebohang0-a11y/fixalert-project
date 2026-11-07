import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { api } from '../api';
import { PROBLEM_TYPES } from '../problemTypes';
import Icon from '../components/Icon';
import PageHeader from '../components/PageHeader';

export default function ReportProblem() {
  const { type } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const info = PROBLEM_TYPES[type];
  if (!info) return <Navigate to="/home" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const report = await api('/api/reports', {
        method: 'POST',
        token,
        body: { problemType: type, location, description },
      });
      navigate('/report-submitted', { state: { report }, replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader back fallback="/home" title={info.title} subtitle="Tell maintenance staff what needs fixing" />
      <main className="body">
        <form className="card" onSubmit={handleSubmit}>
          <span className={`type-chip tone-${info.tone}`}>
            <Icon name={info.icon} size={18} /> Problem type: {info.label}
          </span>

          <div className="field">
            <label htmlFor="location">Where is the problem?</label>
            <input id="location" value={location} maxLength={150}
              placeholder="Enter building or room"
              onChange={(e) => setLocation(e.target.value)} required />
          </div>

          <div className="field">
            <label htmlFor="description">Describe the problem</label>
            <textarea id="description" value={description} maxLength={1000}
              placeholder="Explain what is wrong"
              onChange={(e) => setDescription(e.target.value)} required />
          </div>

          {error && <div className="alert alert-error" role="alert">{error}</div>}

          <button className="btn" type="submit" disabled={busy}>
            {busy ? 'Submitting...' : 'Submit report'}
          </button>
        </form>
      </main>
    </>
  );
}