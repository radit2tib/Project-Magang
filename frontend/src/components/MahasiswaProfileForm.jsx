import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import aprilLogo from '../assets/icons/april.png';

// --- [PENTING] Tentukan API_URL di sini ---
const API_URL = 'http://localhost:8000'; 

const MahasiswaProfileForm = () => {
    const [formData, setFormData] = useState({
        bu: '',
        dept: '',
        // --- DATA BARU ---
        mentor: '',
        co_mentor: '',
        // ----------------
        pakaiKacamata: false,
        riwayatPenyakit: '',
        scholar: '',
        english: '',
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
                const response = await axios.get(`${API_URL}/mahasiswa/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = response.data;
                setFormData({
                    bu: data.bu || '',
                    dept: data.dept || '',
                    // --- ISI DATA BARU DARI DATABASE ---
                    mentor: data.mentor || '',
                    co_mentor: data.co_mentor || '',
                    // -----------------------------------
                    pakaiKacamata: data.pakaiKacamata || false,
                    riwayatPenyakit: data.riwayatPenyakit || '',
                    scholar: data.scholar || '',
                    english: data.english || '', 
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

    if (loading && !formData.bu) { 
        return <div className="flex items-center justify-center h-screen bg-slate-50"><p className="text-lg font-semibold animate-pulse">Memuat formulir...</p></div>;
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="max-w-3xl w-full mx-auto animate-fade-in">
                <div className="text-center mb-8">
                    <img src={aprilLogo} alt="Logo APRIL" className="h-14 mx-auto mb-4" onError={(e) => e.target.src="https://placehold.co/150x50/00966C/FFFFFF?text=APRIL"} />
                    <h1 className="text-3xl font-bold text-slate-800">Lengkapi Profil Anda</h1>
                    <p className="text-slate-500 mt-2">Silakan isi atau perbarui informasi magang Anda di bawah ini.</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* BAGIAN 1: Informasi Penempatan */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">Informasi Penempatan</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block font-semibold text-slate-600 mb-1 text-sm">Business Unit (BU)</label>
                                    <input type="text" name="bu" value={formData.bu} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Contoh: RAPP" />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-600 mb-1 text-sm">Departemen</label>
                                    <input type="text" name="dept" value={formData.dept} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Contoh: IT Department" />
                                </div>
                                
                                {/* --- INPUT MENTOR & CO-MENTOR BARU --- */}
                                <div>
                                    <label className="block font-semibold text-slate-600 mb-1 text-sm">Mentor</label>
                                    <input type="text" name="mentor" value={formData.mentor} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Nama Mentor Anda" />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-600 mb-1 text-sm">Co-Mentor (Opsional)</label>
                                    <input type="text" name="co_mentor" value={formData.co_mentor} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Nama Co-Mentor" />
                                </div>
                                {/* ------------------------------------- */}
                            </div>
                        </div>

                        {/* BAGIAN 2: Informasi Tambahan */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">Informasi Tambahan</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block font-semibold text-slate-600 mb-1 text-sm">Jenis Beasiswa (Scholar)</label>
                                    <input type="text" name="scholar" value={formData.scholar} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Contoh: Tanoto, Djarum" />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-600 mb-1 text-sm">Skor Bahasa Inggris (TOEFL/IELTS)</label>
                                    <input type="text" name="english" value={formData.english} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Contoh: 550 / 6.5" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block font-semibold text-slate-600 mb-1 text-sm">Riwayat Penyakit (jika ada)</label>
                                    <input type="text" name="riwayatPenyakit" value={formData.riwayatPenyakit} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Tulis '-' jika tidak ada" />
                                </div>
                                <div className="flex items-center md:col-span-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                    <input type="checkbox" id="kacamata" name="pakaiKacamata" checked={formData.pakaiKacamata} onChange={handleChange} className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                    <label htmlFor="kacamata" className="ml-3 font-medium text-slate-700 text-sm cursor-pointer">Saya menggunakan kacamata</label>
                                </div>
                            </div>
                        </div>
                        
                        {/* BAGIAN 3: Proyek Akhir */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">Proyek Akhir</h3>
                            <p className="text-slate-500 text-xs mb-4 italic">*Anda bisa mengisi bagian ini nanti jika judul belum ditentukan.</p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block font-semibold text-slate-600 mb-1 text-sm">Judul Kerja Praktik (KP)</label>
                                    <textarea name="judulKp" value={formData.judulKp} onChange={handleChange} rows="2" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Judul laporan KP Anda..."></textarea>
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-600 mb-1 text-sm">Judul Tugas Akhir (TA)</label>
                                    <textarea name="judulTa" value={formData.judulTa} onChange={handleChange} rows="2" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Judul skripsi atau TA Anda..."></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Tombol & Pesan */}
                        <div className="pt-6 border-t border-slate-200">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm font-medium flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    {success}
                                </div>
                            )}
                            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-bold transition-transform transform hover:scale-[1.02] disabled:bg-slate-400 disabled:transform-none">
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Menyimpan...
                                    </span>
                                ) : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MahasiswaProfileForm;