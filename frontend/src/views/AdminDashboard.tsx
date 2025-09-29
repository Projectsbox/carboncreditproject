import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { StatCard } from '../components/StatCard';
import { DataTable } from '../components/DataTable';
import { useEffect, useState } from 'react';
import { useAuth } from '../state/auth';
import { api } from '../lib/api';

type Overview = { totals: { totalProjects: number; pending: number; approved: number; rejected: number; totalIssued: number; totalCreditsSold: number; totalRevenue: number; transactionsCount: number } };
type TxRow = { id: string; credits: number; totalPrice: number; project: { name: string }; buyer: { email: string } };
type SeriesPoint = { month: string; approvedCredits: number; soldCredits: number; revenue: number };

export function AdminDashboard() {
  const { token } = useAuth();
  const [ov, setOv] = useState<Overview | null>(null);
  const [recent, setRecent] = useState<TxRow[]>([]);
  const [series, setSeries] = useState<SeriesPoint[]>([]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      const [o, tx, ts] = await Promise.all([
        api<Overview>('/api/admin/overview', { token }),
        api<TxRow[]>('/api/admin/transactions?limit=5', { token }),
        api<{ data: SeriesPoint[] }>('/api/admin/timeseries', { token }),
      ]);
      setOv(o);
      setRecent(tx);
      setSeries(ts.data);
    })();
  }, [token]);

  return (
    <div className="p-6 space-y-6">
      <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="text-3xl font-bold">
        Admin Overview
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Projects" value={ov?.totals.totalProjects ?? '—'} />
        <StatCard label="Issued Credits" value={(ov?.totals.totalIssued ?? 0).toLocaleString()} delay={0.1} />
        <StatCard label="Revenue (USD)" value={`$${(ov?.totals.totalRevenue ?? 0).toLocaleString()}`} delay={0.2} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-white/5 p-4 shadow border border-white/10">
          <div className="mb-2 font-semibold">Credit Issuance Trend</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Line type="monotone" dataKey="approvedCredits" stroke="#22d3ee" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl bg-white/5 p-4 shadow border border-white/10">
          <div className="mb-2 font-semibold">Sales by Month</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series}>
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Bar dataKey="soldCredits" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="rounded-xl bg-white/5 p-4 shadow border border-white/10">
        <div className="mb-2 font-semibold">Recent Transactions</div>
        <DataTable
          columns={[
            { key: 'id', header: 'ID', render: (r: any) => r.id.slice(0, 8) },
            { key: 'project', header: 'Project', render: (r: TxRow) => r.project?.name },
            { key: 'buyer', header: 'Buyer', render: (r: TxRow) => r.buyer?.email },
            { key: 'credits', header: 'Credits' },
            { key: 'totalPrice', header: 'Total (USD)', render: (r: TxRow) => `$${Number(r.totalPrice).toFixed(2)}` },
          ]}
          data={recent as any}
        />
      </div>
    </div>
  );
}


