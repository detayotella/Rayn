import React from 'react';
import { Navigate, useLocation } from 'react-router';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

// Mock authentication check - replace with your actual auth logic
const useAuth = () => {
  // This is a placeholder - implement your actual authentication logic
  // For now, we'll assume user is authenticated if they have a username in localStorage
  const isAuthenticated = localStorage.getItem('username') !== null;
  return { isAuthenticated };
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = false 
}) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (requireAuth && !isAuthenticated) {
    // Redirect to onboarding with return url
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
