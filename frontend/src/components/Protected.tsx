import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../state/auth';

type ProtectedProps = {
  roles?: Array<'CREATOR' | 'VALIDATOR' | 'BUYER' | 'ADMIN'>;
};

function roleHome(role: 'CREATOR' | 'VALIDATOR' | 'BUYER' | 'ADMIN') {
  switch (role) {
    case 'CREATOR':
      return '/creator';
    case 'VALIDATOR':
      return '/validator';
    case 'BUYER':
      return '/buyer';
    case 'ADMIN':
    default:
      return '/';
  }
}

export function Protected({ roles }: ProtectedProps) {
  const { token, user } = useAuth();
  const location = useLocation();
  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={roleHome(user.role)} replace />;
  }
  return <Outlet />;
}

export { roleHome };


