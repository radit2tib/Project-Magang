import React from 'react';
import { Navigate } from 'react-router-dom';

const MahasiswaProtectedRoute = ({ children }) => {
  // 1. Periksa apakah ada token login mahasiswa di penyimpanan browser
  const token = localStorage.getItem('mahasiswaAuthToken');

  // 2. Jika TIDAK ADA token, alihkan pengguna kembali ke halaman login mahasiswa
  if (!token) {
    return <Navigate to="/mahasiswa/login" />;
  }

  // 3. Jika ADA token, tampilkan halaman yang dilindungi (misalnya Dashboard atau Form Profil)
  return children;
};

export default MahasiswaProtectedRoute;

