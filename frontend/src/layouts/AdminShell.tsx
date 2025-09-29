import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../state/auth';

export function AdminShell() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[260px_1fr] bg-slate-950 text-slate-100">
      <aside className="border-r border-white/10 bg-slate-900/40">
        <div className="px-4 py-4 font-extrabold text-xl">CarbonChain</div>
        <div className="px-4 text-sm text-slate-400">{user?.fullName} • {user?.role}</div>
        <nav className="mt-4 px-2 space-y-1">
          {[
            { to: '/admin', label: 'Overview' },
            { to: '/admin/projects', label: 'Projects' },
            { to: '/admin/transactions', label: 'Transactions' },
            { to: '/admin/analytics', label: 'Analytics' },
            { to: '/admin/settings', label: 'Settings' },
          ].map((l) => (
            <NavLink key={l.to} to={l.to} end className={({ isActive }) => `block rounded px-3 py-2 ${isActive ? 'bg-primary/20 text-primary-50' : 'hover:bg-white/5'}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}


