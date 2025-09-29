import { useEffect, useState } from 'react';
import { useAuth } from '../../state/auth';
import { api } from '../../lib/api';
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line, BarChart, Bar } from 'recharts';

type SeriesPoint = { month: string; approvedCredits: number; soldCredits: number; revenue: number };

export function AdminAnalytics() {
  const { token } = useAuth();
  const [series, setSeries] = useState<SeriesPoint[]>([]);
  useEffect(() => { if (!token) return; (async () => {
    const ts = await api<{ data: SeriesPoint[] }>('/api/admin/timeseries', { token });
    setSeries(ts.data);
  })(); }, [token]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2 md:p-4">
      <div className="rounded-xl bg-white/5 p-4 border border-white/10">
        <div className="mb-2 font-semibold">Credit Issuance Trend</div>
        <div className="h-72">
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
      <div className="rounded-xl bg-white/5 p-4 border border-white/10">
        <div className="mb-2 font-semibold">Sales (Credits)</div>
        <div className="h-72">
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
  );
}


