import { PROBLEM_TYPES, STATUS_LABELS, STATUS_ICONS } from '../problemTypes';
import { timeAgo } from '../format';
import Icon from './Icon';

export default function ReportCard({ report, children }) {
  const type = PROBLEM_TYPES[report.problemType] || {
    label: report.problemType, icon: 'tool', tone: 'blue',
  };

  return (
    <article className="card report">
      <div className="report-head">
        <span className={`icon-badge tone-${type.tone}`}><Icon name={type.icon} /></span>
        <div className="meta">
          <strong>{type.label}</strong>
          <span className="report-loc"><Icon name="pin" size={13} /> {report.location}</span>
        </div>
        <span className={`chip chip-${report.status}`}>
          <Icon name={STATUS_ICONS[report.status]} size={13} /> {STATUS_LABELS[report.status]}
        </span>
      </div>
      <p className="report-desc">{report.description}</p>
      <div className="report-foot muted">
        <span>Reported {timeAgo(report.createdAt)}</span>
        {report.status === 'fixed' && report.fixedAt && <span>Fixed {timeAgo(report.fixedAt)}</span>}
      </div>
      {children}
    </article>
  );
}