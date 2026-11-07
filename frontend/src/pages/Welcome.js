import { Link } from 'react-router-dom';
import Icon from '../components/Icon';

export default function Welcome() {
  return (
    <main className="welcome">
      <div className="logo"><Icon name="zap" size={42} /></div>
      <h1>FIXALERT</h1>
      <p className="tagline">Report it. Alert them. Fix it.</p>

      <div className="glass-row">
        <div className="glass"><Icon name="bulb" size={42} /></div>
        <div className="glass"><Icon name="flame" size={42} /></div>
      </div>

      <p className="lead">
        Quickly notify maintenance staff when lights and heaters need fixing, and track
        every report until it is solved.
      </p>

      <div className="spacer" />
      <Link className="btn btn-light" to="/login">Get started</Link>
      <p className="welcome-foot"><Link to="/staff-login">Maintenance staff login</Link></p>
    </main>
  );
}