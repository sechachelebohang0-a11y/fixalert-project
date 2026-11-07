import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import PageHeader from '../components/PageHeader';

export default function Login({ staff = false }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user = await login(identifier, password);
      navigate(user.role === 'reporter' ? '/home' : '/staff', { replace: true });
    } catch (err) {
      setError(err.status === 401 ? 'Invalid login details.' : err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        back
        fallback="/"
        title={staff ? 'Staff login' : 'Welcome back'}
        subtitle={staff ? 'Sign in to manage reported problems' : 'Sign in to report a problem'}
      />
      <main className="body">
        <form className="card" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="identifier">{staff ? 'Staff ID' : 'Email'}</label>
            <input
              id="identifier"
              type={staff ? 'text' : 'email'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={staff ? 'Enter your staff ID' : 'name@email.com'}
              autoComplete="username"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <div className="alert alert-error" role="alert">{error}</div>}

          <button className="btn" type="submit" disabled={busy}>
            {busy ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div className="center muted">
          {staff ? (
            <Link className="link" to="/login">Back to reporter login</Link>
          ) : (
            <>
              <p>Don't have an account? <Link className="link" to="/signup">Sign up</Link></p>
              <p><Link className="link" to="/staff-login">Go to maintenance staff login</Link></p>
            </>
          )}
        </div>
      </main>
    </>
  );
}