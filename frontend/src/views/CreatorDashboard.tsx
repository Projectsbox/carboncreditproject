import { motion } from 'framer-motion';
import { useAuth } from '../state/auth';
import { api } from '../lib/api';
import { useEffect, useState } from 'react';

type Project = {
  id: string;
  name: string;
  description: string;
  location: string;
  type: 'REFORESTATION' | 'RENEWABLE_ENERGY' | 'ENERGY_EFFICIENCY' | 'OTHER';
  pricePerCredit: number;
  status: string;
  estimatedCredits: number;
};

export function CreatorDashboard() {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState({ name: '', description: '', location: '', type: 'REFORESTATION', pricePerCredit: 10, estimatedCredits: 0 });

  async function loadMine() {
    if (!token) return;
    const data = await api<Project[]>('/api/projects/mine', { token });
    setProjects(data);
  }

  async function submitProject(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    await api('/api/projects', { method: 'POST', body: form, token });
    setForm({ name: '', description: '', location: '', type: 'REFORESTATION', pricePerCredit: 10, estimatedCredits: 0 });
    await loadMine();
  }

  useEffect(() => { loadMine(); }, [token]);

  return (
    <div className="p-6 space-y-6">
      <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }} className="text-3xl font-bold">
        Creator Dashboard
      </motion.h1>
      <form onSubmit={submitProject} className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-xl border border-white/10 p-4">
        {(
          [
            { name: 'name', label: 'Name', type: 'text' },
            { name: 'location', label: 'Location', type: 'text' },
            { name: 'pricePerCredit', label: 'Price per Credit', type: 'number' },
            { name: 'estimatedCredits', label: 'Estimated Credits', type: 'number' },
          ] as const
        ).map((f) => (
          <label key={f.name} className="text-sm space-y-1">
            <span className="text-slate-400">{f.label}</span>
            <input
              className="w-full rounded border border-white/10 bg-white/5 px-3 py-2"
              type={f.type}
              value={(form as any)[f.name]}
              onChange={(e) => setForm({ ...form, [f.name]: f.type === 'number' ? Number(e.target.value) : e.target.value })}
              required
            />
          </label>
        ))}
        <label className="text-sm space-y-1 md:col-span-2">
          <span className="text-slate-400">Description</span>
          <textarea className="w-full rounded border border-white/10 bg-white/5 px-3 py-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </label>
        <label className="text-sm space-y-1">
          <span className="text-slate-400">Type</span>
          <select className="w-full rounded border border-white/10 bg-white/5 px-3 py-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {['REFORESTATION', 'RENEWABLE_ENERGY', 'ENERGY_EFFICIENCY', 'OTHER'].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
        <div className="md:col-span-2">
          <button className="rounded bg-primary px-4 py-2 text-slate-900 font-semibold">Submit Project</button>
        </div>
      </form>
      <div className="rounded-xl border border-white/10 p-4">
        <div className="mb-2 font-semibold">My Projects</div>
        <ul className="space-y-2">
          {projects.map((p) => (
            <li key={p.id} className="rounded border border-white/10 p-3">
              <div className="font-semibold">{p.name} <span className="text-xs text-slate-400">({p.status})</span></div>
              <div className="text-sm text-slate-400">{p.location} • {p.type} • ${Number(p.pricePerCredit).toFixed(2)}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


