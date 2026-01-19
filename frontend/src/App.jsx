import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import komponen halaman
import AdminLogin from './components/AdminLogin';
import Dashboard from './components/Dashboard';
import MahasiswaLogin from './components/MahasiswaLogin';
import MahasiswaDashboard from './components/MahasiswaDashboard';
import MahasiswaRegister from './components/MahasiswaRegister';
import MahasiswaProfileForm from './components/MahasiswaProfileForm';

// HANYA BUTUH SATU PROTECTED ROUTE
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute Default */}
        <Route path="/" element={<Navigate to="/mahasiswa/login" />} />

        {/* --- RUTE UNTUK ADMIN --- */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route 
          path="/admin/dashboard" 
          element={
            // KITA KUNCI KHUSUS ADMIN
            <ProtectedRoute allowedRole="admin">
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
            // KITA KUNCI KHUSUS MAHASISWA
            <ProtectedRoute allowedRole="mahasiswa">
              <MahasiswaDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/mahasiswa/lengkapi-profil" 
          element={
            // KITA KUNCI KHUSUS MAHASISWA
            <ProtectedRoute allowedRole="mahasiswa">
              <MahasiswaProfileForm />
            </ProtectedRoute>
          }
        />
        
        {/* 404 Page */}
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