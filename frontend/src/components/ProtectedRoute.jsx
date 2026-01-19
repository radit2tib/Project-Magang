import React from 'react';
import { Navigate } from 'react-router-dom';

// Komponen ini menerima 'children' (halaman tujuan) dan 'allowedRole' (siapa yang boleh masuk)
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // Pastikan saat Login kamu simpan 'role' ke localStorage

  // 1. Cek Login: Kalau tidak ada token, tendang keluar
  if (!token) {
    // Jika user mencoba akses halaman admin tanpa login, arahkan ke login admin
    if (allowedRole === 'admin') {
      return <Navigate to="/admin/login" replace />;
    }
    // Default ke login mahasiswa
    return <Navigate to="/mahasiswa/login" replace />;
  }

  // 2. Cek Role: Kalau token ada, tapi ROLE salah (Mahasiswa nyasar ke Admin)
  if (allowedRole && userRole !== allowedRole) {
    console.warn(`Akses Ditolak! Role kamu: ${userRole}, Butuh: ${allowedRole}`);
    
    // Kembalikan mereka ke dashboard yang benar sesuai role asli mereka
    if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/mahasiswa/dashboard" replace />;
    }
  }

  // 3. Jika Token Ada & Role Cocok -> Silakan masuk
  return children;
};

export default ProtectedRoute;