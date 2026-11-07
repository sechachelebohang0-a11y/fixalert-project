import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { api } from '../api';
import { STATUS_FILTERS } from '../problemTypes';
import Icon from '../components/Icon';
import PageHeader from '../components/PageHeader';
import ReportCard from '../components/ReportCard';

export default function MyReports() {
  const { token } = useAuth();
  const [reports, setReports] = useState(null);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    api('/api/reports/mine', { token }).then(setReports).catch((e) => setError(e.message));
  }, [token]);

  const shown = reports ? reports.filter((r) => filter === 'all' || r.status === filter) : [];

  return (
    <>
      <PageHeader back fallback="/home" title="My reports" subtitle="Track every problem you reported" />
      <main className="body">
        <div className="tabs">
          {STATUS_FILTERS.map(([key, label]) => (
            <button key={key} type="button"
              className={`tab ${filter === key ? 'active' : ''}`}
              onClick={() => setFilter(key)}>
              {label}
            </button>
          ))}
        </div>

        {error && <div className="alert alert-error" role="alert">{error}</div>}
        {!reports && !error && (<><div className="skeleton" /><div className="skeleton" /></>)}

        {reports && shown.length === 0 && (
          <div className="card empty">
            <span className="icon-badge tone-blue"><Icon name="clipboard" /></span>
            <p>No reports here yet.</p>
          </div>
        )}

        {shown.map((r) => <ReportCard key={r.id} report={r} />)}
      </main>
    </>
  );
}