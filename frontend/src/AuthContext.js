import { createContext, useContext, useState } from 'react';
import { api } from './api';

const AuthContext = createContext(null);
const STORAGE_KEY = 'fixalert-session';

function loadSession() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession);

  async function login(identifier, password) {
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: { identifier, password },
    });
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSession(data);
    return data.user;
  }

  async function register(fullName, email, password) {
    await api('/api/auth/register', {
      method: 'POST',
      body: { fullName, email, password },
    });
    return login(email, password);
  }

  function updateUser(changes) {
    if (!session) return;
    const next = { ...session, user: { ...session.user, ...changes } };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }

  const value = {
    user: session ? session.user : null,
    token: session ? session.token : null,
    login,
    register,
    updateUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}