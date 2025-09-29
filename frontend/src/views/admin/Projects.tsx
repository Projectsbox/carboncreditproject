import { useEffect, useState } from 'react';
import { useAuth } from '../../state/auth';
import { api } from '../../lib/api';
import { DataTable } from '../../components/DataTable';

type Project = { id: string; name: string; status: string; type: string; creator: { email: string } };

export function AdminProjects() {
  const { token } = useAuth();
  const [status, setStatus] = useState<string>('');
  const [rows, setRows] = useState<Project[]>([]);
  useEffect(() => { if (!token) return; (async () => {
    const q = status ? `?status=${status}` : '';
    const data = await api<Project[]>(`/api/admin/projects${q}`, { token });
    setRows(data);
  })(); }, [token, status]);
  return (
    <div className="p-2 md:p-4 space-y-4">
      <div className="flex items-center gap-2">
        <span>Status:</span>
        <select className="rounded border border-white/10 bg-white/5 px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="PENDING_VALIDATION">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>
      <DataTable
        columns={[
          { key: 'id', header: 'ID', render: (r: any) => r.id.slice(0,8) },
          { key: 'name', header: 'Name' },
          { key: 'type', header: 'Type' },
          { key: 'status', header: 'Status' },
          { key: 'creator', header: 'Creator', render: (r: Project) => r.creator?.email },
        ]}
        data={rows as any}
      />
    </div>
  );
}


