import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import { AdminDashboard } from './views/AdminDashboard';
import { AdminProjects } from './views/admin/Projects';
import { AdminTransactions } from './views/admin/Transactions';
import { AdminAnalytics } from './views/admin/Analytics';
import { AdminSettings } from './views/admin/Settings';
import { CreatorDashboard } from './views/CreatorDashboard';
import { ValidatorDashboard } from './views/ValidatorDashboard';
import { BuyerDashboard } from './views/BuyerDashboard';
import { Login } from './views/Login';
import { Register } from './views/Register';
import { Protected } from './components/Protected';
import Landing from './views/Landing';
import { AdminShell } from './layouts/AdminShell';
import { RoleShell } from './layouts/RoleShell';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'admin', element: <Protected roles={['ADMIN']} />, children: [
        { element: <AdminShell />, children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'projects', element: <AdminProjects /> },
          { path: 'transactions', element: <AdminTransactions /> },
          { path: 'analytics', element: <AdminAnalytics /> },
          { path: 'settings', element: <AdminSettings /> },
        ] }
      ] },
      { path: 'creator', element: <Protected roles={['CREATOR','ADMIN']} />, children: [
        { element: <RoleShell title="Creator" base="/creator" />, children: [ { index: true, element: <CreatorDashboard /> } ] }
      ] },
      { path: 'validator', element: <Protected roles={['VALIDATOR','ADMIN']} />, children: [
        { element: <RoleShell title="Validator" base="/validator" />, children: [ { index: true, element: <ValidatorDashboard /> } ] }
      ] },
      { path: 'buyer', element: <Protected roles={['BUYER','ADMIN']} />, children: [
        { element: <RoleShell title="Buyer" base="/buyer" />, children: [ { index: true, element: <BuyerDashboard /> } ] }
      ] },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}


