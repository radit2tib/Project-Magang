import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import aprilLogo from '../assets/icons/april.png';

// Pastikan API_URL sesuai dengan backend
const API_URL = 'http://localhost:8000'; 

const MahasiswaLogin = () => {
    const [nim, setNim] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_URL}/login/mahasiswa`, {
                nim,
                password,
            });
            
            // --- [PERBAIKAN UTAMA DI SINI] ---
            // 1. Simpan token dengan nama standar 'token'
            localStorage.setItem('token', response.data.token);
            
            // 2. WAJIB: Simpan role sebagai 'mahasiswa'
            localStorage.setItem('role', 'mahasiswa');

            // 3. Arahkan pengguna
            if (response.data.isProfileComplete) {
                navigate('/mahasiswa/dashboard');
            } else {
                navigate('/mahasiswa/lengkapi-profil');
            }

        } catch (err) {
            const message = err.response?.data?.msg || 'Login gagal. Cek NIM/Password atau koneksi server.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-800" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="w-full max-w-md mx-auto p-4">
                <div className="text-center mb-8">
                    <img src={aprilLogo} alt="Logo APRIL" className="w-95 h-22 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-slate-800">Login Mahasiswa Magang</h1>
                    <p className="text-slate-500 mt-2">Masuk untuk melihat detail project Anda.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="nim" className="block font-semibold text-gray-700 mb-1">
                                NIM (Nomor Induk Mahasiswa)
                            </label>
                            <input 
                                type="text" 
                                id="nim" 
                                value={nim} 
                                onChange={(e) => setNim(e.target.value)}
                                required 
                                placeholder="Contoh: 2255301097"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block font-semibold text-gray-700 mb-1">
                                Password
                            </label>
                            <input 
                                type="password" 
                                id="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>
                        
                        {error && (
                            <p className="text-red-600 text-sm text-center font-semibold bg-red-100 p-3 rounded-lg border border-red-200">
                                {error}
                            </p>
                        )}

                        <div>
                            <button 
                                type="submit" 
                                disabled={isLoading} 
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:-translate-y-0.5 disabled:bg-slate-400 disabled:transform-none"
                            >
                                {isLoading ? 'Memproses...' : 'Login'}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-sm text-slate-600 mt-6">
                        Belum punya akun?{' '}
                        <Link to="/mahasiswa/register" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                            Daftar di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MahasiswaLogin;