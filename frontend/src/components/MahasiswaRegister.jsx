import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import aprilLogo from '../assets/icons/april.png';

// --- [PENTING] Tentukan API_URL di sini ---
// Gunakan URL tunnel publik port 8000 Anda
const API_URL = 'https://q576mhww-8000.asse.devtunnels.ms'; 
// (Pastikan URL ini sama dengan yang ada di VS Code "PORTS" Anda)

const Icon = ({ path, className = "w-5 h-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d={path} clipRule="evenodd" />
    </svg>
);

const MahasiswaRegister = () => {
    // State untuk setiap input form
    const [nim, setNim] = React.useState('');
    const [nama, setNama] = React.useState('');
    const [angkatan, setAngkatan] = React.useState('');
    const [password, setPassword] = React.useState('');
    
    // State untuk menangani pesan error dan status loading
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        // Validasi sederhana
        if (!nim || !nama || !angkatan || !password) {
            setError("Semua field wajib diisi.");
            setIsLoading(false);
            return;
        }

        try {
            // --- [PERBAIKAN] Menggunakan API_URL ---
            // Kirim data ke endpoint registrasi di backend
            await axios.post(`${API_URL}/register/mahasiswa`, {
                nim,
                nama,
                angkatan: parseInt(angkatan), // Pastikan angkatan adalah angka
                password,
            });

            setSuccess("Registrasi berhasil! Anda akan diarahkan ke halaman login.");
            
            // Tunggu beberapa detik sebelum mengarahkan ke halaman login
            setTimeout(() => {
                navigate('/mahasiswa/login');
            }, 2000);

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Registrasi gagal. Silakan coba lagi.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 text-slate-800 p-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-8">
                    <img src={aprilLogo} alt="Logo APRIL" className="h-16 mx-auto" />
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Daftar Akun Mahasiswa</h1>
                    <p className="text-slate-500 mb-6">Buat akun untuk memulai.</p>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Input NIM */}
                        <div>
                            <label htmlFor="nim" className="block font-semibold text-gray-700 mb-1">NIM</label>
                            <input type="text" id="nim" value={nim} onChange={(e) => setNim(e.target.value)} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
                        </div>

                        {/* Input Nama Lengkap */}
                        <div>
                            <label htmlFor="nama" className="block font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                            <input type="text" id="nama" value={nama} onChange={(e) => setNama(e.target.value)} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
                        </div>

                        {/* Input Angkatan */}
                        <div>
                            <label htmlFor="angkatan" className="block font-semibold text-gray-700 mb-1">Angkatan</label>
                            <input type="number" id="angkatan" value={angkatan} onChange={(e) => setAngkatan(e.target.value)} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" placeholder="Contoh: 2022"/>
                        </div>
                        
                        {/* Input Password */}
                        <div>
                            <label htmlFor="password" className="block font-semibold text-gray-700 mb-1">Password</label>
                            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
                        </div>
                        
                        {error && <p className="text-red-500 text-sm text-center font-semibold">{error}</p>}
                        {success && <p className="text-green-500 text-sm text-center font-semibold">{success}</p>}

                        <div>
                            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 font-semibold disabled:bg-slate-400">
                                {isLoading ? 'Mendaftarkan...' : 'Daftar'}
                            </button>
                        </div>
                    </form>

                     <p className="text-center text-sm text-slate-500 mt-6">
                        Sudah punya akun?{' '}
                        <Link to="/mahasiswa/login" className="font-semibold text-blue-600 hover:underline">
                            Login di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MahasiswaRegister;