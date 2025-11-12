import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import komponen-komponen yang akan digunakan sebagai halaman
// Path ini sekarang sudah benar sesuai struktur Anda
import AdminLogin from './components/AdminLogin';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import MahasiswaLogin from './components/MahasiswaLogin';
import MahasiswaDashboard from './components/MahasiswaDashboard';
import MahasiswaProtectedRoute from './components/MahasiswaProtectedRoute';
import MahasiswaRegister from './components/MahasiswaRegister';
import MahasiswaProfileForm from './components/MahasiswaProfileForm';


function App() {
  return (
    <Router>
      <Routes>
        {/* Rute Default: Arahkan ke halaman login mahasiswa sebagai halaman utama */}
        <Route path="/" element={<Navigate to="/mahasiswa/login" />} />

        {/* --- RUTE UNTUK ADMIN --- */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* --- RUTE UNTUK MAHASISWA --- */}
        <Route path="/mahasiswa/login" element={<MahasiswaLogin />} />
        <Route path="/mahasiswa/register" element={<MahasiswaRegister />} />
        <Route 
          path="/mahasiswa/dashboard" 
          element={
            <MahasiswaProtectedRoute>
              <MahasiswaDashboard />
            </MahasiswaProtectedRoute>
          } 
        />
         <Route 
          path="/mahasiswa/lengkapi-profil" 
          element={
            <MahasiswaProtectedRoute>
              <MahasiswaProfileForm />
            </MahasiswaProtectedRoute>
          }
        />
        
        {/* Rute fallback jika halaman tidak ditemukan */}
        <Route path="*" element={
            <div className="flex h-screen items-center justify-center">
                <h1 className="text-3xl font-bold">404 - Halaman Tidak Ditemukan</h1>
            </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;

