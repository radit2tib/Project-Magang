import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import aprilLogo from '../assets/icons/april.png';

// --- [PENTING] Tentukan API_URL di sini ---
// Gunakan URL tunnel publik port 8000 Anda
const API_URL = 'https://q576mhww-8000.asse.devtunnels.ms'; 
// (Pastikan URL ini sama dengan yang ada di VS Code "PORTS" Anda)


const MahasiswaProfileForm = () => {
    const [formData, setFormData] = useState({
        bu: '',
        dept: '',
        pakaiKacamata: false,
        riwayatPenyakit: '',
        scholar: '',
        judulKp: '',
        judulTa: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCurrentData = async () => {
            try {
                const token = localStorage.getItem('mahasiswaAuthToken');
                
                // --- [PERBAIKAN 1] Menggunakan API_URL ---
                const response = await axios.get(`${API_URL}/mahasiswa/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = response.data;
                setFormData({
                    bu: data.bu || '',
                    dept: data.dept || '',
                    pakaiKacamata: data.pakaiKacamata || false,
                    riwayatPenyakit: data.riwayatPenyakit || '',
                    scholar: data.scholar || '',
                    judulKp: data.judulKp || '',
                    judulTa: data.judulTa || ''
                });
            } catch (err) {
                setError('Gagal memuat data profil saat ini.');
            } finally {
                setLoading(false);
            }
        };
        fetchCurrentData();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('mahasiswaAuthToken');
            
            // --- [PERBAIKAN 2] Menggunakan API_URL dan method PUT ---
            await axios.put(`${API_URL}/mahasiswa/profile`, formData, { 
                headers: { Authorization: `Bearer ${token}` }
            })
            setSuccess('Profil berhasil diperbarui!');
            setTimeout(() => navigate('/mahasiswa/dashboard'), 1500);
        } catch (err) {
            setError('Gagal memperbarui profil. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !formData.bu) { // Show loading only on initial fetch
        return <div className="flex items-center justify-center h-screen bg-slate-50"><p>Loading form...</p></div>;
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="max-w-2xl w-full mx-auto">
                <div className="text-center mb-8">
                    <img src={aprilLogo} alt="Logo APRIL" className="h-16 mx-auto" />
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Lengkapi Profil Anda</h1>
                    <p className="text-slate-500 mb-6">Silakan isi atau perbarui informasi di bawah ini.</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* BU & Departemen */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">Business Unit (BU)</label>
                                <input type="text" name="bu" value={formData.bu} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
                            </div>
                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">Departemen</label>
                                <input type="text" name="dept" value={formData.dept} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
                            </div>
                        </div>

                        {/* Info Tambahan */}
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">Scholar</label>
                            <input type="text" name="scholar" value={formData.scholar} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">Riwayat Penyakit Tertentu (jika ada)</label>
                            <input type="text" name="riwayatPenyakit" value={formData.riwayatPenyakit} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" name="pakaiKacamata" checked={formData.pakaiKacamata} onChange={handleChange} className="h-5 w-5 text-blue-600 border-gray-300 rounded" />
                            <label className="ml-2 font-semibold text-gray-700">Apakah Anda memakai kacamata?</label>
                        </div>
                        
                        <hr className="my-6" />

                        {/* Judul KP & TA */}
                        <p className="text-slate-600 text-sm">Anda bisa mengisi judul KP dan TA sekarang atau memperbaruinya nanti.</p>
                         <div>
                            <label className="block font-semibold text-gray-700 mb-1">Judul Kerja Praktik (KP)</label>
                            <textarea name="judulKp" value={formData.judulKp} onChange={handleChange} rows="2" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"></textarea>
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">Judul Tugas Akhir (TA)</label>
                            <textarea name="judulTa" value={formData.judulTa} onChange={handleChange} rows="2" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"></textarea>
                        </div>
                        
                        {/* Tombol & Pesan */}
                        <div className="pt-4">
                            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                            {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}
                            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 font-semibold disabled:bg-slate-400">
                                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MahasiswaProfileForm;