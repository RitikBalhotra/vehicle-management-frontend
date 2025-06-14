import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../Hooks/useRedux';
import type { JSX } from '@emotion/react/jsx-runtime';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
