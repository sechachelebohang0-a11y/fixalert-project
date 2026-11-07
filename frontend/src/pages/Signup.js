import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import PageHeader from '../components/PageHeader';

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(fullName, email, password);
      navigate('/home', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader back fallback="/login" title="Create account" subtitle="Sign up to report problems" />
      <main className="body">
        <form className="card" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="fullName">Full name</label>
            <input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name" autoComplete="name" required />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="name@email.com" autoComplete="email" required />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} minLength={8}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters" autoComplete="new-password" required />
          </div>

          {error && <div className="alert alert-error" role="alert">{error}</div>}

          <button className="btn" type="submit" disabled={busy}>
            {busy ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="center muted">
          Already have an account? <Link className="link" to="/login">Log in</Link>
        </p>
      </main>
    </>
  );
}