import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAuth } from '../state/auth';
import { api } from '../lib/api';

type Project = { id: string; name: string; pricePerCredit: number; status: string };
type Tx = { id: string; credits: number; totalPrice: number; createdAt: string; projectId: string };

export function BuyerDashboard() {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [mine, setMine] = useState<Tx[]>([]);
  const [buy, setBuy] = useState<{ projectId: string; credits: number }>({ projectId: '', credits: 0 });

  async function load() {
    if (!token) return;
    const ps = await api<Project[]>('/api/projects', { token });
    setProjects(ps.filter((p) => p.status === 'APPROVED'));
    const tx = await api<Tx[]>('/api/transactions/mine', { token });
    setMine(tx);
  }

  async function purchase(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !buy.projectId || buy.credits <= 0) return;
    await api('/api/transactions/purchase', { method: 'POST', body: buy, token });
    setBuy({ projectId: '', credits: 0 });
    await load();
  }

  useEffect(() => { load(); }, [token]);

  return (
    <div className="p-6 space-y-6">
      <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }} className="text-3xl font-bold">
        Buyer Dashboard
      </motion.h1>
      <form onSubmit={purchase} className="rounded-xl border border-white/10 p-4 grid grid-cols-1 md:grid-cols-3 gap-2">
        <select className="rounded border border-white/10 bg-white/5 px-3 py-2" value={buy.projectId} onChange={(e) => setBuy({ ...buy, projectId: e.target.value })}>
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name} (${Number(p.pricePerCredit).toFixed(2)})</option>
          ))}
        </select>
        <input className="rounded border border-white/10 bg-white/5 px-3 py-2" type="number" placeholder="Credits" value={buy.credits || ''} onChange={(e) => setBuy({ ...buy, credits: Number(e.target.value) })} />
        <button className="rounded bg-primary px-4 py-2 text-slate-900 font-semibold">Purchase</button>
      </form>
      <div className="rounded-xl border border-white/10 p-4">
        <div className="mb-2 font-semibold">My Purchases</div>
        <ul className="space-y-2">
          {mine.map((t) => (
            <li key={t.id} className="rounded border border-white/10 p-3">
              <div className="text-sm text-slate-400">{new Date(t.createdAt).toLocaleString()}</div>
              <div className="font-semibold">{t.credits} credits • ${Number(t.totalPrice).toFixed(2)}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


