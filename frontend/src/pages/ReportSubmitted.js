import { Link, Navigate, useLocation } from 'react-router-dom';
import { STATUS_LABELS } from '../problemTypes';
import Icon from '../components/Icon';
import PageHeader from '../components/PageHeader';

export default function ReportSubmitted() {
  const { state } = useLocation();
  const report = state && state.report;

  if (!report) return <Navigate to="/home" replace />;

  return (
    <>
      <PageHeader back fallback="/home" title="Report submitted" subtitle="Your problem has been reported successfully" />
      <main className="body">
        <div className="card center">
          <div className="success-ring"><Icon name="check" size={46} /></div>
          <h2>Thank you!</h2>
          <p className="muted">
            Maintenance staff have been notified. Your report will be reviewed and handled.
          </p>
        </div>

        <div className="card report-head">
          <span className="icon-badge tone-light"><Icon name="clock" /></span>
          <div className="meta">
            <strong>Report status</strong>
            <span className="muted">We will notify you of every update</span>
          </div>
          <span className={`chip chip-${report.status}`}>{STATUS_LABELS[report.status]}</span>
        </div>

        <Link className="btn" to="/home"><Icon name="home" size={18} /> Back to home</Link>
        <Link className="btn btn-ghost" to="/my-reports">View my reports</Link>
      </main>
    </>
  );
}