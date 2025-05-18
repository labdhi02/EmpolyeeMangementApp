import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: 'admin' | 'employee' | 'both';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRole === 'both' || !user?.role) {
    // If role doesn't matter or we don't have role info, just check authentication
    return <>{children}</>;
  }

  if (allowedRole === 'admin' && user.role === 'admin') {
    // Admin route, user is admin
    return <>{children}</>;
  }

  if (allowedRole === 'employee' && user.role === 'employee') {
    // Employee route, user is employee
    return <>{children}</>;
  }

  // User doesn't have the required role
  return user.role === 'admin' ? 
    <Navigate to="/admin-dashboard" replace /> : 
    <Navigate to="/employee-dashboard" replace />;
};

export default ProtectedRoute;
