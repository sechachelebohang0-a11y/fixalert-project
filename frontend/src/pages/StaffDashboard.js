import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { api } from '../api';
import Icon from '../components/Icon';
import PageHeader from '../components/PageHeader';

export default function StaffDashboard() {
  const { user, token } = useAuth();
  const [counts, setCounts] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/api/staff/dashboard', { token }).then(setCounts).catch((e) => setError(e.message));
  }, [token]);

  const value = (n) => (counts ? n : '–');

  return (
    <>
      <PageHeader title="Maintenance dashboard" subtitle={`Manage and resolve problems, ${user.fullName}`} />
      <main className="body">
        {error && <div className="alert alert-error" role="alert">{error}</div>}

        <div className="stats">
          <div className="card stat pending"><strong>{value(counts && counts.pending)}</strong><span>Pending</span></div>
          <div className="card stat progress"><strong>{value(counts && counts.inProgress)}</strong><span>In progress</span></div>
          <div className="card stat fixed"><strong>{value(counts && counts.fixed)}</strong><span>Fixed</span></div>
        </div>

        <Link to="/staff/reports" className="card action">
          <span className="icon-badge tone-blue"><Icon name="clipboard" /></span>
          <span className="action-text">
            <strong>View reported problems</strong>
            <span>
              {counts
                ? `${counts.pending + counts.inProgress + counts.fixed} report(s) in total`
                : 'Loading...'}
            </span>
          </span>
          <Icon name="chevron-right" />
        </Link>
      </main>
    </>
  );
}