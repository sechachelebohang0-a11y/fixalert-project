import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { api } from '../api';
import { timeAgo } from '../format';
import Icon from '../components/Icon';
import PageHeader from '../components/PageHeader';

function look(title) {
  const t = title.toLowerCase();
  if (t.includes('fixed')) return ['check-circle', 'green'];
  if (t.includes('progress')) return ['tool', 'light'];
  return ['bell', 'blue'];
}

export default function Notifications() {
  const { token } = useAuth();
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/api/notifications', { token }).then(setItems).catch((e) => setError(e.message));
  }, [token]);

  return (
    <>
      <PageHeader back fallback="/home" title="Notifications" subtitle="Updates on your reports" />
      <main className="body">
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        {!items && !error && (<><div className="skeleton" /><div className="skeleton" /></>)}

        {items && items.length === 0 && (
          <div className="card empty">
            <span className="icon-badge tone-blue"><Icon name="bell" /></span>
            <p>No notifications yet.</p>
          </div>
        )}

        {items && items.map((n) => {
          const [icon, tone] = look(n.title);
          return (
            <div key={n.id} className="card report-head">
              <span className={`icon-badge tone-${tone}`}><Icon name={icon} /></span>
              <div className="meta">
                <strong>{n.title}</strong>
                <span className="muted">{n.message}</span>
                <span className="muted">{timeAgo(n.createdAt)}</span>
              </div>
            </div>
          );
        })}
      </main>
    </>
  );
}