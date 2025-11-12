import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import aprilLogo from '../assets/icons/april.png';

// Komponen Ikon SVG untuk digunakan kembali
const Icon = ({ path, className = "w-5 h-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d={path} clipRule="evenodd" />
    </svg>
);

const AdminLogin = () => {
    const [email, setEmail] = useState('@april.com');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:8000/login/admin', {
                email,
                password,
            });

            // Simpan token dengan nama kunci yang unik untuk admin
            localStorage.setItem('adminAuthToken', response.data.token);
            navigate('/admin/dashboard');

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Koneksi ke server gagal. Pastikan server backend berjalan.');
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
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Admin Magang Login</h1>
                    <p className="text-slate-500 mb-6">Masuk untuk melihat detail project Anda.</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block font-semibold text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Icon path="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block font-semibold text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Icon path="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>
                        
                        {error && <p className="text-red-500 text-sm text-center font-semibold">{error}</p>}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 font-semibold disabled:bg-slate-400"
                            >
                                {isLoading ? 'Memproses...' : 'Login'}
                            </button>
                        </div>
                    </form>
                </div>
                 <p className="text-center text-gray-400 text-sm mt-8">
                    © {new Date().getFullYear()} APRIL Group. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;

