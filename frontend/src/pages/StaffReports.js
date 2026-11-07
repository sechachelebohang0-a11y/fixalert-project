import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { api } from '../api';
import { STATUS_FILTERS } from '../problemTypes';
import Icon from '../components/Icon';
import PageHeader from '../components/PageHeader';
import ReportCard from '../components/ReportCard';

export default function StaffReports() {
  const { token } = useAuth();
  const [reports, setReports] = useState(null);
  const [filter, setFilter] = useState('pending');
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    api('/api/staff/reports', { token }).then(setReports).catch((e) => setError(e.message));
  }, [token]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  async function act(report, action) {
    setBusyId(report.id);
    setError('');
    try {
      const updated = await api(`/api/staff/reports/${report.id}/${action}`, {
        method: 'POST',
        token,
      });
      setReports((list) => list.map((r) => (r.id === updated.id ? updated : r)));
      setToast(
        action === 'accept'
          ? 'Report accepted! The reporter was notified.'
          : 'Problem solved! The reporter was notified.'
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  const countOf = (key) =>
    reports ? reports.filter((r) => key === 'all' || r.status === key).length : 0;
  const shown = reports ? reports.filter((r) => filter === 'all' || r.status === filter) : [];

  return (
    <>
      <PageHeader back fallback="/staff" title="Reported problems" subtitle="Review, accept and resolve reports" />
      <main className="body">
        <div className="tabs">
          {STATUS_FILTERS.map(([key, label]) => (
            <button key={key} type="button"
              className={`tab ${filter === key ? 'active' : ''}`}
              onClick={() => setFilter(key)}>
              {label} ({countOf(key)})
            </button>
          ))}
        </div>

        {error && <div className="alert alert-error" role="alert">{error}</div>}
        {!reports && !error && (<><div className="skeleton" /><div className="skeleton" /></>)}

        {reports && shown.length === 0 && (
          <div className="card empty">
            <span className="icon-badge tone-green"><Icon name="check-circle" /></span>
            <p>Nothing to show here.</p>
          </div>
        )}

        {shown.map((r) => (
          <ReportCard key={r.id} report={r}>
            {r.status === 'pending' && (
              <div className="report-actions">
                <button type="button" className="btn btn-blue btn-sm"
                  disabled={busyId === r.id} onClick={() => act(r, 'accept')}>
                  Accept
                </button>
                <button type="button" className="btn btn-sm"
                  disabled={busyId === r.id} onClick={() => act(r, 'fix')}>
                  Mark as fixed
                </button>
              </div>
            )}
            {r.status === 'in_progress' && (
              <div className="report-actions single">
                <button type="button" className="btn btn-sm"
                  disabled={busyId === r.id} onClick={() => act(r, 'fix')}>
                  Mark as fixed
                </button>
              </div>
            )}
          </ReportCard>
        ))}
      </main>

      {toast && (
        <div className="toast" role="status">
          <span className="toast-icon"><Icon name="check-circle" /></span>
          {toast}
        </div>
      )}
    </>
  );
}