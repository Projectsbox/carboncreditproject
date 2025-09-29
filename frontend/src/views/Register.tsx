import { useState } from 'react';
import { api } from '../lib/api';
import { useNavigate, Link } from 'react-router-dom';

export function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', fullName: '', role: 'BUYER' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api('/api/auth/register', { method: 'POST', body: form });
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md p-6 space-y-4">
      <h1 className="text-2xl font-bold">Register</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded border border-white/10 bg-white/5 px-3 py-2" placeholder="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
        <input className="w-full rounded border border-white/10 bg-white/5 px-3 py-2" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="w-full rounded border border-white/10 bg-white/5 px-3 py-2" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <select className="w-full rounded border border-white/10 bg-white/5 px-3 py-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          {['CREATOR', 'VALIDATOR', 'BUYER', 'ADMIN'].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        {error && <div className="text-sm text-red-400">{error}</div>}
        <button disabled={loading} className="w-full rounded bg-primary px-4 py-2 text-slate-900 font-semibold">{loading ? 'Registering...' : 'Register'}</button>
      </form>
      <div className="text-sm text-slate-400">Already have an account? <Link className="underline" to="/login">Login</Link></div>
    </div>
  );
}


