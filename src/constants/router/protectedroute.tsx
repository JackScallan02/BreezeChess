import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from '../../pages/Loading';

interface Props {
  children: React.ReactElement;
  requiresAuth?: boolean;
  allowNewUser?: boolean;
}

const ProtectedRoute: React.FC<Props> = ({ children, requiresAuth, allowNewUser }) => {
const { user, loading } = useAuth();
const location = useLocation();

  const isLoggedIn = !!user && Object.keys(user).length > 0;
  const isNewUser = user?.is_new_user;

    if (loading) {
    return <LoadingScreen />; // Or `null` or a spinner
  }

  if (requiresAuth && !isLoggedIn) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (isNewUser && !allowNewUser) {
    return <Navigate to="/welcome" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
