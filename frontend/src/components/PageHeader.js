import { useLocation, useNavigate } from 'react-router-dom';
import Icon from './Icon';

export default function PageHeader({ title, subtitle, back = false, fallback = '/' }) {
  const navigate = useNavigate();
  const location = useLocation();

  function goBack() {
    // location.key is "default" when the page was opened directly, so there is nothing to go back to
    if (location.key !== 'default') navigate(-1);
    else navigate(fallback, { replace: true });
  }

  return (
    <header className="hero">
      <div className="hero-top">
        {back ? (
          <button type="button" className="back-btn" onClick={goBack} aria-label="Go back">
            <Icon name="arrow-left" />
          </button>
        ) : (
          <span className="back-spacer" />
        )}
        <span className="brand-mark"><Icon name="zap" size={14} /> FIXALERT</span>
        <span className="back-spacer" />
      </div>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
}