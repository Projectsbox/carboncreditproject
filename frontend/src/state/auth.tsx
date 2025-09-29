import { createContext, useContext, useMemo, useState } from 'react';

type UserInfo = { id: string; email: string; fullName: string; role: 'CREATOR' | 'VALIDATOR' | 'BUYER' | 'ADMIN' } | null;

type AuthContextValue = {
  token: string | null;
  user: UserInfo;
  setAuth: (token: string, user: NonNullable<UserInfo>) => void;
  clear: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<UserInfo>(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const value = useMemo<AuthContextValue>(() => ({
    token,
    user,
    setAuth: (t, u) => {
      setToken(t);
      setUser(u);
      localStorage.setItem('token', t);
      localStorage.setItem('user', JSON.stringify(u));
    },
    clear: () => {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


