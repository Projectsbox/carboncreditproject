import { useState } from 'react';
import { useAuth } from '../state/auth';
import { api } from '../lib/api';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { roleHome } from '../components/Protected';

export function Login() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api<{ token: string; user: any }>('/api/auth/login', { method: 'POST', body: { email, password } });
      setAuth(res.token, res.user);
      const dest = location.state?.from?.pathname || roleHome(res.user.role);
      navigate(dest, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md p-6 space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded border border-white/10 bg-white/5 px-3 py-2" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full rounded border border-white/10 bg-white/5 px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <div className="text-sm text-red-400">{error}</div>}
        <button disabled={loading} className="w-full rounded bg-primary px-4 py-2 text-slate-900 font-semibold">{loading ? 'Signing in...' : 'Login'}</button>
      </form>
      <div className="text-sm text-slate-400">No account? <Link className="underline" to="/register">Register</Link></div>
    </div>
  );
}


