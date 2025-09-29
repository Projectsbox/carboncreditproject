import { Outlet, NavLink } from 'react-router-dom';

export function RoleShell({ title, base }: { title: string; base: string }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr] bg-slate-950 text-slate-100">
      <aside className="border-r border-white/10 bg-slate-900/40">
        <div className="px-4 py-4 font-extrabold text-xl">{title}</div>
        <nav className="mt-2 px-2 space-y-1 text-sm">
          <NavLink to={base} end className={({ isActive }) => `block rounded px-3 py-2 ${isActive ? 'bg-primary/20' : 'hover:bg-white/5'}`}>Dashboard</NavLink>
          <NavLink to={`${base}/projects`} className={({ isActive }) => `block rounded px-3 py-2 ${isActive ? 'bg-primary/20' : 'hover:bg-white/5'}`}>Projects</NavLink>
          <NavLink to={`${base}/transactions`} className={({ isActive }) => `block rounded px-3 py-2 ${isActive ? 'bg-primary/20' : 'hover:bg-white/5'}`}>Transactions</NavLink>
          <NavLink to={`${base}/settings`} className={({ isActive }) => `block rounded px-3 py-2 ${isActive ? 'bg-primary/20' : 'hover:bg-white/5'}`}>Settings</NavLink>
        </nav>
      </aside>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}


