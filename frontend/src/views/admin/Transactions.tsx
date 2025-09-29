import { useEffect, useState } from 'react';
import { useAuth } from '../../state/auth';
import { api } from '../../lib/api';
import { DataTable } from '../../components/DataTable';

type Tx = { id: string; credits: number; totalPrice: number; buyer: { email: string }; project: { name: string }; createdAt: string };

export function AdminTransactions() {
  const { token } = useAuth();
  const [rows, setRows] = useState<Tx[]>([]);
  useEffect(() => { if (!token) return; (async () => {
    const data = await api<Tx[]>('/api/admin/transactions?limit=100', { token });
    setRows(data);
  })(); }, [token]);
  return (
    <div className="p-2 md:p-4 space-y-4">
      <DataTable
        columns={[
          { key: 'id', header: 'ID', render: (r: any) => r.id.slice(0,8) },
          { key: 'project', header: 'Project', render: (r: Tx) => r.project?.name },
          { key: 'buyer', header: 'Buyer', render: (r: Tx) => r.buyer?.email },
          { key: 'credits', header: 'Credits' },
          { key: 'totalPrice', header: 'Total (USD)', render: (r: Tx) => `$${Number(r.totalPrice).toFixed(2)}` },
          { key: 'createdAt', header: 'Date', render: (r: Tx) => new Date(r.createdAt).toLocaleString() },
        ]}
        data={rows as any}
      />
    </div>
  );
}


