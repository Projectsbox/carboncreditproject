import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAuth } from '../state/auth';
import { api } from '../lib/api';

type PendingProject = { id: string; name: string; estimatedCredits: number; location: string };

export function ValidatorDashboard() {
  const { token } = useAuth();
  const [pending, setPending] = useState<PendingProject[]>([]);
  const [decision, setDecision] = useState<{ [id: string]: { status: 'APPROVED' | 'REJECTED'; notes?: string; approvedCredits?: number } }>({});

  async function loadPending() {
    if (!token) return;
    const data = await api<PendingProject[]>('/api/validations/pending', { token });
    setPending(data);
  }

  async function decide(projectId: string) {
    if (!token) return;
    const d = decision[projectId] || { status: 'APPROVED' as const };
    const payload: any = { status: d.status, notes: d.notes };
    if (d.approvedCredits !== undefined && Number.isFinite(d.approvedCredits)) {
      payload.approvedCredits = Number(d.approvedCredits);
    }
    await api(`/api/validations/${projectId}/decide`, { method: 'POST', body: payload, token });
    await loadPending();
  }

  useEffect(() => { loadPending(); }, [token]);

  return (
    <div className="p-6 space-y-6">
      <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }} className="text-3xl font-bold">
        Validator Dashboard
      </motion.h1>
      <div className="rounded-xl border border-white/10 p-4 space-y-3">
        <div className="font-semibold">Pending Projects</div>
        {pending.length === 0 && <div className="text-slate-400">No pending projects.</div>}
        {pending.map((p) => (
          <div key={p.id} className="rounded border border-white/10 p-3">
            <div className="font-semibold">{p.name} <span className="text-xs text-slate-400">({p.location})</span></div>
            <div className="text-sm text-slate-400">Estimated credits: {p.estimatedCredits}</div>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
              <select className="rounded border border-white/10 bg-white/5 px-3 py-2" value={decision[p.id]?.status || 'APPROVED'} onChange={(e) => setDecision({ ...decision, [p.id]: { ...(decision[p.id] || {}), status: e.target.value as any } })}>
                <option value="APPROVED">Approve</option>
                <option value="REJECTED">Reject</option>
              </select>
              <input className="rounded border border-white/10 bg-white/5 px-3 py-2" placeholder="Approved credits (optional)" type="number" value={decision[p.id]?.approvedCredits ?? ''} onChange={(e) => {
                const v = e.target.value;
                setDecision({ ...decision, [p.id]: { ...(decision[p.id] || {}), approvedCredits: v === '' ? undefined : Number(v) } })
              }} />
              <input className="rounded border border-white/10 bg-white/5 px-3 py-2 md:col-span-1" placeholder="Notes (optional)" value={decision[p.id]?.notes ?? ''} onChange={(e) => setDecision({ ...decision, [p.id]: { ...(decision[p.id] || {}), notes: e.target.value } })} />
            </div>
            <div className="mt-2">
              <button onClick={() => decide(p.id)} className="rounded bg-primary px-4 py-2 text-slate-900 font-semibold">Submit Decision</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


