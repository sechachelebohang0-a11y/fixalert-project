import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { api } from '../api';
import { PROBLEM_TYPES } from '../problemTypes';
import Icon from '../components/Icon';
import PageHeader from '../components/PageHeader';

export default function Home() {
  const { user, token } = useAuth();
  const [reports, setReports] = useState(null);

  useEffect(() => {
    api('/api/reports/mine', { token }).then(setReports).catch(() => setReports(null));
  }, [token]);

  const count = (status) => (reports ? reports.filter((r) => r.status === status).length : '–');
  const firstName = user.fullName.split(' ')[0];

  return (
    <>
      <PageHeader title={`Hello, ${firstName}`} subtitle="What would you like to report?" />
      <main className="body">
        <div className="stats">
          <div className="card stat pending"><strong>{count('pending')}</strong><span>Pending</span></div>
          <div className="card stat progress"><strong>{count('in_progress')}</strong><span>In progress</span></div>
          <div className="card stat fixed"><strong>{count('fixed')}</strong><span>Fixed</span></div>
        </div>

        <h2 className="section-title">Report a problem</h2>
        {Object.entries(PROBLEM_TYPES).map(([type, info]) => (
          <Link key={type} to={`/report/${type}`} className="card action">
            <span className={`icon-badge tone-${info.tone}`}><Icon name={info.icon} /></span>
            <span className="action-text">
              <strong>{info.title}</strong>
              <span>{info.hint}</span>
            </span>
            <Icon name="chevron-right" />
          </Link>
        ))}

        <h2 className="section-title">Your activity</h2>
        <Link to="/my-reports" className="card action">
          <span className="icon-badge tone-blue"><Icon name="clipboard" /></span>
          <span className="action-text">
            <strong>My reports</strong>
            <span>View and track my reports</span>
          </span>
          <Icon name="chevron-right" />
        </Link>
        <Link to="/notifications" className="card action">
          <span className="icon-badge tone-green"><Icon name="bell" /></span>
          <span className="action-text">
            <strong>My notifications</strong>
            <span>Updates from maintenance staff</span>
          </span>
          <Icon name="chevron-right" />
        </Link>
      </main>
    </>
  );
}