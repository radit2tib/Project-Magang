// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // ✅ Gunakan nama yang sama dengan di AdminLogin.jsx
  const token = localStorage.getItem('adminAuthToken');

  // Jika tidak ada token, arahkan ke halaman login admin
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Jika token ada, izinkan akses ke halaman child
  return children;
};

export default ProtectedRoute;
